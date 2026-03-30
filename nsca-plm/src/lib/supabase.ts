import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gqisjvyjdbtxzbvylmwh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxaXNqdnlqZGJ0eHpidnlsbXdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkwNTI4MDMsImV4cCI6MjA0NDYyODgwM30.bpNSJJBA_DXfLyLeb7Q3ywcRcq5qEkNNhQTdKMUQ-fg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
