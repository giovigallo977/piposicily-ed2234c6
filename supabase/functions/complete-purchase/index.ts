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

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

  const adminHeaders = {
    "Authorization": `Bearer ${serviceRoleKey}`,
    "apikey": serviceRoleKey,
    "Content-Type": "application/json",
  };

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  try {
    const { session_id } = await req.json();
    if (!session_id) {
      throw new Error("session_id is required");
    }

    // 1. Verify payment with Stripe
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

    // 2. Find existing user
    const listRes = await fetch(
      `${supabaseUrl}/auth/v1/admin/users?page=1&per_page=1000`,
      { headers: adminHeaders }
    );
    const listData = await listRes.json();
    const existingUser = listData?.users?.find(
      (u: any) => u.email === email
    );

    let userId: string;

    if (existingUser) {
      userId = existingUser.id;
    } else {
      // 3. Create user with random password (magic link only)
      const randomPassword = crypto.randomUUID() + crypto.randomUUID();
      const createRes = await fetch(
        `${supabaseUrl}/auth/v1/admin/users`,
        {
          method: "POST",
          headers: adminHeaders,
          body: JSON.stringify({ email, password: randomPassword, email_confirm: true }),
        }
      );
      if (!createRes.ok) {
        const err = await createRes.text();
        console.error("Failed to create user:", err);
        throw new Error("Failed to create user");
      }
      const createData = await createRes.json();
      userId = createData.id;

      // Wait for handle_new_user trigger
      await new Promise((r) => setTimeout(r, 500));
    }

    // 4. Update profile as premium
    await supabaseAdmin
      .from("profiles")
      .update({
        is_premium: true,
        premium_since: new Date().toISOString(),
        stripe_session_id: session_id,
      })
      .eq("user_id", userId);

    // 5. Send magic link via OTP REST API
    const origin = req.headers.get("origin") || "https://piposicily.lovable.app";
    const otpRes = await fetch(`${supabaseUrl}/auth/v1/otp`, {
      method: "POST",
      headers: {
        "apikey": serviceRoleKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        create_user: false,
        gotrue_meta_security: {},
        code_challenge: null,
        code_challenge_method: null,
        email_redirect_to: origin,
      }),
    });

    if (!otpRes.ok) {
      const otpErr = await otpRes.text();
      console.error("Failed to send magic link:", otpErr);
      // Don't throw — purchase is complete, magic link is secondary
    }

    return new Response(JSON.stringify({ success: true, email }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Purchase completion failed:", error);
    return new Response(
      JSON.stringify({ error: "Unable to complete purchase" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
