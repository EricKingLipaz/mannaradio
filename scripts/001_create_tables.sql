-- Create admin/pastor users table for authentication
CREATE TABLE IF NOT EXISTS public.pastors (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create members table for new members registration
CREATE TABLE IF NOT EXISTS public.members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  date_of_birth DATE,
  baptism_date DATE,
  rank TEXT DEFAULT 'Member',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create prayer requests table
CREATE TABLE IF NOT EXISTS public.prayer_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  prayer_request TEXT NOT NULL,
  is_urgent BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create live chat messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL,
  message TEXT NOT NULL,
  message_type TEXT DEFAULT 'text',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.pastors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for pastors (only authenticated pastors can view/manage)
CREATE POLICY "Pastors can view all members" ON public.members FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.pastors WHERE pastors.id = auth.uid()
  )
);

CREATE POLICY "Anyone can insert members" ON public.members FOR INSERT WITH CHECK (true);

CREATE POLICY "Pastors can view all prayer requests" ON public.prayer_requests FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.pastors WHERE pastors.id = auth.uid()
  )
);

CREATE POLICY "Anyone can insert prayer requests" ON public.prayer_requests FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view chat messages" ON public.chat_messages FOR SELECT USING (true);

CREATE POLICY "Anyone can insert chat messages" ON public.chat_messages FOR INSERT WITH CHECK (true);
