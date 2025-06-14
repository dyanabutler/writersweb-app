-- Add privacy control columns to profiles table
-- These control what information is visible on public profiles

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS show_email BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS show_full_name BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS show_avatar BOOLEAN DEFAULT true;

-- Verify the columns were added
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns 
WHERE table_name = 'profiles'
AND column_name IN ('show_email', 'show_full_name', 'show_avatar')
ORDER BY column_name; 