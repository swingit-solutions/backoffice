# Security Implementation Guide

This document provides detailed instructions for implementing security best practices in your Affiliate Network Backoffice application.

## Table of Contents

1. [Database Security](#database-security)
2. [Authentication](#authentication)
3. [Authorization](#authorization)
4. [API Security](#api-security)
5. [Data Validation](#data-validation)
6. [Monitoring and Logging](#monitoring-and-logging)
7. [Deployment Security](#deployment-security)
8. [Subscription Management](#subscription-management)

## Database Security

### Row Level Security (RLS)

The database schema already includes Row Level Security policies. Here's how they work:

1. **Tenant Isolation**: Each tenant can only access their own data
2. **Role-Based Access**: Different user roles have different access levels
3. **Super Admin Access**: Super admins can access all data

To verify RLS is working correctly:

\`\`\`sql
-- Test as a regular user
SELECT is_super_admin(); -- Should return false
SELECT get_current_tenant_id(); -- Should return the user's tenant_id

-- Test tenant isolation
SELECT * FROM affiliate_networks; -- Should only return networks for the current tenant
\`\`\`

### Sensitive Data

For sensitive data like API keys or payment information:

1. Use Supabase Vault for storing sensitive information (when available)
2. For now, encrypt sensitive data before storing it:

\`\`\`typescript
// Example of encrypting sensitive data
import { createCipheriv, randomBytes } from 'crypto';

function encryptData(data: string, secretKey: string) {
  const iv = randomBytes(16);
  const cipher = createCipheriv('aes-256-cbc', Buffer.from(secretKey, 'hex'), iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return { iv: iv.toString('hex'), encryptedData: encrypted };
}
\`\`\`

## Authentication

The application uses Supabase Auth for authentication. To enhance security:

1. **Enable MFA**: When ready for production, enable Multi-Factor Authentication:

\`\`\`typescript
// In your Supabase dashboard, enable MFA
// Then in your code:
const { data, error } = await supabase.auth.mfa.enroll({
  factorType: 'totp'
});
\`\`\`

2. **Password Policies**: Enforce strong password policies:

\`\`\`typescript
// Example validation with zod
const passwordSchema = z.string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");
\`\`\`

3. **Session Management**: The app already uses Supabase session management. To enhance:

\`\`\`typescript
// Set shorter session duration for production
await supabase.auth.signInWithPassword({
  email,
  password,
  options: {
    expiresIn: 3600 // 1 hour in seconds
  }
});
\`\`\`

## Authorization

The application implements role-based access control (RBAC):

1. **User Roles**: super_admin, admin, editor, viewer
2. **Permission Checks**: Always verify permissions server-side

To implement additional permission checks:

\`\`\`typescript
// Server-side permission check example
async function checkPermission(userId: string, action: string, resource: string) {
  const { data: user } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .single();
  
  if (!user) return false;
  
  // Super admin can do anything
  if (user.role === 'super_admin') return true;
  
  // Check specific permissions based on role, action, and resource
  // Implement your permission matrix here
}
\`\`\`

## API Security

1. **Rate Limiting**: Implement rate limiting for API routes:

\`\`\`typescript
// Example using a simple in-memory store (use Redis in production)
const rateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  store: new Map(),
};

export async function middleware(request: NextRequest) {
  const ip = request.ip || 'unknown';
  const now = Date.now();
  
  // Clean up old entries
  if (rateLimit.store.has(ip)) {
    const requests = rateLimit.store.get(ip).filter(
      (time: number) => now - time < rateLimit.windowMs
    );
    
    if (requests.length >= rateLimit.max) {
      return new NextResponse('Too Many Requests', { status: 429 });
    }
    
    requests.push(now);
    rateLimit.store.set(ip, requests);
  } else {
    rateLimit.store.set(ip, [now]);
  }
}
\`\`\`

2. **CORS**: Configure CORS for production:

\`\`\`typescript
// In next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: process.env.ALLOWED_ORIGIN },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },
};
\`\`\`

## Data Validation

Always validate data on both client and server:

1. **Client-side**: Already using zod for form validation
2. **Server-side**: Implement validation for all API routes:

\`\`\`typescript
// Example server-side validation
import { z } from 'zod';

export async function POST(request: Request) {
  const schema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    // other fields
  });
  
  try {
    const body = await request.json();
    const validatedData = schema.parse(body);
    
    // Process the validated data
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid data' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
\`\`\`

## Monitoring and Logging

The database already includes a logging system for user actions. To enhance:

1. **Error Logging**: Implement error logging:

\`\`\`typescript
// Example using a simple error logger
function logError(error: Error, context: any = {}) {
  console.error({
    message: error.message,
    stack: error.stack,
    ...context,
    timestamp: new Date().toISOString(),
  });
  
  // In production, send to a logging service like Sentry
}
\`\`\`

2. **Audit Logging**: The database already logs user actions. To query:

\`\`\`sql
-- Get recent user actions
SELECT 
  u.email, 
  ul.action, 
  ul.resource_type, 
  ul.created_at
FROM 
  usage_logs ul
JOIN 
  users u ON ul.user_id = u.id
ORDER BY 
  ul.created_at DESC
LIMIT 100;
\`\`\`

## Deployment Security

When deploying to production:

1. **Environment Variables**: Store all secrets as environment variables
2. **HTTPS**: Ensure all traffic uses HTTPS
3. **Security Headers**: Implement security headers:

\`\`\`typescript
// In next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
];

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};
\`\`\`

## Subscription Management

The application includes subscription tier functionality, but it's currently disabled. To enable:

1. **Connect Payment Provider**: Integrate with Stripe or another payment provider
2. **Implement Webhooks**: Process subscription events:

\`\`\`typescript
// Example Stripe webhook handler
export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');
  
  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    
    switch (event.type) {
      case 'customer.subscription.created':
        // Handle new subscription
        break;
      case 'customer.subscription.updated':
        // Handle subscription update
        break;
      case 'customer.subscription.deleted':
        // Handle subscription cancellation
        break;
    }
    
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
\`\`\`

3. **Enforce Limits**: Check subscription limits before allowing actions:

\`\`\`typescript
// Example function to check if a tenant can create more sites
async function canCreateSite(tenantId: string) {
  const { data: tenant } = await supabase
    .from('tenants')
    .select('subscription_tier_id')
    .eq('id', tenantId)
    .single();
  
  if (!tenant) return false;
  
  const { data: tier } = await supabase
    .from('subscription_tiers')
    .select('max_sites')
    .eq('id', tenant.subscription_tier_id)
    .single();
  
  if (!tier) return false;
  
  const { count } = await supabase
    .from('affiliate_sites')
    .select('count')
    .in(
      'network_id',
      supabase.from('affiliate_networks').select('id').eq('tenant_id', tenantId)
    );
  
  return count < tier.max_sites;
}
