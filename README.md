# Affiliate Hub - Backoffice

A comprehensive backoffice system for managing affiliate networks, sites, and users built with Next.js 14, Supabase, and TypeScript.

## Features

- **Multi-tenant Architecture**: Support for multiple organizations with isolated data
- **Role-based Access Control**: Super Admin, Admin, and User roles with appropriate permissions
- **Affiliate Network Management**: Create and manage multiple affiliate networks
- **Site Management**: Deploy and manage affiliate sites with customizable templates
- **User Management**: Invite and manage users within organizations
- **White-label Support**: Customizable branding for each tenant
- **Subscription Management**: Built-in subscription tiers and billing support

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with SSR package
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Type Safety**: TypeScript
- **Form Handling**: React Hook Form with Zod validation

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended package manager)
- Supabase account and project

### Installation

1. Clone the repository:
```powershell
git clone <repository-url>
cd affiliate-hub-backoffice
