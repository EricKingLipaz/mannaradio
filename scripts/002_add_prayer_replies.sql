-- Add prayer reply response field to prayer_requests table
ALTER TABLE public.prayer_requests 
ADD COLUMN IF NOT EXISTS pastor_reply TEXT,
ADD COLUMN IF NOT EXISTS replied_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS replied_by_pastor_id UUID REFERENCES public.pastors(id);

-- Create prayer_request_replies table for tracking all replies
CREATE TABLE IF NOT EXISTS public.prayer_request_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prayer_request_id UUID NOT NULL REFERENCES public.prayer_requests(id) ON DELETE CASCADE,
  pastor_id UUID NOT NULL REFERENCES public.pastors(id),
  reply_text TEXT NOT NULL,
  email_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on prayer_request_replies
ALTER TABLE public.prayer_request_replies ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Pastors can view all replies
CREATE POLICY "Pastors can view all prayer replies" ON public.prayer_request_replies FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.pastors WHERE pastors.id = auth.uid()
  )
);

-- RLS Policy: Pastors can insert replies
CREATE POLICY "Pastors can insert prayer replies" ON public.prayer_request_replies FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.pastors WHERE pastors.id = auth.uid()
  )
);

-- RLS Policy: Pastors can update prayer requests status and reply
CREATE POLICY "Pastors can update prayer requests" ON public.prayer_requests FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.pastors WHERE pastors.id = auth.uid()
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.pastors WHERE pastors.id = auth.uid()
  )
);
