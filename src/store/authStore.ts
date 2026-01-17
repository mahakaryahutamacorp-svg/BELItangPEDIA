import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, Address, Store } from '@/types'

interface AuthState {
    user: User | null
    store: Store | null
    addresses: Address[]
    isLoading: boolean
    isAuthenticated: boolean

    // Actions
    setUser: (user: User | null) => void
    setStore: (store: Store | null) => void
    setAddresses: (addresses: Address[]) => void
    addAddress: (address: Address) => void
    updateAddress: (id: string, address: Partial<Address>) => void
    removeAddress: (id: string) => void
    setDefaultAddress: (id: string) => void
    setLoading: (loading: boolean) => void
    logout: () => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            store: null,
            addresses: [],
            isLoading: false,
            isAuthenticated: false,

            setUser: (user) => set({
                user,
                isAuthenticated: !!user
            }),

            setStore: (store) => set({ store }),

            setAddresses: (addresses) => set({ addresses }),

            addAddress: (address) => set((state) => ({
                addresses: [...state.addresses, address]
            })),

            updateAddress: (id, updates) => set((state) => ({
                addresses: state.addresses.map(addr =>
                    addr.id === id ? { ...addr, ...updates } : addr
                )
            })),

            removeAddress: (id) => set((state) => ({
                addresses: state.addresses.filter(addr => addr.id !== id)
            })),

            setDefaultAddress: (id) => set((state) => ({
                addresses: state.addresses.map(addr => ({
                    ...addr,
                    is_default: addr.id === id
                }))
            })),

            setLoading: (isLoading) => set({ isLoading }),

            logout: () => set({
                user: null,
                store: null,
                isAuthenticated: false,
            }),
        }),
        {
            name: 'belitang-auth',
            partialize: (state) => ({
                user: state.user,
                store: state.store,
                addresses: state.addresses,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
)
