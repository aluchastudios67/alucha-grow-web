import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";

export interface Order {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  type: string;
  message: string;
  status: "new" | "read" | "replied";
}

// --- Supabase client (server-side only) ---
function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.error("[Supabase] Missing env vars:", {
      SUPABASE_URL: url ? "✓ set" : "✗ MISSING",
      SUPABASE_ANON_KEY: key ? "✓ set" : "✗ MISSING",
    });
    throw new Error("Supabase env vars not set (SUPABASE_URL / SUPABASE_ANON_KEY)");
  }
  return createClient(url, key);
}

// Map DB row → Order shape
function rowToOrder(row: any): Order {
  return {
    id: row.id,
    createdAt: row.created_at,
    name: row.name,
    email: row.email,
    type: row.type,
    message: row.message,
    status: row.status,
  };
}

export async function serverSubmitOrder(data: {
  name: string;
  email: string;
  type: string;
  message: string;
}) {
  const supabase = getSupabase();

  const newOrder: Order = {
    id: Math.random().toString(36).substring(2, 11),
    createdAt: new Date().toISOString(),
    name: data.name,
    email: data.email,
    type: data.type,
    message: data.message,
    status: "new",
  };

  const { error } = await supabase.from("orders").insert({
    id: newOrder.id,
    created_at: newOrder.createdAt,
    name: newOrder.name,
    email: newOrder.email,
    type: newOrder.type,
    message: newOrder.message,
    status: newOrder.status,
  });

  if (error) {
    console.error("Supabase insert error:", error);
    throw new Error(error.message);
  }

  // --- Send email notification ---
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  const emailBody = `New website inquiry/order received:

Name: ${data.name}
Email: ${data.email}
Project Type: ${data.type}
Message:
${data.message}

You can manage this order in the admin panel.`;

  let emailSent = false;
  let emailError = "";

  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(smtpPort || 587),
        secure: Number(smtpPort || 587) === 465,
        auth: { user: smtpUser, pass: smtpPass },
      });

      await transporter.sendMail({
        from: `"Alucha Studios Submissions" <${smtpUser}>`,
        to: "aluchastudios67@gmail.com",
        subject: `New Inquiry from ${data.name} - ${data.type}`,
        text: emailBody,
      });

      emailSent = true;
    } catch (err: any) {
      console.error("Error sending email via SMTP:", err);
      emailError = err?.message || "Unknown SMTP error";
    }
  } else {
    console.log(`[SMTP Not Configured] Mock email routed to aluchastudios67@gmail.com:`, {
      subject: `New Inquiry from ${data.name} - ${data.type}`,
    });
    emailError = "SMTP environment variables not configured";
  }

  return {
    success: true,
    emailSent,
    emailError: emailError || undefined,
    order: newOrder,
  };
}

export async function serverGetOrders(): Promise<Order[]> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase fetch error:", error);
    return [];
  }

  return (data ?? []).map(rowToOrder);
}

export async function serverUpdateOrderStatus(
  id: string,
  status: "new" | "read" | "replied"
) {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Supabase update error:", error);
    return { success: false, error: error.message };
  }

  return { success: true, order: rowToOrder(data) };
}

export async function serverCheckSmtpStatus() {
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  return {
    isConfigured: !!(smtpHost && smtpUser && process.env.SMTP_PASS),
    smtpHost: smtpHost || null,
    smtpUser: smtpUser || null,
  };
}

export async function serverDeleteOrder(id: string) {
  const supabase = getSupabase();

  const { error } = await supabase.from("orders").delete().eq("id", id);

  if (error) {
    console.error("Supabase delete error:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}
