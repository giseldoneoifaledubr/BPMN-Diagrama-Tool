import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Verificar se as variáveis de ambiente estão definidas e são válidas
const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const hasValidConfig = supabaseUrl && 
  supabaseAnonKey && 
  isValidUrl(supabaseUrl) &&
  supabaseUrl !== 'your_supabase_project_url' &&
  supabaseAnonKey !== 'your_supabase_anon_key';

if (!hasValidConfig) {
  console.warn('Supabase environment variables not found or invalid. Running in local mode.');
}

// Use valid placeholder URLs that won't cause URL construction errors
const defaultUrl = 'https://placeholder.supabase.co';
const defaultKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDk3NzEyMDAsImV4cCI6MTk2NTM0NzIwMH0.placeholder';

export const supabase = createClient<Database>(
  hasValidConfig ? supabaseUrl : defaultUrl,
  hasValidConfig ? supabaseAnonKey : defaultKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
    },
    global: {
      headers: {
        'X-Client-Info': 'bpmn-designer@1.0.0',
      },
    },
    db: {
      schema: 'public',
    },
  }
);

// Função para verificar se o Supabase está configurado corretamente
export const isSupabaseConfigured = () => {
  return hasValidConfig;
};

// Função para testar a conexão com o Supabase
export const testSupabaseConnection = async () => {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase não configurado' };
  }

  try {
    const { data, error } = await supabase.from('user_profiles').select('count').limit(1);
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true, data };
  } catch (error) {
    return { success: false, error: 'Erro de conexão' };
  }
};