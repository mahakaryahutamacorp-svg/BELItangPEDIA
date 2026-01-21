import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

type Store = Database['public']['Tables']['stores']['Row']
type StoreInsert = Database['public']['Tables']['stores']['Insert']
type StoreUpdate = Database['public']['Tables']['stores']['Update']

export const storeService = {
    /**
     * Get store by user ID
     */
    async getStoreByUserId(userId: string): Promise<{ data: Store | null; error: Error | null }> {
        try {
            const { data, error } = await supabase
                .from('stores')
                .select('*')
                .eq('user_id', userId)
                .single()

            if (error && error.code !== 'PGRST116') {
                // PGRST116 = no rows returned (not an error for us)
                throw error
            }

            return { data, error: null }
        } catch (error) {
            return { data: null, error: error as Error }
        }
    },

    /**
     * Get store by ID
     */
    async getStoreById(storeId: string): Promise<{ data: Store | null; error: Error | null }> {
        try {
            const { data, error } = await supabase
                .from('stores')
                .select('*')
                .eq('id', storeId)
                .single()

            if (error) throw error

            return { data, error: null }
        } catch (error) {
            return { data: null, error: error as Error }
        }
    },

    /**
     * Create a new store
     */
    async createStore(storeData: StoreInsert): Promise<{ data: Store | null; error: Error | null }> {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data, error } = await (supabase
                .from('stores') as any)
                .insert(storeData)
                .select()
                .single()

            if (error) throw error

            // Update user role to seller
            if (storeData.user_id) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                await (supabase
                    .from('users') as any)
                    .update({ is_seller: true })
                    .eq('id', storeData.user_id)
            }

            return { data, error: null }
        } catch (error) {
            return { data: null, error: error as Error }
        }
    },

    /**
     * Update an existing store
     */
    async updateStore(storeId: string, storeData: StoreUpdate): Promise<{ data: Store | null; error: Error | null }> {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data, error } = await (supabase
                .from('stores') as any)
                .update(storeData)
                .eq('id', storeId)
                .select()
                .single()

            if (error) throw error

            return { data, error: null }
        } catch (error) {
            return { data: null, error: error as Error }
        }
    },

    /**
     * Get all stores (for browsing)
     */
    async getAllStores(options?: {
        limit?: number
        offset?: number
        searchQuery?: string
    }): Promise<{ data: Store[]; error: Error | null; count: number }> {
        try {
            let query = supabase
                .from('stores')
                .select('*', { count: 'exact' })

            if (options?.searchQuery) {
                query = query.ilike('name', `%${options.searchQuery}%`)
            }

            if (options?.limit) {
                query = query.limit(options.limit)
            }

            if (options?.offset) {
                query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
            }

            const { data, error, count } = await query

            if (error) throw error

            return { data: data || [], error: null, count: count || 0 }
        } catch (error) {
            return { data: [], error: error as Error, count: 0 }
        }
    },

    /**
     * Upload store logo
     */
    async uploadStoreLogo(file: File, storeId: string): Promise<{ url: string | null; error: Error | null }> {
        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `${storeId}/logo.${fileExt}`

            const { error: uploadError } = await supabase.storage
                .from('stores')
                .upload(fileName, file, { upsert: true })

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from('stores')
                .getPublicUrl(fileName)

            // Update store with logo URL
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await (supabase
                .from('stores') as any)
                .update({ logo_url: publicUrl })
                .eq('id', storeId)

            return { url: publicUrl, error: null }
        } catch (error) {
            return { url: null, error: error as Error }
        }
    },

    /**
     * Upload store banner
     */
    async uploadStoreBanner(file: File, storeId: string): Promise<{ url: string | null; error: Error | null }> {
        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `${storeId}/banner.${fileExt}`

            const { error: uploadError } = await supabase.storage
                .from('stores')
                .upload(fileName, file, { upsert: true })

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from('stores')
                .getPublicUrl(fileName)

            // Update store with banner URL
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await (supabase
                .from('stores') as any)
                .update({ banner_url: publicUrl })
                .eq('id', storeId)

            return { url: publicUrl, error: null }
        } catch (error) {
            return { url: null, error: error as Error }
        }
    },
}
