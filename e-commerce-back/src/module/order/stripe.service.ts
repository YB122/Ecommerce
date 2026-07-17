/** Stripe integration: create checkout session, handle payment webhook */
import Stripe from "stripe";
import { env } from "../../../config/env.service.js";
import { orderModel } from "../../database/model/order.model.js";

const stripe = new Stripe(env.Secret_key_Stripe || "");

export const createCheckoutSession = async (
  orderId: string,
  totalAmount: number,
  items: { en_name: string; quantity: number; price: number }[],
): Promise<Stripe.Checkout.Session | null> => {
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: items.map((item) => ({
        price_data: {
          currency: env.CURRENCY?.toLowerCase() || "egp",
          product_data: { name: item.en_name },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      metadata: { orderId: String(orderId) },
      shipping_address_collection: {
        allowed_countries: ["US", "EG", "SA", "AE"],
      },
      success_url: `${env.base_url}/complete?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.base_url}/cancel`,
    });

    return session;
  } catch (error) {
    console.error("Stripe session error:", error);
    return null;
  }
};

export const handleWebhook = async (
  body: Buffer,
  signature: string,
): Promise<{ received: boolean; error?: string }> => {
  try {
    const webhookSecret = env.STRIPE_WEBHOOK_SECRET || "";
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;

      if (orderId) {
        await orderModel.findByIdAndUpdate(orderId, {
          paymentStatus: "paid",
          orderStatus: "processing",
        });
      }
    }

    return { received: true };
  } catch (error: any) {
    console.error("Webhook error:", error.message);
    return { received: false, error: error.message };
  }
};
