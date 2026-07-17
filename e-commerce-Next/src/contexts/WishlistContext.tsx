"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import api from "@/lib/api"
import { parseImageURLs } from "@/lib/locale"

export interface WishlistItem {
  _id: string
  name: string
  image: string
  price: number
  originalPrice?: number
  inStock: boolean
  priceDrop?: boolean
  link?: string
}

interface WishlistContextType {
  items: WishlistItem[]
  addItem: (item: WishlistItem) => void
  removeItem: (_id: string) => void
  toggleItem: (item: WishlistItem) => void
  isInWishlist: (_id: string) => boolean
  clearWishlist: () => void
  fetchFromApi: (token: string, role: string) => Promise<void>
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

const STORAGE_KEY = "wishlist-items"

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>(() => {
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

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = (item: WishlistItem) => {
    setItems((prev) => {
      if (prev.some((i) => i._id === item._id)) return prev
      return [...prev, item]
    })
  }

  const removeItem = (_id: string) => {
    setItems((prev) => prev.filter((i) => i._id !== _id))
  }

  const toggleItem = (item: WishlistItem) => {
    setItems((prev) => {
      const exists = prev.some((i) => i._id === item._id)
      return exists ? prev.filter((i) => i._id !== item._id) : [...prev, item]
    })
  }

  const isInWishlist = (_id: string) => items.some((i) => i._id === _id)

  const clearWishlist = () => setItems([])

  const fetchFromApi = async (token: string, role: string) => {
    try {
      const res = await api.get("/wishlist")
      const wishData = res.data?.data
      if (Array.isArray(wishData)) {
        const mapped: WishlistItem[] = wishData.map((wi: any) => {
          const images = wi.product ? parseImageURLs(wi.product) : []
          return {
            _id: String(wi.productId || wi.product_id || wi._id || wi.product?._id),
            name: wi.product?.en_name || wi.name || "",
            image: images[0] || wi.image || "",
            price: wi.product?.price ?? wi.price ?? 0,
            inStock: true,
          }
        })
        setItems(mapped)
      }
    } catch {
      // silent
    }
  }

  return (
    <WishlistContext.Provider value={{ items, addItem, removeItem, toggleItem, isInWishlist, clearWishlist, fetchFromApi }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error("useWishlist must be used within a WishlistProvider")
  return ctx
}
