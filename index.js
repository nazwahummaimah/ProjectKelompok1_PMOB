
import { install } from 'react-native-quick-crypto';

// Pasang WebCrypto sebelum Expo Router dan Supabase dimuat.
install();

// Muat entry point Expo Router setelah crypto tersedia.
require('expo-router/entry');
