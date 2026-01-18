// Product Types
export interface Product {
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
    variants: ProductVariant[] | null
    rating: number
    total_reviews: number
    total_sold: number
    is_active: boolean
    created_at: string
    updated_at: string
    store?: Store
    category?: Category
}

export interface ProductVariant {
    id: string
    name: string
    type: 'color' | 'size' | 'other'
    options: VariantOption[]
}

export interface VariantOption {
    id: string
    value: string
    price_adjustment?: number
    stock?: number
    image?: string
}

export interface Category {
    id: string
    name: string
    slug: string
    icon: string
    parent_id: string | null
    order: number
    children?: Category[]
}

// Store Types
export interface Store {
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
    distance?: number // calculated field for nearby stores
}

// User Types
export interface User {
    id: string
    email: string
    full_name: string
    phone: string | null
    avatar_url: string | null
    role: 'buyer' | 'seller' | 'admin'
    created_at: string
    updated_at?: string
}

export type UserRole = 'buyer' | 'seller' | 'admin'

export interface Address {
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

// Order Types
export type OrderStatus =
    | 'pending'
    | 'confirmed'
    | 'processing'
    | 'shipping'
    | 'delivered'
    | 'completed'
    | 'cancelled'

export type PaymentMethod = 'cod' | 'transfer' | 'ewallet'
export type PaymentStatus = 'pending' | 'paid' | 'failed'
export type ShippingMethod = 'local_courier' | 'pickup' | 'expedition'

export interface Order {
    id: string
    user_id: string
    store_id: string
    status: OrderStatus
    payment_method: PaymentMethod
    payment_status: PaymentStatus
    shipping_method: ShippingMethod
    shipping_address: Address
    shipping_cost: number
    subtotal: number
    total: number
    notes: string | null
    created_at: string
    updated_at: string
    items?: OrderItem[]
    store?: Store
}

export interface OrderItem {
    id: string
    order_id: string
    product_id: string
    variant: SelectedVariant | null
    quantity: number
    price: number
    total: number
    product?: Product
}

export interface SelectedVariant {
    [key: string]: string // e.g., { color: 'red', size: 'M' }
}

// Review Types
export interface Review {
    id: string
    product_id: string
    user_id: string
    order_id: string
    rating: number
    comment: string | null
    images: string[] | null
    created_at: string
    user?: User
}

// Cart Types
export interface CartItem {
    product: Product
    quantity: number
    selectedVariant: SelectedVariant | null
}

export interface CartStore {
    [storeId: string]: CartItem[]
}

// Wishlist Types
export interface WishlistItem {
    id: string
    product_id: string
    user_id: string
    created_at: string
    product?: Product
}

// Search & Filter Types
export interface ProductFilters {
    category?: string
    minPrice?: number
    maxPrice?: number
    rating?: number
    location?: {
        latitude: number
        longitude: number
        radius: number // in km
    }
    sortBy?: 'newest' | 'bestseller' | 'price_low' | 'price_high' | 'rating'
}

// Shipping Types
export interface ShippingOption {
    id: string
    name: string
    type: ShippingMethod
    estimated_days: string
    price: number
    icon: string
}

// Banner/Promo Types
export interface Banner {
    id: string
    title: string
    image_url: string
    link: string | null
    is_active: boolean
    order: number
}

// Flash Sale Types
export interface FlashSale {
    id: string
    title: string
    start_time: string
    end_time: string
    products: FlashSaleProduct[]
}

export interface FlashSaleProduct {
    product_id: string
    flash_price: number
    stock: number
    sold: number
    product?: Product
}
