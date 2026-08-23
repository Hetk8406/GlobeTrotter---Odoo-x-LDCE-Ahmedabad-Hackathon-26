import { supabase, isSupabaseConfigured } from './supabase';

export interface DatabaseHealthStatus {
  isConfigured: boolean;
  hasUrl: boolean;
  hasAnonKey: boolean;
  isAuthenticated: boolean;
  userId?: string;
  userEmail?: string;
  profilesAccessible: boolean;
  tripsAccessible: boolean;
  errorMessage?: string;
}

/**
 * Performs a safe, non-destructive health check on Supabase connection and tables.
 * Never exposes secret tokens or passwords.
 */
export async function checkDatabaseHealth(): Promise<DatabaseHealthStatus> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  const status: DatabaseHealthStatus = {
    isConfigured: isSupabaseConfigured,
    hasUrl: !!supabaseUrl,
    hasAnonKey: !!supabaseAnonKey,
    isAuthenticated: false,
    profilesAccessible: false,
    tripsAccessible: false
  };

  if (!isSupabaseConfigured || !supabase) {
    status.errorMessage = 'Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) are missing.';
    return status;
  }

  try {
    // 1. Check Session & Auth
    const { data: { session }, error: sessionErr } = await supabase.auth.getSession();
    if (sessionErr) {
      status.errorMessage = `Auth session check error: ${sessionErr.message}`;
    }

    if (session?.user) {
      status.isAuthenticated = true;
      status.userId = session.user.id;
      status.userEmail = session.user.email;

      // 2. Check Profiles table accessibility for authenticated user
      const { error: profileErr } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .eq('id', session.user.id)
        .limit(1);

      if (!profileErr || profileErr.code === 'PGRST116') {
        status.profilesAccessible = true;
      } else {
        status.errorMessage = `Profiles table query warning: [${profileErr.code}] ${profileErr.message}`;
      }

      // 3. Check Trips table accessibility
      const { error: tripsErr } = await supabase
        .from('trips')
        .select('id')
        .eq('user_id', session.user.id)
        .limit(1);

      if (!tripsErr) {
        status.tripsAccessible = true;
      } else {
        status.errorMessage = (status.errorMessage ? status.errorMessage + ' | ' : '') + `Trips query warning: [${tripsErr.code}] ${tripsErr.message}`;
      }
    } else {
      // Unauthenticated check (public tables or ping)
      const { error: pingErr } = await supabase
        .from('trips')
        .select('id')
        .eq('is_public', true)
        .limit(1);

      if (!pingErr) {
        status.tripsAccessible = true;
      }
    }
  } catch (err: any) {
    status.errorMessage = `Unexpected error during database health check: ${err.message || err}`;
  }

  return status;
}
