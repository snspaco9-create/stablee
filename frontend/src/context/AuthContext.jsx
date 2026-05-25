import { createContext, useContext, useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [landlord, setLandlord] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('landlord')
    if (stored) setLandlord(JSON.parse(stored))
    setLoading(false)

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'TOKEN_REFRESHED' && session) {
        localStorage.setItem('token', session.access_token)
      }
      if (event === 'SIGNED_OUT') {
        localStorage.removeItem('token')
        localStorage.removeItem('landlord')
        setLandlord(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = (token, landlordData) => {
    localStorage.setItem('token', token)
    localStorage.setItem('landlord', JSON.stringify(landlordData))
    setLandlord(landlordData)
  }

  const logout = () => {
    supabase.auth.signOut()
    localStorage.removeItem('token')
    localStorage.removeItem('landlord')
    setLandlord(null)
  }

  return (
    <AuthContext.Provider value={{ landlord, login, logout, loading, setLandlord }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}