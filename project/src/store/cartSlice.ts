import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { CartItem } from '../types'

const STORAGE_KEY = 'ra16-cart'

const loadCart = (): CartItem[] => {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return []
    }
    return JSON.parse(stored) as CartItem[]
  } catch {
    return []
  }
}

const saveCart = (items: CartItem[]) => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

const initialState = {
  items: loadCart(),
  orderStatus: 'idle' as 'idle' | 'loading' | 'success' | 'error',
  orderError: null as string | null,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(
      state,
      action: PayloadAction<{
        id: number
        size: string
        count: number
        price: number
        title: string
        image: string
        color: string
        sku: string
      }>,
    ) {
      const { id, size, count, price, title, image, color, sku } = action.payload
      const existing = state.items.find(item => item.id === id && item.size === size)
      if (existing) {
        existing.count = Math.min(10, existing.count + count)
      } else {
        state.items.push({
          id,
          size,
          count,
          price,
          title,
          image,
          color,
          sku,
        })
      }
      saveCart(state.items)
    },
    removeFromCart(state, action: PayloadAction<{ id: number; size: string }>) {
      state.items = state.items.filter(item => item.id !== action.payload.id || item.size !== action.payload.size)
      saveCart(state.items)
    },
    clearCart(state) {
      state.items = []
      saveCart(state.items)
    },
    placeOrderRequest(
      state,
      action: PayloadAction<{ phone: string; address: string; items: Array<{ id: number; price: number; count: number }> }>,
    ) {
      void action
      state.orderStatus = 'loading'
      state.orderError = null
    },
    placeOrderSuccess(state) {
      state.orderStatus = 'success'
      state.orderError = null
      state.items = []
      saveCart(state.items)
    },
    placeOrderFailure(state, action: PayloadAction<string>) {
      state.orderStatus = 'error'
      state.orderError = action.payload
    },
  },
})

export const { addToCart, removeFromCart, clearCart, placeOrderRequest, placeOrderSuccess, placeOrderFailure } = cartSlice.actions
export default cartSlice.reducer
