"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import api from "@/lib/api"
import { parseImageURLs } from "@/lib/locale"

export interface CartItem {
  _id: string
  productId?: string
  name: string
  en_name?: string
  fr_name?: string
  ar_name?: string
  image: string
  price: number
  originalPrice?: number
  quantity: number
  color?: string
  size?: string
  link?: string
  details?: { label: string; value: string }[]
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void
  removeItem: (_id: string) => void
  updateQuantity: (_id: string, quantity: number) => void
  clearCart: () => void
  itemCount: number
  subtotal: number
  shippingCost: number
  total: number
  currency: string
  fetchFromApi: (token: string, role: string) => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const STORAGE_KEY = "cart-items"

function computeShipping(subtotal: number): number {
  const costType = process.env.NEXT_PUBLIC_SHIPPING_COST_TYPE || "fixed"
  const costValue = Number(process.env.NEXT_PUBLIC_SHIPPING_COST_VALUE) || 50
  return costType === "percentage"
    ? Math.round((subtotal * costValue) / 100 * 100) / 100
    : costValue
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        return stored ? JSON.parse(stored) : []
      } catch {
        return []
      }
    }
    return []
  })

  const [shippingCost, setShippingCost] = useState<number | null>(null)
  const [currency, setCurrency] = useState<string>("EGP")

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = (newItem: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    setItems((prev) => {
      const existing = prev.find((i) => i._id === newItem._id)
      if (existing) {
        return prev.map((i) =>
          i._id === newItem._id ? { ...i, quantity: i.quantity + (newItem.quantity ?? 1) } : i,
        )
      }
      return [...prev, { ...newItem, quantity: newItem.quantity ?? 1 }]
    })
  }

  const removeItem = (_id: string) => {
    setItems((prev) => prev.filter((i) => i._id !== _id))
  }

  const updateQuantity = (_id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(_id)
      return
    }
    setItems((prev) => prev.map((i) => (i._id === _id ? { ...i, quantity } : i)))
  }

  const clearCart = () => setItems([])

  const fetchFromApi = async (token: string, role: string) => {
    try {
      const res = await api.get("/cart")
      const cartData = res.data?.data
      if (cartData?.items && Array.isArray(cartData.items)) {
        const mapped: CartItem[] = cartData.items.map((ci: any) => {
          const images = ci.product ? parseImageURLs(ci.product) : []
          const discountedPrice = ci.product?.discount
            ? ci.product.price - (ci.product.price * ci.product.discount) / 100
            : ci.product?.price
          return {
            _id: String(ci._id || ci.productId || ci.product_id),
            productId: String(ci.product?._id || ci.productId || ci.product_id || ci._id),
            name: ci.product?.en_name || ci.name || "",
            en_name: ci.product?.en_name || "",
            fr_name: ci.product?.fr_name || "",
            ar_name: ci.product?.ar_name || "",
            image: images[0] || ci.image || "",
            price: discountedPrice ?? 0,
            originalPrice: ci.product?.discount ? ci.product.price : undefined,
            quantity: ci.quantity ?? 1,
            color: ci.color,
            size: ci.size,
          }
        })
        setItems(mapped)
        if (cartData.shippingCost !== undefined) setShippingCost(cartData.shippingCost)
        if (cartData.currency) setCurrency(cartData.currency)
      }
    } catch {
      // silent — fall back to local
    }
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const computedShipping = shippingCost !== null ? shippingCost : computeShipping(subtotal)
  const total = Math.round((subtotal + computedShipping) * 100) / 100

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, itemCount: items.reduce((sum, i) => sum + i.quantity, 0), subtotal, shippingCost: computedShipping, total, currency, fetchFromApi }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within a CartProvider")
  return ctx
}
