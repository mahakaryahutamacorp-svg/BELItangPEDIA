import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Auth helpers
export const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${window.location.origin}/auth/callback`,
        },
    })
    return { data, error }
}

export const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
}

export const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return user
}

// Storage helpers
export const uploadProductImage = async (file: File, productId: string) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${productId}/${Date.now()}.${fileExt}`

    const { data, error } = await supabase.storage
        .from('products')
        .upload(fileName, file)

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(fileName)

    return publicUrl
}

export const getPublicUrl = (bucket: string, path: string) => {
    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path)
    return publicUrl
}
