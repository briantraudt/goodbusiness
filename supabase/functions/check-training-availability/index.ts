
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
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
    const { date } = await req.json();

    if (!date) {
      throw new Error("Date is required");
    }

    // Initialize Supabase
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_ANON_KEY") || ""
    );

    // Check if 12pm-1pm CST is available for this date
    const bookingDate = new Date(date).toISOString().split('T')[0];
    const { data: existingBooking, error } = await supabase
      .from('training_bookings')
      .select('id')
      .eq('booking_date', bookingDate)
      .eq('booking_time', '12:00 PM - 1:00 PM CST')
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error("Error checking availability");
    }

    const isAvailable = !existingBooking;

    return new Response(JSON.stringify({ available: isAvailable }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error checking availability:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
