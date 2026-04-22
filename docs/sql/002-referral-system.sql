-- Referral System Migration
-- Run this in Supabase SQL Editor

-- 1. Add referral_code column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;

-- 2. Create referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_email TEXT NOT NULL,
  referral_code TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'signed_up', 'converted')),
  converted_at TIMESTAMPTZ,
  reward_earned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable RLS
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies
-- Users can view own referrals
CREATE POLICY "Users can view own referrals" ON referrals
  FOR SELECT USING (auth.uid() = referrer_id);

-- Users can create referrals
CREATE POLICY "Users can create referrals" ON referrals
  FOR INSERT WITH CHECK (auth.uid() = referrer_id);

-- Admins can view all referrals
CREATE POLICY "Admins can view all referrals" ON referrals
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND (user_metadata->>'role') = 'admin')
  );

-- 5. Create index for faster lookups
CREATE INDEX idx_referrals_referral_code ON referrals(referral_code);
CREATE INDEX idx_referrals_referrer_id ON referrals(referrer_id);