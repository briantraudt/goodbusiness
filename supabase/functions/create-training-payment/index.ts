
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name, selectedDate, selectedTime } = await req.json();

    if (!email || !name || !selectedDate || !selectedTime) {
      throw new Error("Missing required fields");
    }

    // Initialize Supabase with service role for database operations
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );

    // Check if this time slot is already booked
    const bookingDate = new Date(selectedDate).toISOString().split('T')[0];
    const { data: existingBooking, error: checkError } = await supabaseAdmin
      .from('training_bookings')
      .select('id')
      .eq('booking_date', bookingDate)
      .eq('booking_time', selectedTime)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw new Error("Error checking booking availability");
    }

    if (existingBooking) {
      throw new Error("This time slot is already booked. Please select a different date.");
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Create a one-time payment session for $250
    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { 
              name: "AI 101 Training Class - 1 Hour Session",
              description: `Scheduled for ${selectedDate} at ${selectedTime} CST` 
            },
            unit_amount: 25000, // $250.00 in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/training/success?session_id={CHECKOUT_SESSION_ID}&date=${encodeURIComponent(selectedDate)}&time=${encodeURIComponent(selectedTime)}`,
      cancel_url: `${req.headers.get("origin")}/training`,
      metadata: {
        customer_name: name,
        training_date: selectedDate,
        training_time: selectedTime,
        customer_email: email,
      },
    });

    // Store the booking in our database
    const { error: insertError } = await supabaseAdmin
      .from('training_bookings')
      .insert({
        name: name,
        email: email,
        booking_date: bookingDate,
        booking_time: selectedTime,
        stripe_session_id: session.id,
      });

    if (insertError) {
      console.error('Error storing booking:', insertError);
      throw new Error("Error storing booking information");
    }

    // Send notification email to brian@goodbusinesshq.com
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    
    try {
      await resend.emails.send({
        from: "Training Bookings <onboarding@resend.dev>",
        to: ["brian@goodbusinesshq.com"],
        subject: "New AI 101 Training Class Booking",
        html: `
          <h2>New Training Class Booking</h2>
          <p><strong>Student Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Date:</strong> ${selectedDate}</p>
          <p><strong>Time:</strong> ${selectedTime} CST</p>
          <p><strong>Stripe Session ID:</strong> ${session.id}</p>
          <p><strong>Payment Amount:</strong> $250.00</p>
          <br>
          <p>The student will receive a confirmation email and Zoom details closer to the session date.</p>
        `,
      });
    } catch (emailError) {
      console.error('Error sending notification email:', emailError);
      // Don't fail the booking if email fails
    }

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error creating payment session:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
