interface OrderItem {
  _id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  details?: { label: string; value: string }[];
}

interface ShippingAddress {
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentMethod {
  type: "card" | "paypal" | "bank";
  lastFour?: string;
  cardBrand?: string;
  email?: string;
}

interface OrderSummaryData {
  orderNumber: string;
  orderDate: string;
  status: "confirmed" | "processing" | "shipped" | "delivered";
  email: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount?: number;
  total: number;
  shippingAddress: ShippingAddress;
  shippingMethod: string;
  estimatedDelivery: string;
  paymentMethod: PaymentMethod;
}

const DEFAULT_ORDER: OrderSummaryData = {
  orderNumber: "ORD-2024-78432",
  orderDate: "December 14, 2024",
  status: "confirmed",
  email: "customer@example.com",
  items: [
    {
      _id: "1",
      name: "Minimalist Beige Sneakers",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/Minimalist-Beige-Sneakers-2.png",
      price: 120.0,
      quantity: 1,
      details: [
        { label: "Size", value: "42" },
        { label: "Color", value: "Beige" },
      ],
    },
    {
      _id: "2",
      name: "Embroidered Blue Top",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/Woman-in-Embroidered-Blue-Top-2.png",
      price: 140.0,
      quantity: 2,
      details: [
        { label: "Size", value: "M" },
        { label: "Color", value: "Blue" },
      ],
    },
    {
      _id: "3",
      name: "Classic Fedora Hat",
      image:
        "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/accessories/Classic-Fedora-Hat-2.png",
      price: 84.0,
      quantity: 1,
      details: [{ label: "Size", value: "One Size" }],
    },
  ],
  subtotal: 484.0,
  shipping: 12.0,
  tax: 38.72,
  discount: 50.0,
  total: 484.72,
  shippingAddress: {
    name: "Alex Johnson",
    street: "1234 Maple Street, Apt 5B",
    city: "San Francisco",
    state: "CA",
    zipCode: "94102",
    country: "United States",
  },
  shippingMethod: "Express Shipping",
  estimatedDelivery: "December 18-20, 2024",
  paymentMethod: {
    type: "card",
    lastFour: "4242",
    cardBrand: "Visa",
  },
};

interface OrderSummary1Props {
  order?: OrderSummaryData;
  className?: string;
}

export type {
  OrderItem,
  ShippingAddress,
  PaymentMethod,
  OrderSummaryData,
  OrderSummary1Props,
};
export { DEFAULT_ORDER };
