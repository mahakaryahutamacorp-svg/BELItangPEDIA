'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/authStore'

// Define types locally to avoid import issues
interface SupabaseUser {
    id: string
    email?: string
}

interface SupabaseSession {
    user: SupabaseUser
}

interface AuthContextType {
    user: SupabaseUser | null
    session: SupabaseSession | null
    loading: boolean
    signInWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>
    signUpWithEmail: (email: string, password: string, fullName: string, phone: string) => Promise<{ error: Error | null }>
    signInWithGoogle: () => Promise<{ error: Error | null }>
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<SupabaseUser | null>(null)
    const [session, setSession] = useState<SupabaseSession | null>(null)
    const [loading, setLoading] = useState(true)
    const { setUser: setStoreUser, logout: storeLogout } = useAuthStore()

    useEffect(() => {
        // Get initial session
        const getSession = async () => {
            const { data: { session: currentSession } } = await supabase.auth.getSession()
            if (currentSession) {
                setSession(currentSession as SupabaseSession)
                setUser(currentSession.user as SupabaseUser)
                await fetchUserProfile(currentSession.user.id)
            }
            setLoading(false)
        }

        getSession()

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event: string, currentSession: SupabaseSession | null) => {
                if (currentSession) {
                    setSession(currentSession)
                    setUser(currentSession.user)
                    if (_event === 'SIGNED_IN') {
                        await fetchUserProfile(currentSession.user.id)
                    }
                } else {
                    setSession(null)
                    setUser(null)
                    if (_event === 'SIGNED_OUT') {
                        storeLogout()
                    }
                }
                setLoading(false)
            }
        )

        return () => {
            subscription.unsubscribe()
        }
    }, [storeLogout])

    const fetchUserProfile = async (userId: string) => {
        const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single()

        if (profile) {
            setStoreUser({
                id: profile.id,
                email: profile.email || '',
                full_name: profile.full_name || '',
                phone: profile.phone || '',
                avatar_url: profile.avatar_url || null,
                role: profile.role || 'buyer',
                created_at: profile.created_at || new Date().toISOString(),
            })
        }
    }

    const signInWithEmail = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        return { error: error as Error | null }
    }

    const signUpWithEmail = async (email: string, password: string, fullName: string, phone: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    phone: phone,
                },
            },
        })

        if (!error && data.user) {
            // Create user profile in database
            await supabase.from('users').insert({
                id: data.user.id,
                email: email,
                full_name: fullName,
                phone: phone,
                role: 'buyer',
            })
        }

        return { error: error as Error | null }
    }

    const signInWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`,
            },
        })
        return { error: error as Error | null }
    }

    const signOut = async () => {
        await supabase.auth.signOut()
        storeLogout()
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                session,
                loading,
                signInWithEmail,
                signUpWithEmail,
                signInWithGoogle,
                signOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
