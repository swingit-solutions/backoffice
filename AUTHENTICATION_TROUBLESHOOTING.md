## Authentication Troubleshooting Guide

This document provides guidance on troubleshooting common authentication issues in the Affiliate Hub application.

### Common Issues

1.  **Login Errors**:

*   **Problem**: Users are unable to log in, receiving a "Bad Request" or "Invalid Credentials" error.
*   **Possible Causes**:

*   Incorrect email or password
*   Supabase Auth service is temporarily unavailable
*   CORS issues preventing the client from communicating with Supabase
*   **Troubleshooting Steps**:

*   Verify the email and password are correct.
*   Check the Supabase status page for any service outages.
*   Ensure that the `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` environment variables are correctly set in your local environment and Vercel.
*   Check the browser console for any CORS-related errors.

2.  **Password Reset Issues**:

*   **Problem**: Users are unable to reset their password, or the reset link is not working.
*   **Possible Causes**:

*   Incorrect email address entered
*   Supabase Auth service is temporarily unavailable
*   The password reset link has expired
*   The `NEXT_PUBLIC_APP_URL` environment variable is not correctly set, causing the reset link to point to the wrong domain.
*   **Troubleshooting Steps**:

*   Verify the email address is correct.
*   Check the Supabase status page for any service outages.
*   Ensure that the `NEXT_PUBLIC_APP_URL` environment variable is correctly set in your local environment and Vercel.
*   Check the browser console for any errors.
*   Try requesting a new password reset link.

3.  **Row Level Security (RLS) Errors**:

*   **Problem**: Users are unable to register or perform certain actions due to RLS policies.
*   **Possible Causes**:

*   Incorrect RLS policies on the `tenants`, `users`, or `affiliate_networks` tables
*   The user does not have the necessary permissions to perform the action
*   **Troubleshooting Steps**:

*   Verify the RLS policies on the relevant tables.
*   Ensure that the user has the necessary permissions to perform the action.
*   Check the Supabase documentation for more information on RLS policies.

### General Tips

*   **Check the Browser Console**: The browser console is your best friend for debugging client-side issues. Look for any errors or warnings that might provide clues about what's going wrong.
*   **Check the Network Tab**: The Network tab in your browser's developer tools can help you see the requests that are being made to the server and the responses that are being returned. This can help you identify any issues with the API calls.
*   **Check the Supabase Logs**: The Supabase logs can provide valuable information about what's happening on the server-side. You can access the logs in the Supabase dashboard.
*   **Test with Different Users**: Try testing with different users to see if the issue is specific to a particular user or role.
*   **Clear Cache and Cookies**: Sometimes, clearing your browser's cache and cookies can help resolve authentication issues.
*   **Check Environment Variables**: Make sure that all required environment variables are set correctly in your local environment and Vercel.

### Contact Support

If you're still having trouble after following these steps, please contact Supabase support for assistance.
