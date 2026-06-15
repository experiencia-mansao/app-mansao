import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

// Aqui eu vou ler as chaves do arquivo .env de forma segura no expo
const suapabaseUrl = process.env.EXPO_BASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Vou inicar o cliente do supabase com pesistência de sessão nativa
export const supabase = createClient(suapabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});