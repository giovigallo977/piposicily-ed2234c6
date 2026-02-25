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
    const { session_id, password } = await req.json();
    if (!session_id || !password) {
      throw new Error("session_id and password are required");
    }
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    // Verify payment with Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (session.payment_status !== "paid") {
      throw new Error("Payment not completed");
    }

    const email = session.customer_details?.email || session.customer_email;
    if (!email) {
      throw new Error("No email found in payment session");
    }

    // Check if user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(u => u.email === email);

    let userId: string;

    if (existingUser) {
      // User exists — update password and ensure premium
      userId = existingUser.id;
      await supabaseAdmin.auth.admin.updateUser(userId, { password });
    } else {
      // Create new user
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });
      if (createError) throw createError;
      userId = newUser.user.id;
    }

    // Mark as premium (the trigger handle_new_user creates the profile row)
    // Small delay to let the trigger fire for new users
    if (!existingUser) {
      await new Promise(r => setTimeout(r, 500));
    }

    await supabaseAdmin
      .from("profiles")
      .update({
        is_premium: true,
        premium_since: new Date().toISOString(),
        stripe_session_id: session_id,
      })
      .eq("user_id", userId);

    return new Response(JSON.stringify({ success: true, email }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Purchase completion failed:", error);
    return new Response(JSON.stringify({ error: "Unable to complete purchase" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
