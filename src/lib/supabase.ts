
import 'react-native-url-polyfill/auto';
<<<<<<< HEAD

import AsyncStorage from '@react-native-async-storage/async-storage';
=======
import 'expo-sqlite/localStorage/install';

>>>>>>> 8e11d31070a99647ff703eaa542824a5f5cc1ce8
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabasePublishableKey =
<<<<<<< HEAD
  process.env.EXPO_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl) {
  throw new Error(
    'EXPO_PUBLIC_SUPABASE_URL belum dikonfigurasi. Periksa file .env.',
  );
}

if (!supabasePublishableKey) {
  throw new Error(
    'EXPO_PUBLIC_SUPABASE_ANON_KEY belum dikonfigurasi. Periksa file .env.',
  );
=======
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error('Konfigurasi Supabase belum lengkap. Periksa file .env');
>>>>>>> 8e11d31070a99647ff703eaa542824a5f5cc1ce8
}

export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey,
  {
    auth: {
<<<<<<< HEAD
      storage: AsyncStorage,
=======
      storage: localStorage,
>>>>>>> 8e11d31070a99647ff703eaa542824a5f5cc1ce8
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
<<<<<<< HEAD
  },
=======
  }
>>>>>>> 8e11d31070a99647ff703eaa542824a5f5cc1ce8
);
