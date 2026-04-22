------------------------------------------------------------------
-- SECURE ADMIN SETUP INSTRUCTIONS
-- WARNING: Never commit actual admin emails to version control.
-- Run this manually in Supabase SQL Editor.
------------------------------------------------------------------

-- 1. Ensure the 'role' column exists in the users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- 2. Set a specific user as admin (REPLACE THE EMAIL with your admin email)
UPDATE users 
SET role = 'admin' 
WHERE email = 'admin@rhinesolution.com';

-- 3. Verify the change
SELECT id, email, role FROM users WHERE role = 'admin';

-- 4. RLS Policy: Users can read their own role
DROP POLICY IF EXISTS "Users can read own role" ON users;
CREATE POLICY "Users can read own role" ON users
  FOR SELECT USING (auth.uid() = id);
------------------------------------------------------------------