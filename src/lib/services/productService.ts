import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

type Product = Database['public']['Tables']['products']['Row']
type ProductInsert = Database['public']['Tables']['products']['Insert']
type ProductUpdate = Database['public']['Tables']['products']['Update']

export const productService = {
    /**
     * Get products by store ID
     */
    async getProductsByStore(
        storeId: string,
        options?: {
            limit?: number
            offset?: number
            searchQuery?: string
            isActive?: boolean
        }
    ): Promise<{ data: Product[]; error: Error | null; count: number }> {
        try {
            let query = supabase
                .from('products')
                .select('*', { count: 'exact' })
                .eq('store_id', storeId)
                .order('created_at', { ascending: false })

            if (options?.searchQuery) {
                query = query.ilike('name', `%${options.searchQuery}%`)
            }

            if (options?.isActive !== undefined) {
                query = query.eq('is_active', options.isActive)
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
     * Get a single product by ID
     */
    async getProductById(productId: string): Promise<{ data: Product | null; error: Error | null }> {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', productId)
                .single()

            if (error) throw error

            return { data, error: null }
        } catch (error) {
            return { data: null, error: error as Error }
        }
    },

    /**
     * Create a new product
     */
    async createProduct(productData: ProductInsert): Promise<{ data: Product | null; error: Error | null }> {
        try {
            // Generate slug from name
            const slug = productData.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data, error } = await (supabase
                .from('products') as any)
                .insert({
                    ...productData,
                    slug: `${slug}-${Date.now()}`,
                })
                .select()
                .single()

            if (error) throw error

            // Update store's total_products count
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await (supabase as any).rpc('increment_store_products', { store_id: productData.store_id })

            return { data, error: null }
        } catch (error) {
            return { data: null, error: error as Error }
        }
    },

    /**
     * Update a product
     */
    async updateProduct(productId: string, productData: ProductUpdate): Promise<{ data: Product | null; error: Error | null }> {
        try {
            const updateData: ProductUpdate = {
                ...productData,
                updated_at: new Date().toISOString(),
            }

            // Regenerate slug if name changed
            if (productData.name) {
                const slug = productData.name
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, '')
                updateData.slug = `${slug}-${Date.now()}`
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data, error } = await (supabase
                .from('products') as any)
                .update(updateData)
                .eq('id', productId)
                .select()
                .single()

            if (error) throw error

            return { data, error: null }
        } catch (error) {
            return { data: null, error: error as Error }
        }
    },

    /**
     * Delete a product
     */
    async deleteProduct(productId: string, storeId: string): Promise<{ success: boolean; error: Error | null }> {
        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', productId)

            if (error) throw error

            // Decrement store's total_products count
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await (supabase as any).rpc('decrement_store_products', { store_id: storeId })

            return { success: true, error: null }
        } catch (error) {
            return { success: false, error: error as Error }
        }
    },

    /**
     * Toggle product active status
     */
    async toggleProductStatus(productId: string, isActive: boolean): Promise<{ data: Product | null; error: Error | null }> {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data, error } = await (supabase
                .from('products') as any)
                .update({ is_active: isActive, updated_at: new Date().toISOString() })
                .eq('id', productId)
                .select()
                .single()

            if (error) throw error

            return { data, error: null }
        } catch (error) {
            return { data: null, error: error as Error }
        }
    },

    /**
     * Upload product images
     */
    async uploadProductImages(
        files: File[],
        productId: string
    ): Promise<{ urls: string[]; error: Error | null }> {
        try {
            const uploadPromises = files.map(async (file, index) => {
                const fileExt = file.name.split('.').pop()
                const fileName = `${productId}/${Date.now()}-${index}.${fileExt}`

                const { error: uploadError } = await supabase.storage
                    .from('products')
                    .upload(fileName, file)

                if (uploadError) throw uploadError

                const { data: { publicUrl } } = supabase.storage
                    .from('products')
                    .getPublicUrl(fileName)

                return publicUrl
            })

            const urls = await Promise.all(uploadPromises)

            return { urls, error: null }
        } catch (error) {
            return { urls: [], error: error as Error }
        }
    },

    /**
     * Delete a product image from storage
     */
    async deleteProductImage(imageUrl: string): Promise<{ success: boolean; error: Error | null }> {
        try {
            // Extract path from URL
            const url = new URL(imageUrl)
            const pathParts = url.pathname.split('/storage/v1/object/public/products/')
            if (pathParts.length < 2) {
                throw new Error('Invalid image URL')
            }
            const filePath = pathParts[1]

            const { error } = await supabase.storage
                .from('products')
                .remove([filePath])

            if (error) throw error

            return { success: true, error: null }
        } catch (error) {
            return { success: false, error: error as Error }
        }
    },

    /**
     * Get categories for product form
     */
    async getCategories(): Promise<{ data: { id: string; name: string; slug: string; icon: string }[]; error: Error | null }> {
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('id, name, slug, icon')
                .order('order', { ascending: true })

            if (error) throw error

            return { data: data || [], error: null }
        } catch (error) {
            return { data: [], error: error as Error }
        }
    },
}
