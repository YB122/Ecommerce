/** Stripe integration: create checkout session, handle payment webhook */
import Stripe from "stripe";
export declare const createCheckoutSession: (orderId: string, totalAmount: number, items: {
    en_name: string;
    quantity: number;
    price: number;
}[]) => Promise<Stripe.Checkout.Session | null>;
export declare const handleWebhook: (body: Buffer, signature: string) => Promise<{
    received: boolean;
    error?: string;
}>;
//# sourceMappingURL=stripe.service.d.ts.map