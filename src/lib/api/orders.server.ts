import fs from "node:fs/promises";
import path from "node:path";
import nodemailer from "nodemailer";

export interface Order {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  type: string;
  message: string;
  status: "new" | "read" | "replied";
}

const DATA_DIR = path.resolve(process.cwd(), "src/data");
const DATA_FILE = path.join(DATA_DIR, "orders.json");

async function ensureDataFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(DATA_FILE);
    } catch {
      await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2), "utf-8");
    }
  } catch (error) {
    console.error("Error ensuring data file exists:", error);
  }
}

export async function serverSubmitOrder(data: { name: string; email: string; type: string; message: string }) {
  await ensureDataFile();

  const newOrder: Order = {
    id: Math.random().toString(36).substring(2, 11),
    createdAt: new Date().toISOString(),
    name: data.name,
    email: data.email,
    type: data.type,
    message: data.message,
    status: "new",
  };

  let orders: Order[] = [];
  try {
    const content = await fs.readFile(DATA_FILE, "utf-8");
    orders = JSON.parse(content);
  } catch (e) {
    console.error("Error reading orders file, resetting data", e);
  }

  orders.unshift(newOrder);

  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(orders, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to write to orders file", e);
  }

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
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
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
      to: "aluchastudios67@gmail.com",
      subject: `New Inquiry from ${data.name} - ${data.type}`,
      body: emailBody,
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
  await ensureDataFile();
  try {
    const content = await fs.readFile(DATA_FILE, "utf-8");
    const orders: Order[] = JSON.parse(content);
    return orders;
  } catch (e) {
    console.error("Error reading orders file", e);
    return [];
  }
}

export async function serverUpdateOrderStatus(id: string, status: "new" | "read" | "replied") {
  await ensureDataFile();
  try {
    const content = await fs.readFile(DATA_FILE, "utf-8");
    let orders: Order[] = JSON.parse(content);
    
    const orderIndex = orders.findIndex((o) => o.id === id);
    if (orderIndex !== -1) {
      orders[orderIndex].status = status;
      await fs.writeFile(DATA_FILE, JSON.stringify(orders, null, 2), "utf-8");
      return { success: true, order: orders[orderIndex] };
    }
    return { success: false, error: "Order not found" };
  } catch (e: any) {
    console.error("Error updating order status", e);
    return { success: false, error: e?.message || "Internal error" };
  }
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
  await ensureDataFile();
  try {
    const content = await fs.readFile(DATA_FILE, "utf-8");
    let orders: Order[] = JSON.parse(content);
    const lengthBefore = orders.length;
    orders = orders.filter((o) => o.id !== id);
    if (orders.length === lengthBefore) {
      return { success: false, error: "Order not found" };
    }
    await fs.writeFile(DATA_FILE, JSON.stringify(orders, null, 2), "utf-8");
    return { success: true };
  } catch (e: any) {
    console.error("Error deleting order", e);
    return { success: false, error: e?.message || "Internal error" };
  }
}
