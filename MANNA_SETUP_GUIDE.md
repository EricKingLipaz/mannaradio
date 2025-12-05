# Manna Radio & TV App - Setup & Configuration Guide

## Overview
The Manna Radio & TV app is a comprehensive church management and streaming platform with pastor authentication, member management, prayer request handling with email replies, and live streaming capabilities.

## Initial Setup Steps

### 1. Database Schema
Run the SQL migration scripts in this order:

**First Migration** (creates base tables):
- File: `/scripts/001_create_tables.sql`
- Creates: pastors, members, prayer_requests, chat_messages tables
- Run this first via Supabase SQL editor

**Second Migration** (adds prayer reply functionality):
- File: `/scripts/002_add_prayer_replies.sql`
- Creates: prayer_request_replies table
- Adds reply fields to prayer_requests table
- Run this after the first migration

### 2. Create First Pastor Account

Navigate to: `http://localhost:3000/admin/register`

- Click "Create Account" to register the first pastor
- Use an email like: `pastor@mannatemple.co.za`
- Create a secure password (minimum 6 characters)
- You'll be automatically logged in after registration

### 3. Email Service Configuration (Optional but Recommended)

To enable prayer request email replies:

**Option A: Using Resend (Free tier available)**
- Sign up at https://resend.com
- Get your API key
- Add environment variables:
  \`\`\`
  EMAIL_PROVIDER=resend
  RESEND_API_KEY=your_api_key_here
  SENDER_EMAIL=info@mannatemple.co.za
  \`\`\`

**Option B: Using SMTP**
- Configure your own SMTP server
- Add environment variables:
  \`\`\`
  EMAIL_PROVIDER=smtp
  SMTP_HOST=your_smtp_host
  SMTP_PORT=587
  SMTP_USER=your_email
  SMTP_PASSWORD=your_password
  SENDER_EMAIL=info@mannatemple.co.za
  \`\`\`

**Without email service:**
- App works fine but prayer request replies won't be emailed automatically
- Can still be logged for manual sending

### 4. Configure Environment Variables

Required variables (already set up in Vercel):
\`\`\`
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
\`\`\`

Optional variables:
\`\`\`
EMAIL_PROVIDER=resend|smtp
RESEND_API_KEY=your_key
SENDER_EMAIL=info@mannatemple.co.za
\`\`\`

## Features Breakdown

### Public Pages
- **Home**: Hero section with feature overview
- **Radio**: Live streaming with 24/7 audio from Zeno.fm
- **TV**: YouTube video playlist embedding
- **Bible**: King James Bible viewer with search
- **Prayer Request**: Submit prayer requests (anyone can submit)
- **Member Registration**: Join the church with full details

### Pastor Portal (/admin)

#### Dashboard
- Overview statistics (total members, prayer requests, urgent requests)
- Quick access to members and prayer requests

#### Members Management
- View all registered members with full details
- Filter by name, email, phone, or rank
- **Export Features**:
  - Export to CSV (for spreadsheets)
  - Export to Excel/XLSX (for advanced analysis)
  - Date-stamped filenames for organization

#### Prayer Requests
- View all submitted prayer requests
- Filter by status: Pending, In Progress, Answered
- **Reply Functionality**:
  - Click "Reply" button to open reply modal
  - Write pastoral response
  - Optionally send reply via email to requester
  - Tracks replied date and responding pastor

#### Settings (Password Management)
- View account information
- Change password securely
- Verify current password before change

#### Admin Registration
- Register additional pastors
- Each pastor needs their own account
- All registered pastors can view all members and prayer requests
- Secure authentication via Supabase

## Key Capabilities

### Multi-Pastor Support
- Multiple pastors can register and login
- Each pastor has secure credentials
- All pastors see the same member and prayer request data
- Can track which pastor replied to prayer requests

### Prayer Request Management
- Anyone can submit prayer requests with contact info
- Pastors can view all requests
- Reply to requests with pastoral guidance
- Optionally send email response directly to requester
- Track request status (pending, in-progress, answered)

### Member Management
- Track all registered church members
- Store: Full name, email, phone, address, DOB, baptism date, rank
- Filter by rank (Member, Deacon, Elder, Pastor, Minister)
- Search by name, email, or phone
- Export member lists for record-keeping or analysis

### Media Control
- Radio and TV players are coordinated
- Playing radio stops TV automatically and vice versa
- Live chat available for community interaction

## Accessing Different Sections

| Section | URL | Access |
|---------|-----|--------|
| Home | / | Public |
| Radio | /radio | Public |
| TV | /tv | Public |
| Bible | /bible | Public |
| Prayer Request | /prayer-request | Public |
| Member Registration | /members | Public |
| Admin Dashboard | /admin | Pastor Login Required |
| Pastor Login | /admin/login | Public |
| Pastor Register | /admin/register | Public |
| Admin Members | /admin/members | Pastor Login Required |
| Admin Prayer Requests | /admin/prayer-requests | Pastor Login Required |
| Admin Settings | /admin/settings | Pastor Login Required |

## Church Information Used

All embedded in the app:
- **Email**: info@mannatemple.co.za
- **Phone**: +27 73 851 4499
- **Website**: www.mannatemple.co.za
- **Location**: 83VC+8WX The Orchards, Akasia, Pretoria North
- **Service Times**:
  - Intercession: 9 AM - 10 AM
  - Main Service: 10 AM - 1 PM
  - Deliverance: 1 PM - 2 PM
- **Banking Details**: Standard Bank, Account: 10151728613

## Troubleshooting

### Email Not Sending
1. Check EMAIL_PROVIDER is set correctly
2. Verify API key/credentials are valid
3. Check spam folder
4. Verify recipient email is correct

### Pastor Can't Login
1. Ensure account was created at /admin/register
2. Check email and password are correct
3. Verify email is confirmed (check email inbox)

### Members Not Appearing
1. Register new members at /members page
2. Ensure form is fully completed
3. Check database connection is working

### Export Not Working
1. Ensure xlsx library is installed (auto-included)
2. Check browser allows downloads
3. Try different export format (CSV vs XLSX)

## Deployment to Vercel

1. Connect GitHub repository to Vercel
2. Add environment variables in Vercel Settings
3. Deploy - the app will automatically build
4. Visit your Vercel URL to access the live app

## Security Notes

- All pastor data requires authentication
- Row-Level Security (RLS) ensures pastors can only access appropriate data
- Passwords are hashed by Supabase Auth
- Email sending uses secure API keys (stored server-side only)
- No sensitive data is exposed in client-side code

## Support & Contact

For issues or updates:
- Email: info@mannatemple.co.za
- Phone: +27 73 851 4499
- Website: www.mannatemple.co.za
