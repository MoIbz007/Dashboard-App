import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase URL or anon key. Please check your environment variables.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const initSupabase = async () => {
  try {
    const { data, error } = await supabase.from('meetings').select('count')
    if (error) throw error
    console.log('Supabase connection successful')
    return true
  } catch (error) {
    console.error('Error connecting to Supabase:', error)
    return false
  }
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
  return data
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}