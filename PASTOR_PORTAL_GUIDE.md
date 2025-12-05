# Pastor Portal - Access & Password Guide

## Default Password
There is **NO default password** - each pastor creates their own during registration. This ensures security and personalization.

## How to Create a Pastor Account

### First Time Setup
1. Go to: `http://localhost:3000/admin/register` (or your deployed URL)
2. Fill in:
   - **Full Name**: Your name (e.g., "Pastor John Doe")
   - **Email Address**: Your email (e.g., "pastor@mannatemple.co.za")
   - **Password**: Create a strong password (minimum 6 characters)
   - **Confirm Password**: Re-enter the same password
3. Click "Create Account"
4. You'll be automatically logged in and redirected to the dashboard

### Registering Additional Pastors
Already logged in pastors can register new pastors by:
1. Clicking "Register Pastor" in the sidebar
2. Filling in the new pastor's details
3. New pastor will receive confirmation email

## Changing Your Password

### How to Change Password
1. Login to your pastor portal: `http://localhost:3000/admin/login`
2. Click "Settings" in the sidebar (or go to `/admin/settings`)
3. In the "Change Password" section:
   - Enter your **Current Password**
   - Enter your **New Password** (minimum 6 characters)
   - Confirm your **New Password**
4. Click "Update Password"
5. You'll see a success message - no need to re-login

### Password Requirements
- Minimum 6 characters
- Should be secure and unique
- Can contain letters, numbers, and special characters
- Current password verification required for security

## Multiple Pastors Support

### Why Multiple Pastors?
- Share administrative responsibilities
- Have backup access if one pastor is unavailable
- Distribute workload across the pastoral team
- Each pastor tracks their own prayer request replies

### Each Pastor Can:
- View all church members and their details
- View all prayer requests submitted
- Reply to prayer requests and send emails
- Export member lists
- Change their own password
- View their account information

### Prayer Request Replies Tracking
- System tracks which pastor replied to each request
- Shows pastor name on the reply
- Helpful for prayer chains and follow-ups

## Security Best Practices

### For Pastors
1. **Use a Strong Password**:
   - Not your birthdate
   - Not sequential numbers
   - Mix of letters and numbers when possible
   - Don't share with non-pastors

2. **Keep Login Credentials Private**
   - Don't share your email and password
   - Only pastors should have access
   - If someone needs access, register them as a separate pastor

3. **Change Password Regularly**
   - Quarterly password updates recommended
   - Immediately if you suspect compromise
   - After staff changes

4. **Logout When Done**
   - Always click "Logout" before closing browser
   - Don't leave pastor portal unattended
   - Mobile: Close browser or use private mode

### For Church IT Admin
- Backup password reset procedures
- Monitor login attempts
- Keep Supabase security up to date
- Regular security audits

## If Password is Forgotten

### Recovery Process
1. Go to: `/admin/login`
2. Click "Forgot Password" (if available) or contact admin
3. You can reset via the Supabase dashboard:
   - Go to Supabase project
   - Authentication > Users
   - Find the pastor email
   - Click reset password option
4. Pastor receives reset email
5. They create new password via email link

### Admin Can Reset (via Supabase)
If a pastor forgets their password:
1. Login to Supabase dashboard
2. Go to Authentication > Users
3. Find the pastor's email
4. Click "Reset password"
5. Send reset link to pastor's email
6. They create new password

## Email Notifications

### Pastor Portal Emails
- **Account Created**: Confirmation when pastor registers
- **Password Reset**: Link to reset forgotten password
- **Prayer Request Reply**: When prayer request is answered (optional)

### Prayer Request Emails
When a pastor replies to a prayer request:
- Option to send email to the prayer requester
- Checkbox: "Send reply email to [requester email]"
- Email contains:
  - Original prayer request
  - Pastor's reply/guidance
  - Church contact information
  - Personalized greeting

## Login Instructions

### For Existing Pastors
1. Go to: `http://localhost:3000/admin/login` (or your deployed URL)
2. Enter your email address
3. Enter your password
4. Click "Login"
5. You'll see the dashboard

### Session Management
- You'll stay logged in until you click "Logout"
- Automatic logout after inactivity (configurable)
- Browser cookies store session safely
- Each browser/device needs separate login

## What Each Pastor Can Do

| Feature | Pastors | Public |
|---------|---------|--------|
| View Members | ✓ | ✗ |
| Export Members | ✓ | ✗ |
| View Prayer Requests | ✓ | ✗ |
| Reply to Prayers | ✓ | ✗ |
| Send Email Replies | ✓ | ✗ |
| Register New Members | ✓ | ✓ |
| Submit Prayers | ✓ | ✓ |
| Change Password | ✓ | ✗ |

## Frequently Asked Questions

**Q: Can I have the same password as another pastor?**
A: Yes, each pastor's password is independent. It's better for security if each has a unique password.

**Q: What if a pastor leaves the church?**
A: Ask them to logout. Then an admin can delete their account from Supabase or disable it.

**Q: Can pastors see each other's passwords?**
A: No - passwords are encrypted and never visible, even to admin.

**Q: How do I reset a pastor's password if they forgot it?**
A: Via Supabase dashboard: Auth > Users > Find email > Reset password

**Q: Can I force a pastor to change password?**
A: Not automatically, but you can reset their account from Supabase.

**Q: Is prayer request reply email secure?**
A: Yes - uses encrypted SMTP/API connection. Only recipient sees the email.

## Support

For password issues or access problems:
- Email: info@mannatemple.co.za
- Phone: +27 73 851 4499
- Technical Admin: [Your IT Contact]
