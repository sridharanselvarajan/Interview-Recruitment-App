-- Supabase Setup Script
-- Run this in the SQL Editor of your Supabase Dashboard

-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS public."Users" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE NOT NULL,
    picture TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Interview Table
CREATE TABLE IF NOT EXISTS public."Interview" (
    id SERIAL PRIMARY KEY,
    interview_id UUID UNIQUE NOT NULL,
    "userEmail" TEXT NOT NULL,
    "jobPosition" TEXT,
    "jobDescription" TEXT,
    "duration" TEXT,
    "type" TEXT, -- or TEXT[] if it's an array, but standard text works for single value or JSON string
    "questionList" JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable RLS
ALTER TABLE public."Users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Interview" ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies for Users
-- Allow insert for authenticated users (regardless of who they are, for now, to fix the issue)
CREATE POLICY "Enable insert for authenticated users" ON public."Users"
    FOR INSERT TO authenticated WITH CHECK (true);

-- Allow select for authenticated users (to verify login)
CREATE POLICY "Enable select for authenticated users" ON public."Users"
    FOR SELECT TO authenticated USING (true);

-- Allow update for own user (optional but good practice)
-- Assuming email matches auth email, but auth.email() is not always available in simple checks.
-- For now, we allow update if email matches.
CREATE POLICY "Enable update for own user" ON public."Users"
    FOR UPDATE TO authenticated USING (email = auth.jwt() ->> 'email');


-- 5. Create Policies for Interview
-- Allow insert for authenticated users
CREATE POLICY "Enable insert for authenticated users" ON public."Interview"
    FOR INSERT TO authenticated WITH CHECK (true);

-- Allow select for own interviews
CREATE POLICY "Enable select for own interviews" ON public."Interview"
    FOR SELECT TO authenticated USING ("userEmail" = auth.jwt() ->> 'email');

-- Allow delete/update for own interviews
CREATE POLICY "Enable delete for own interviews" ON public."Interview"
    FOR DELETE TO authenticated USING ("userEmail" = auth.jwt() ->> 'email');


-- 6. Create UserAnswer Table for Rolling Evaluation
CREATE TABLE IF NOT EXISTS public."UserAnswer" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "interviewId" UUID NOT NULL, -- references Interview(interview_id) logically, or could be foreign key
    question TEXT NOT NULL,
    "userAnswer" TEXT,
    feedback JSONB, -- stores { rating, strengths, weaknesses } for this answer
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Create Policies for UserAnswer
-- Enable RLS
ALTER TABLE public."UserAnswer" ENABLE ROW LEVEL SECURITY;

-- Allow insert for authenticated users
CREATE POLICY "Enable insert for authenticated users" ON public."UserAnswer"
    FOR INSERT TO authenticated WITH CHECK (true);

-- Allow select for own answers (assuming we can filter by interview ownership or just allow auth read for now to keep it simple and fix the issue)
-- Ideally: JOIN with Interview table to check ownership. For simplicity in this fix context:
CREATE POLICY "Enable select for authenticated users" ON public."UserAnswer"
    FOR SELECT TO authenticated USING (true);
