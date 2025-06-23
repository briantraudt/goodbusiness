
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

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
              description: `Scheduled for ${selectedDate} at ${selectedTime}` 
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
      },
    });

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
