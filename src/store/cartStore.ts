import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product, SelectedVariant } from '@/types'

export interface CartItem {
    product: Product
    quantity: number
    selectedVariant: SelectedVariant | null
}

interface CartState {
    items: { [storeId: string]: CartItem[] }

    // Actions
    addToCart: (product: Product, quantity: number, variant?: SelectedVariant | null) => void
    removeFromCart: (storeId: string, productId: string, variant?: SelectedVariant | null) => void
    updateQuantity: (storeId: string, productId: string, quantity: number, variant?: SelectedVariant | null) => void
    clearCart: () => void
    clearStoreCart: (storeId: string) => void

    // Computed
    getTotalItems: () => number
    getTotalPrice: () => number
    getStoreTotal: (storeId: string) => number
    getItemCount: (storeId: string) => number
}

const variantKey = (variant: SelectedVariant | null | undefined): string => {
    if (!variant) return ''
    return Object.entries(variant).sort().map(([k, v]) => `${k}:${v}`).join('|')
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: {},

            addToCart: (product, quantity, variant = null) => {
                set((state) => {
                    const storeItems = state.items[product.store_id] || []
                    const existingIndex = storeItems.findIndex(
                        (item) => item.product.id === product.id && variantKey(item.selectedVariant) === variantKey(variant)
                    )

                    if (existingIndex >= 0) {
                        const updated = [...storeItems]
                        updated[existingIndex] = {
                            ...updated[existingIndex],
                            quantity: updated[existingIndex].quantity + quantity,
                        }
                        return {
                            items: { ...state.items, [product.store_id]: updated },
                        }
                    }

                    return {
                        items: {
                            ...state.items,
                            [product.store_id]: [...storeItems, { product, quantity, selectedVariant: variant }],
                        },
                    }
                })
            },

            removeFromCart: (storeId, productId, variant = null) => {
                set((state) => {
                    const storeItems = state.items[storeId] || []
                    const filtered = storeItems.filter(
                        (item) => !(item.product.id === productId && variantKey(item.selectedVariant) === variantKey(variant))
                    )

                    if (filtered.length === 0) {
                        const { [storeId]: _, ...rest } = state.items
                        return { items: rest }
                    }

                    return { items: { ...state.items, [storeId]: filtered } }
                })
            },

            updateQuantity: (storeId, productId, quantity, variant = null) => {
                if (quantity <= 0) {
                    get().removeFromCart(storeId, productId, variant)
                    return
                }

                set((state) => {
                    const storeItems = state.items[storeId] || []
                    const updated = storeItems.map((item) =>
                        item.product.id === productId && variantKey(item.selectedVariant) === variantKey(variant)
                            ? { ...item, quantity }
                            : item
                    )
                    return { items: { ...state.items, [storeId]: updated } }
                })
            },

            clearCart: () => set({ items: {} }),

            clearStoreCart: (storeId) => {
                set((state) => {
                    const { [storeId]: _, ...rest } = state.items
                    return { items: rest }
                })
            },

            getTotalItems: () => {
                const items = get().items
                return Object.values(items).flat().reduce((sum, item) => sum + item.quantity, 0)
            },

            getTotalPrice: () => {
                const items = get().items
                return Object.values(items).flat().reduce((sum, item) => {
                    const price = item.product.discount_price || item.product.price
                    return sum + price * item.quantity
                }, 0)
            },

            getStoreTotal: (storeId) => {
                const storeItems = get().items[storeId] || []
                return storeItems.reduce((sum, item) => {
                    const price = item.product.discount_price || item.product.price
                    return sum + price * item.quantity
                }, 0)
            },

            getItemCount: (storeId) => {
                const storeItems = get().items[storeId] || []
                return storeItems.reduce((sum, item) => sum + item.quantity, 0)
            },
        }),
        {
            name: 'belitang-cart',
        }
    )
)
