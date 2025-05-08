# Setting Up Your Affiliate Network Backoffice

This guide will walk you through the process of setting up your Affiliate Network Backoffice application from scratch.

## Prerequisites

- Supabase account
- Node.js 18+ installed
- npm or pnpm installed
- Git (optional)

## Step 1: Database Setup

1. Log in to your Supabase account and create a new project
2. Go to the SQL Editor in your Supabase dashboard
3. Copy the entire contents of the `supabase/schema.sql` file from this repository
4. Paste it into the SQL Editor and run the script
5. If you encounter any errors, run the script in smaller chunks to identify the issue

### Fixing the DEFAULT Value Error

If you encounter an error like:
\`\`\`
ERROR: 0A000: cannot use subquery in DEFAULT expression
\`\`\`

This is because PostgreSQL doesn't allow subqueries in DEFAULT expressions. The updated schema.sql file in this repository has been fixed to address this issue by:

1. First creating the tables without the default values that use subqueries
2. Then updating the records after insertion

## Step 2: Environment Setup

1. Clone this repository or download the source code
2. Create a `.env.local` file in the root directory with the following variables:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

Replace the placeholders with your actual Supabase credentials, which you can find in your Supabase project settings.

## Step 3: Application Setup

1. Install dependencies:

\`\`\`bash
npm install
# or
pnpm install
\`\`\`

2. Run the development server:

\`\`\`bash
npm run dev
# or
pnpm dev
\`\`\`

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Step 4: Creating a Super Admin User

There are two ways to create a super admin user:

### Option 1: Using the Registration Flow

1. Go to [http://localhost:3000/register](http://localhost:3000/register)
2. Fill out the registration form and create an account
3. After registration, go to your Supabase SQL Editor and run:

\`\`\`sql
UPDATE users 
SET role = 'super_admin', tenant_id = NULL 
WHERE email = 'your-email@example.com';
\`\`\`

Replace `your-email@example.com` with the email you used during registration.

### Option 2: Using the Setup API

1. Register a normal user account at [http://localhost:3000/register](http://localhost:3000/register)
2. Use the setup API to convert your user to a super admin:

\`\`\`bash
curl -X POST http://localhost:3000/api/setup \
  -H "Content-Type: application/json" \
  -d '{"email": "your-email@example.com"}'
\`\`\`

Replace `your-email@example.com` with the email you used during registration.

## Step 5: Testing the Application

1. Log in with your super admin account
2. You should now have access to the admin section in the sidebar
3. Create test organizations, networks, and sites
4. Invite test users with different roles to verify permissions

## Troubleshooting

### Database Issues

If you encounter database errors:

1. Check that your Supabase credentials are correct in `.env.local`
2. Verify that the schema was created correctly by checking the tables in the Supabase Table Editor
3. If tables are missing or incomplete, run the schema.sql script again

### Authentication Issues

If you have trouble logging in:

1. Make sure your Supabase project has Email auth enabled in Authentication → Settings
2. Check that your site URL is configured correctly in Supabase
3. Verify that the user exists in both Supabase Auth and your users table

### Permission Issues

If you're logged in but can't access certain features:

1. Check your user's role in the users table
2. Verify that the RLS policies are correctly applied
3. Make sure your user is associated with the correct tenant (or no tenant for super admins)

## Next Steps

After setting up your application:

1. Customize the application to fit your specific needs
2. Add your own branding and styling
3. Implement additional features as needed
4. Set up a production deployment on Vercel or another hosting provider

For more detailed information, refer to the README.md file.
