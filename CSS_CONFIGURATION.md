# CSS Configuration Documentation

## Overview

This document outlines the CSS configuration for the Affiliate Network Backoffice project. We use Tailwind CSS for styling, which is integrated with Next.js's built-in CSS support.

## Configuration Files

### 1. `tailwind.config.js`

This file contains the Tailwind CSS configuration, including:
- Theme customization (colors, spacing, etc.)
- Content paths for purging unused CSS
- Plugin configuration

\`\`\`javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  // ... rest of configuration
}
\`\`\`

### 2. `postcss.config.js`

This file configures PostCSS, which processes our CSS:

\`\`\`javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
\`\`\`

### 3. `app/globals.css`

This is the main CSS file that imports Tailwind's base, components, and utilities. It also contains custom CSS variables and global styles.

## Integration with Next.js

Next.js has built-in support for CSS and CSS Modules. We leverage this built-in support rather than using custom webpack configurations to ensure compatibility and maintainability.

## CSS Best Practices

1. **Use Tailwind Classes**: Prefer Tailwind utility classes over custom CSS when possible.
2. **Component-Specific Styles**: Use CSS Modules (`.module.css`) for component-specific styles.
3. **Global Styles**: Keep global styles in `globals.css` to a minimum.
4. **CSS Variables**: Use CSS variables for theme values to support dark mode and other theme variations.

## Troubleshooting

If you encounter CSS-related issues:

1. **Missing Styles**: Ensure the component is properly importing the CSS file.
2. **Purged Styles**: Check if the class is being purged by Tailwind. Add it to the safelist if necessary.
3. **Build Issues**: Clear the `.next` cache and node_modules/.cache directories.

## Maintenance

When updating the CSS configuration:

1. Update this documentation
2. Test across different screen sizes
3. Verify both light and dark mode functionality
