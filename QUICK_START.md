# Quick Start Guide

## What You Need to Do

The frontend server is having startup issues. Please manually start both servers:

### 1. Start Backend Server

Open a new Command Prompt or PowerShell and run:
```bash
cd c:\Users\123321\Desktop\mannaradio\backend
node server.js
```

**You should see:**
```
✅ Manna Radio API server running on http://localhost:5000
```

### 2. Start Frontend Server

Open a NEW Command Prompt or PowerShell and run:
```bash  
cd c:\Users\123321\Desktop\mannaradio
npm run dev
```

**You should see:**
```
▲ Next.js 16.0.7
- Local:        http://localhost:3000
✓ Ready
```

### 3. Open Browser

Navigate to: `http://localhost:3000`

## What's Been Fixed

✅ Removed all Supabase dependencies
✅ Created API client for backend communication
✅ Updated login page
✅ Updated register page  
✅ Updated admin layout

## What Still Needs Manual Updates

The following pages have placeholder content and need to be updated to use the API client:

- `/app/admin/page.tsx` - Dashboard
- `/app/admin/members/page.tsx` - Members list
- `/app/admin/prayer-requests/page.tsx` - Prayer requests
- `/app/admin/settings/page.tsx` - Settings

Once the server is running, let me know and I can help you update these pages!
