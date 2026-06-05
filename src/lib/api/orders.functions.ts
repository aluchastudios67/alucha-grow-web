import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export interface Order {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  type: string;
  message: string;
  status: "new" | "read" | "replied";
}

export const submitOrder = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      name: z.string().min(1),
      email: z.string().email(),
      type: z.string().min(1),
      message: z.string().min(1),
    })
  )
  .handler(async ({ data }) => {
    const { serverSubmitOrder } = await import("./orders.server");
    return serverSubmitOrder(data);
  });

export const getOrders = createServerFn({ method: "GET" })
  .handler(async () => {
    const { serverGetOrders } = await import("./orders.server");
    return serverGetOrders();
  });

export const updateOrderStatus = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      id: z.string(),
      status: z.enum(["new", "read", "replied"]),
    })
  )
  .handler(async ({ data }) => {
    const { serverUpdateOrderStatus } = await import("./orders.server");
    return serverUpdateOrderStatus(data.id, data.status);
  });

export const checkSmtpStatus = createServerFn({ method: "GET" })
  .handler(async () => {
    const { serverCheckSmtpStatus } = await import("./orders.server");
    return serverCheckSmtpStatus();
  });

export const deleteOrder = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const { serverDeleteOrder } = await import("./orders.server");
    return serverDeleteOrder(data.id);
  });
