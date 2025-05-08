# Affiliate Network Backoffice

A multi-tenant SaaS application for managing affiliate networks and sites.

## Features

- 🏢 **Multi-tenant Architecture**: Complete data isolation between organizations
- 🔒 **Role-Based Access Control**: Super admin, admin, editor, and viewer roles
- 🌐 **Affiliate Network Management**: Create and manage multiple affiliate networks
- 🖥️ **Site Management**: Create and manage affiliate sites with customizable templates
- 👥 **User Management**: Invite and manage users within your organization
- 📊 **Analytics**: Track performance of your affiliate networks and sites
- 🎨 **White Labeling**: Customize the appearance of your backoffice (premium feature)
- 💰 **Subscription Management**: Tiered pricing plans with different feature sets

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase Functions
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS with shadcn/ui components
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- Supabase account

### Installation

1. Clone the repository:

\`\`\`bash
git clone https://github.com/yourusername/affiliate-network-backoffice.git
cd affiliate-network-backoffice
\`\`\`

2. Install dependencies:

\`\`\`bash
npm install
# or
pnpm install
\`\`\`

3. Set up environment variables:

Copy the `.env.local.example` file to `.env.local` and fill in your Supabase credentials.

4. Set up the database:

Run the SQL script in `supabase/schema.sql` in your Supabase SQL editor.

5. Run the development server:

\`\`\`bash
npm run dev
# or
pnpm dev
\`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

\`\`\`
affiliate-network-backoffice/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Authentication pages
│   ├── (dashboard)/        # Dashboard pages
│   ├── api/                # API routes
│   ├── globals.css         # Global styles
│   └── layout.tsx          # Root layout
├── components/             # React components
│   ├── layout/             # Layout components
│   └── ui/                 # UI components
├── lib/                    # Utility functions
│   ├── supabase/           # Supabase client
│   └── utils.ts            # Utility functions
├── public/                 # Static assets
├── supabase/               # Supabase configuration
│   └── schema.sql          # Database schema
├── types/                  # TypeScript types
├── .env.local.example      # Example environment variables
├── next.config.js          # Next.js configuration
├── package.json            # Project dependencies
├── README.md               # Project documentation
├── SECURITY.md             # Security implementation guide
└── tsconfig.json           # TypeScript configuration
\`\`\`

## Database Schema

The application uses a multi-tenant database schema with the following main tables:

- `tenants`: Organizations using the platform
- `users`: Users belonging to tenants
- `subscription_tiers`: Available subscription plans
- `affiliate_networks`: Networks created by tenants
- `affiliate_sites`: Sites belonging to networks
- `content_blocks`: Content for affiliate sites
- `usage_logs`: Audit logs for user actions
- `white_label_settings`: White labeling configuration

## Security

The application implements several security measures:

- **Row Level Security (RLS)**: Data isolation between tenants
- **Role-Based Access Control**: Different permission levels for different roles
- **Audit Logging**: Tracking of all user actions
- **Input Validation**: Client and server-side validation

For more details, see the [SECURITY.md](SECURITY.md) file.

## Deployment

The application can be deployed to Vercel:

\`\`\`bash
vercel
\`\`\`

## License

This project is licensed under the MIT License - see the LICENSE file for details.
