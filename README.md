# SwingIT Solutions Backoffice

This is the backoffice for SwingIT Solutions.

## Getting Started

1. Install dependencies: `npm install`
2. Start the development server: `npm run dev`
3. Build for production: `npm run build`
4. Start the production server: `npm start`

## Environment Variables

Create a `.env.local` file with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
GITHUB_TOKEN=your_github_token
VERCEL_TOKEN=your_vercel_token
```

## Creating a repo schema through the generate_repo_schema.py script to use for a github script import 
1. Run in terminal: `py generate_repo_schema.py`