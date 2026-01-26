export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    email: string
                    full_name: string
                    phone: string | null
                    avatar_url: string | null
                    role: 'buyer' | 'seller' | 'admin'
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    email: string
                    full_name: string
                    phone?: string | null
                    avatar_url?: string | null
                    role?: 'buyer' | 'seller' | 'admin'
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    full_name?: string
                    phone?: string | null
                    avatar_url?: string | null
                    role?: 'buyer' | 'seller' | 'admin'
                    updated_at?: string
                }
            }
            stores: {
                Row: {
                    id: string
                    user_id: string
                    name: string
                    description: string | null
                    logo_url: string | null
                    banner_url: string | null
                    address: string
                    latitude: number
                    longitude: number
                    rating: number
                    total_reviews: number
                    total_products: number
                    is_verified: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    name: string
                    description?: string | null
                    logo_url?: string | null
                    banner_url?: string | null
                    address: string
                    latitude: number
                    longitude: number
                    rating?: number
                    total_reviews?: number
                    total_products?: number
                    is_verified?: boolean
                    created_at?: string
                }
                Update: {
                    name?: string
                    description?: string | null
                    logo_url?: string | null
                    banner_url?: string | null
                    address?: string
                    latitude?: number
                    longitude?: number
                    rating?: number
                    total_reviews?: number
                    total_products?: number
                    is_verified?: boolean
                }
            }
            categories: {
                Row: {
                    id: string
                    name: string
                    slug: string
                    icon: string
                    parent_id: string | null
                    order: number
                }
                Insert: {
                    id?: string
                    name: string
                    slug: string
                    icon: string
                    parent_id?: string | null
                    order?: number
                }
                Update: {
                    name?: string
                    slug?: string
                    icon?: string
                    parent_id?: string | null
                    order?: number
                }
            }
            products: {
                Row: {
                    id: string
                    store_id: string
                    category_id: string
                    name: string
                    slug: string
                    description: string
                    price: number
                    discount_price: number | null
                    stock: number
                    images: string[]
                    variants: Json | null
                    rating: number
                    total_reviews: number
                    total_sold: number
                    is_active: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    store_id: string
                    category_id: string
                    name: string
                    slug: string
                    description: string
                    price: number
                    discount_price?: number | null
                    stock: number
                    images: string[]
                    variants?: Json | null
                    rating?: number
                    total_reviews?: number
                    total_sold?: number
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    category_id?: string
                    name?: string
                    slug?: string
                    description?: string
                    price?: number
                    discount_price?: number | null
                    stock?: number
                    images?: string[]
                    variants?: Json | null
                    rating?: number
                    total_reviews?: number
                    total_sold?: number
                    is_active?: boolean
                    updated_at?: string
                }
            }
            orders: {
                Row: {
                    id: string
                    user_id: string
                    store_id: string
                    status: 'pending' | 'confirmed' | 'processing' | 'shipping' | 'delivered' | 'completed' | 'cancelled'
                    payment_method: 'cod' | 'transfer' | 'ewallet'
                    payment_status: 'pending' | 'paid' | 'failed'
                    shipping_method: 'local_courier' | 'pickup' | 'expedition'
                    shipping_address: Json
                    shipping_cost: number
                    subtotal: number
                    total: number
                    notes: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    store_id: string
                    status?: 'pending' | 'confirmed' | 'processing' | 'shipping' | 'delivered' | 'completed' | 'cancelled'
                    payment_method: 'cod' | 'transfer' | 'ewallet'
                    payment_status?: 'pending' | 'paid' | 'failed'
                    shipping_method: 'local_courier' | 'pickup' | 'expedition'
                    shipping_address: Json
                    shipping_cost: number
                    subtotal: number
                    total: number
                    notes?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    status?: 'pending' | 'confirmed' | 'processing' | 'shipping' | 'delivered' | 'completed' | 'cancelled'
                    payment_status?: 'pending' | 'paid' | 'failed'
                    notes?: string | null
                    updated_at?: string
                }
            }
            order_items: {
                Row: {
                    id: string
                    order_id: string
                    product_id: string
                    variant: Json | null
                    quantity: number
                    price: number
                    total: number
                }
                Insert: {
                    id?: string
                    order_id: string
                    product_id: string
                    variant?: Json | null
                    quantity: number
                    price: number
                    total: number
                }
                Update: {
                    quantity?: number
                    price?: number
                    total?: number
                }
            }
            reviews: {
                Row: {
                    id: string
                    product_id: string
                    user_id: string
                    order_id: string
                    rating: number
                    comment: string | null
                    images: string[] | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    product_id: string
                    user_id: string
                    order_id: string
                    rating: number
                    comment?: string | null
                    images?: string[] | null
                    created_at?: string
                }
                Update: {
                    rating?: number
                    comment?: string | null
                    images?: string[] | null
                }
            }
            addresses: {
                Row: {
                    id: string
                    user_id: string
                    label: string
                    recipient_name: string
                    phone: string
                    address: string
                    district: string
                    city: string
                    province: string
                    postal_code: string
                    latitude: number | null
                    longitude: number | null
                    is_default: boolean
                }
                Insert: {
                    id?: string
                    user_id: string
                    label: string
                    recipient_name: string
                    phone: string
                    address: string
                    district: string
                    city: string
                    province: string
                    postal_code: string
                    latitude?: number | null
                    longitude?: number | null
                    is_default?: boolean
                }
                Update: {
                    label?: string
                    recipient_name?: string
                    phone?: string
                    address?: string
                    district?: string
                    city?: string
                    province?: string
                    postal_code?: string
                    latitude?: number | null
                    longitude?: number | null
                    is_default?: boolean
                }
            }
            banners: {
                Row: {
                    id: string
                    title: string
                    image_url: string
                    link: string | null
                    is_active: boolean
                    order: number
                }
                Insert: {
                    id?: string
                    title: string
                    image_url: string
                    link?: string | null
                    is_active?: boolean
                    order?: number
                }
                Update: {
                    title?: string
                    image_url?: string
                    link?: string | null
                    is_active?: boolean
                    order?: number
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}
