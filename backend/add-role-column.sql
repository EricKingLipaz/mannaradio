-- Add role column to pastors table if it doesn't exist
ALTER TABLE pastors ADD COLUMN IF NOT EXISTS role ENUM('admin', 'moderator') DEFAULT 'moderator';

-- Update user@eric.com to admin role
UPDATE pastors SET role = 'admin' WHERE email = 'user@eric.com';

-- Show all users with their roles
SELECT id, name, email, role, created_at FROM pastors;
