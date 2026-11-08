import { supabase } from './supabase';

export async function testSupabaseConnection() {
  const { data, error } = await supabase
    .from('branches')
    .select('id')
    .limit(1);

  if (error) {
    console.log('Supabase error:', error.message);
    return false;
  }

  console.log('Supabase berhasil diakses:', data);
  return true;
}