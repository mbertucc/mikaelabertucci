

## Add Admin Link to Main Page

Add a subtle admin link to the site footer so you can quickly navigate to the admin login page without manually typing the URL.

### Changes

**`src/components/Footer.tsx`** -- Add a small, unobtrusive "Admin" link (with a lock icon) in the footer area. It will navigate to `/admin/login` and blend in without being a prominent call-to-action for regular visitors.

This keeps the main navigation clean while giving you easy one-click access from any page.

