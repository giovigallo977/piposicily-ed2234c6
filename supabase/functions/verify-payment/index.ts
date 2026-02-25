import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseAdmin.auth.getUser(token);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated");

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Check if user has completed a payment for our product
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    if (customers.data.length === 0) {
      return new Response(JSON.stringify({ isPremium: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const sessions = await stripe.checkout.sessions.list({
      customer: customers.data[0].id,
      limit: 10,
    });

    const paid = sessions.data.some(s => s.payment_status === "paid" && s.mode === "payment");

    if (paid) {
      // Update profile to premium
      await supabaseAdmin
        .from("profiles")
        .update({ is_premium: true, premium_since: new Date().toISOString() })
        .eq("user_id", user.id);
    }

    return new Response(JSON.stringify({ isPremium: paid }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
