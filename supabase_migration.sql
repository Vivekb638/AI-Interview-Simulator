-- Supabase Database Schema Migration

-- 0. CLEAN SLATE: Automatically drop all existing tables in the public schema to clear out any old foreign key constraints
DO $$ 
DECLARE 
  r RECORD;
BEGIN 
  FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') 
  LOOP 
    EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE'; 
  END LOOP; 
END $$;

-- 1. Create a secure public.users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT NOT NULL,
  role TEXT CHECK (role IN ('Recruiter', 'Candidate', 'Admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- 2. Resumes Table
CREATE TABLE IF NOT EXISTS public.resumes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  storage_path TEXT,
  parsed_text TEXT,
  skills_json JSONB
);

-- 3. Interviews Table
CREATE TABLE IF NOT EXISTS public.interviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recruiter_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  config_json JSONB
);

-- 4. Interview Sessions Table
CREATE TABLE IF NOT EXISTS public.interview_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  interview_id UUID REFERENCES public.interviews(id) ON DELETE CASCADE,
  candidate_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  status TEXT,
  state_json JSONB
);

-- 5. Coding Problems Table
CREATE TABLE IF NOT EXISTS public.coding_problems (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recruiter_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  difficulty TEXT,
  starter_code_json JSONB
);

-- 6. Assessments Table
CREATE TABLE IF NOT EXISTS public.assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recruiter_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  time_limit_mins INTEGER
);

-- 7. Assessment Problems Table
CREATE TABLE IF NOT EXISTS public.assessment_problems (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_id UUID REFERENCES public.assessments(id) ON DELETE CASCADE,
  problem_id UUID REFERENCES public.coding_problems(id) ON DELETE CASCADE,
  points INTEGER,
  public_tests_json JSONB,
  hidden_tests_json JSONB
);

-- 8. Coding Submissions Table
CREATE TABLE IF NOT EXISTS public.coding_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_id UUID REFERENCES public.assessments(id) ON DELETE CASCADE,
  candidate_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  language TEXT,
  source_code TEXT,
  result JSONB
);

-- 9. Chats Table
CREATE TABLE IF NOT EXISTS public.chats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.interview_sessions(id) ON DELETE CASCADE,
  participants JSONB
);

-- 10. Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id UUID REFERENCES public.chats(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT,
  ts TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT,
  payload JSONB,
  read_at TIMESTAMP WITH TIME ZONE
);

-- 12. Cheating Logs Table
CREATE TABLE IF NOT EXISTS public.cheating_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.interview_sessions(id) ON DELETE CASCADE,
  event_type TEXT,
  severity TEXT,
  ts TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 13. Reports Table
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.interview_sessions(id) ON DELETE CASCADE,
  summary_json JSONB,
  pdf_path TEXT
);

-- 14. Analytics Table
CREATE TABLE IF NOT EXISTS public.analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  metric_name TEXT,
  value NUMERIC,
  ts TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 15. RLS Setup (Basic)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read own data" ON public.users;
CREATE POLICY "Users can read own data" ON public.users FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
CREATE POLICY "Users can update own data" ON public.users FOR UPDATE USING (auth.uid() = id);

-- 16. Debug Logs Table
CREATE TABLE IF NOT EXISTS public.debug_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  error_message TEXT,
  payload JSONB,
  ts TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 17. Trigger for auth.users with EXCEPTION Handling
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NULLIF(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NULLIF(NEW.raw_user_meta_data->>'role', ''), 'Candidate')
  );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Trap the error so Auth Signup DOES NOT fail, but log it for debugging
  INSERT INTO public.debug_logs (error_message, payload)
  VALUES (SQLERRM, row_to_json(NEW));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 18. Create Storage Bucket for Avatars
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies for Avatars
CREATE POLICY "Avatar images are publicly accessible." 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'avatars' );

CREATE POLICY "Anyone can upload an avatar." 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'avatars' );

CREATE POLICY "Anyone can update their avatar." 
ON storage.objects FOR UPDATE 
WITH CHECK ( bucket_id = 'avatars' );

-- 19. Create Storage Bucket for Resumes
INSERT INTO storage.buckets (id, name, public) 
VALUES ('resumes', 'resumes', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies for Resumes
-- Resumes are private (not public like avatars), so we use auth.uid()
CREATE POLICY "Users can upload their own resume." 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1] );

CREATE POLICY "Users can update their own resume." 
ON storage.objects FOR UPDATE 
WITH CHECK ( bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1] );

CREATE POLICY "Users can read their own resume." 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1] );
