

# Account Management & Admin Role System

## Overview
Create a user roles system so you (as the site owner) are the administrator, with the ability to approve/reject new signups and manage user accounts. New signups will be marked as "pending" until an admin approves them.

## Architecture

### 1. Database Changes (3 migrations)

**Migration 1 -- User roles table**
- Create `app_role` enum: `admin`, `user`
- Create `user_roles` table (user_id, role) with RLS
- Create `has_role()` security definer function to avoid RLS recursion

**Migration 2 -- User approval system**
- Create `user_approvals` table:
  - `id` (uuid, PK)
  - `user_id` (uuid, references auth.users, unique)
  - `status` (text: 'pending', 'approved', 'rejected')
  - `created_at`, `updated_at`
- RLS: admins can read/update all rows; users can read their own row
- Create trigger: auto-insert a "pending" row when a new auth user is created

**Migration 3 -- Seed you as admin**
- After you create your account, a migration will assign your user the `admin` role and set your approval status to `approved`

### 2. New Page: Account Management (`/admin/users`)

A new page accessible only to admins, showing:
- Table of all users with columns: Email, Status (pending/approved/rejected), Role, Signed Up date
- Action buttons: Approve, Reject for pending users
- Badge indicators for status

### 3. Auth Flow Changes

**AuthGuard update**: After confirming a session exists, also check `user_approvals` status. If the user is "pending", show a "Your account is awaiting approval" message instead of the protected content. If "rejected", show an access denied message.

**AdminLogin update**: After successful signup, show message "Account created! An administrator will review your request."

**Admin page guard**: The `/admin` and `/admin/users` routes will additionally check for the `admin` role using the `has_role()` function.

### 4. Navigation Update

Add "Users" link in the Admin panel header (only visible to admins).

## Flow

```text
New user signs up
       |
       v
 Auto-inserted into user_approvals (status: pending)
       |
       v
 User sees "Awaiting approval" on login
       |
       v
 Admin visits /admin/users, sees pending user
       |
       v
 Admin clicks Approve --> status = approved
       |
       v
 User can now access /ventures and other protected pages
```

## Files to Create
- `src/pages/UserManagement.tsx` -- admin-only user approval and management page

## Files to Modify
- `src/components/AuthGuard.tsx` -- add approval status check
- `src/pages/AdminLogin.tsx` -- update post-signup messaging
- `src/pages/Admin.tsx` -- add "Users" navigation link
- `src/App.tsx` -- add `/admin/users` route

## Important: Becoming the Admin
Since no users exist yet, the workflow will be:
1. Enable auto-confirm (so you can sign up without email verification)
2. You sign up with your email
3. A migration assigns your user ID the `admin` role and sets approval to `approved`
4. All future signups go through the pending/approval flow

