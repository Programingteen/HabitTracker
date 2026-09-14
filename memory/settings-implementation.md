---
name: settings-implementation
description: Context for Settings page implementation
metadata:
  type: project
---

Implementing the Settings page (`/settings`) with real backend functionality using Supabase.

**Why:** To allow users to manage their account (name), preferences (week start, progress range), export data, and delete their account.

**How to apply:** 
- Use the `profiles` table to store user name and preferences.
- Preferences are stored in the `profiles` table as new columns if needed, or by extending existing structure.
- Account deletion must handle cascading deletes for `goals` and `goal_logs`.
- Export data should include `profiles`, `goals`, and `goal_logs`.
- Theme support is currently placeholder as `next-themes` is not installed.
Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
