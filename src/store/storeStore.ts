import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Store } from '@/types'
import { storeService } from '@/lib/services/storeService'

interface StoreState {
    // State
    store: Store | null
    isLoading: boolean
    error: string | null
    hasFetched: boolean

    // Actions
    setStore: (store: Store | null) => void
    fetchMyStore: (userId: string) => Promise<void>
    createStore: (storeData: {
        user_id: string
        name: string
        description?: string
        address: string
        latitude?: number
        longitude?: number
    }) => Promise<{ success: boolean; error?: string }>
    updateStore: (storeId: string, storeData: Partial<Store>) => Promise<{ success: boolean; error?: string }>
    clearStore: () => void
    setError: (error: string | null) => void
}

export const useStoreStore = create<StoreState>()(
    persist(
        (set, get) => ({
            store: null,
            isLoading: false,
            error: null,
            hasFetched: false,

            setStore: (store) => set({ store }),

            fetchMyStore: async (userId: string) => {
                // Skip if already fetched or loading
                if (get().hasFetched || get().isLoading) return

                set({ isLoading: true, error: null })

                try {
                    const { data, error } = await storeService.getStoreByUserId(userId)

                    if (error) {
                        set({ error: error.message, isLoading: false, hasFetched: true })
                        return
                    }

                    set({
                        store: data as Store | null,
                        isLoading: false,
                        hasFetched: true,
                        error: null,
                    })
                } catch (err) {
                    set({
                        error: (err as Error).message,
                        isLoading: false,
                        hasFetched: true,
                    })
                }
            },

            createStore: async (storeData) => {
                set({ isLoading: true, error: null })

                try {
                    const { data, error } = await storeService.createStore({
                        user_id: storeData.user_id,
                        name: storeData.name,
                        description: storeData.description || null,
                        address: storeData.address,
                        latitude: storeData.latitude || 0,
                        longitude: storeData.longitude || 0,
                    })

                    if (error) {
                        set({ error: error.message, isLoading: false })
                        return { success: false, error: error.message }
                    }

                    set({
                        store: data as Store | null,
                        isLoading: false,
                        error: null,
                        hasFetched: true,
                    })

                    return { success: true }
                } catch (err) {
                    const errorMsg = (err as Error).message
                    set({ error: errorMsg, isLoading: false })
                    return { success: false, error: errorMsg }
                }
            },

            updateStore: async (storeId, storeData) => {
                set({ isLoading: true, error: null })

                try {
                    const { data, error } = await storeService.updateStore(storeId, storeData)

                    if (error) {
                        set({ error: error.message, isLoading: false })
                        return { success: false, error: error.message }
                    }

                    set({
                        store: data as Store | null,
                        isLoading: false,
                        error: null,
                    })

                    return { success: true }
                } catch (err) {
                    const errorMsg = (err as Error).message
                    set({ error: errorMsg, isLoading: false })
                    return { success: false, error: errorMsg }
                }
            },

            clearStore: () => set({
                store: null,
                hasFetched: false,
                error: null,
            }),

            setError: (error) => set({ error }),
        }),
        {
            name: 'belitang-store',
            partialize: (state) => ({
                store: state.store,
            }),
        }
    )
)
