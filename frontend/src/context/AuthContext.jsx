import { createContext, useContext, useState, useEffect } from 'react'
import supabase from '../supabase'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [landlord, setLandlord] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      try {
        // First restore the locally stored landlord
        const storedLandlord = localStorage.getItem('landlord')

        if (storedLandlord) {
          try {
            if (mounted) {
              setLandlord(JSON.parse(storedLandlord))
            }
          } catch {
            localStorage.removeItem('landlord')
          }
        }

        // Check if Supabase already has a session
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error('Auth session error:', error.message)
        }

        if (session) {
          localStorage.setItem('token', session.access_token)

          if (session.refresh_token) {
            localStorage.setItem('refresh_token', session.refresh_token)
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    initializeAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return

      if (session) {
        localStorage.setItem('token', session.access_token)

        if (session.refresh_token) {
          localStorage.setItem('refresh_token', session.refresh_token)
        }
      }

      if (event === 'SIGNED_OUT') {
        localStorage.removeItem('token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('landlord')
        setLandlord(null)
      }
    })

    const handleStorageChange = (event) => {
      if (event.key === 'landlord') {
        if (event.newValue) {
          try {
            setLandlord(JSON.parse(event.newValue))
          } catch {
            setLandlord(null)
          }
        } else {
          setLandlord(null)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      mounted = false
      subscription.unsubscribe()
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const login = async (token, landlordData, refreshToken) => {
    try {
      localStorage.setItem('token', token)
      localStorage.setItem('landlord', JSON.stringify(landlordData))

      if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken)

        // IMPORTANT:
        // Establish the Supabase session in the browser.
        const { error } = await supabase.auth.setSession({
          access_token: token,
          refresh_token: refreshToken,
        })

        if (error) {
          console.error('Failed to establish Supabase session:', error.message)
        }
      }

      setLandlord(landlordData)
    } catch (error) {
      console.error('Login session error:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Supabase logout error:', error)
    }

    localStorage.removeItem('token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('landlord')

    setLandlord(null)
  }

  return (
    <AuthContext.Provider
      value={{
        landlord,
        login,
        logout,
        loading,
        setLandlord,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}