import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://yluahpeuxcconsbsrirt.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjU5MWI5YzBlLTBmMjktNGYzYi1iNWFhLTg4M2NiYTZiOTU5NSJ9.eyJwcm9qZWN0SWQiOiJ5bHVhaHBldXhjY29uc2JzcmlydCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzgwNjIwNTI2LCJleHAiOjIwOTU5ODA1MjYsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.g0kqUoq2ovCPukRomMaOfir9MaqudywkZxZh97W2ZkM';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };