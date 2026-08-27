import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://mofoolhtiysaayvhdloz.supabase.co';
const supabaseKey = 'sb_publishable_TixG61jXehqaYI6Lh60NAA_stuljzrA';

export const supabase = createClient(supabaseUrl, supabaseKey);

