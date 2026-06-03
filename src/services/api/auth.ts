import { supabase } from '../supabase/supabaseClient';

// ============ Authentication ============

export async function signUp(
  email: string,
  password: string,
  fullName: string,
  role: 'volunteer' | 'neighborhood_coordinator' | 'sector_manager' | 'evaluation_committee' | 'unit_director' | 'governorate_supervisor'
) {
  try {
    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('User creation failed');

    // Create user profile in database
    const { data, error } = await supabase
      .from('users')
      .insert([{
        id: authData.user.id,
        email,
        full_name: fullName,
        role,
      }])
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (error) {
    throw error;
  }
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

export async function getCurrentUserProfile() {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function updateUserProfile(
  userId: string,
  updates: {
    full_name?: string;
    role?: string;
  }
) {
  const { data, error } = await supabase
    .from('users')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw error;
}

export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  if (error) throw error;
}

// ============ User Management ============

export async function fetchUsers() {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('full_name', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function fetchUserById(id: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function fetchUsersByRole(role: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('role', role)
    .order('full_name', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function onAuthStateChange(callback: (event: string, session: any) => void) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      callback(event, session);
    }
  );

  return subscription;
}
