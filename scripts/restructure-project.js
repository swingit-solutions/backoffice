/**
 * Restructure Project Script
 *
 * This script restructures the project into three separate folders for main site, backoffice, and affiliate sites.
 * It copies the necessary files to each folder and updates the dependencies.
 *
 * Usage:
 * node scripts/restructure-project.js
 */

const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

// Define the output directories
const outputDir = path.join(__dirname, "..", "restructured")
const mainDir = path.join(outputDir, "main-site")
const backofficeDir = path.join(outputDir, "backoffice")
const affiliateSiteDir = path.join(outputDir, "affiliate-site-template")

// Create the output directories
;[outputDir, mainDir, backofficeDir, affiliateSiteDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
})

// Copy shared files to all projects
function copySharedFiles(targetDir) {
  // Copy package.json and update it
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "package.json"), "utf8"))

  // Remove workspace-specific configurations
  delete packageJson.workspaces

  // Write the updated package.json
  fs.writeFileSync(path.join(targetDir, "package.json"), JSON.stringify(packageJson, null, 2))

  // Copy other shared files
  ;[".gitignore", "tsconfig.json", "next.config.js", "tailwind.config.js", "postcss.config.js"].forEach((file) => {
    const sourcePath = path.join(__dirname, "..", file)
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, path.join(targetDir, file))
    }
  })

  // Create necessary directories
  ;["public", "app", "components", "lib", "types", "styles"].forEach((dir) => {
    const targetPath = path.join(targetDir, dir)
    if (!fs.existsSync(targetPath)) {
      fs.mkdirSync(targetPath, { recursive: true })
    }
  })
}

// Copy main site files
function copyMainSiteFiles() {
  console.log("Copying main site files...")

  copySharedFiles(mainDir)

  // Copy main site specific files
  ;["app/page.tsx", "app/layout.tsx", "app/globals.css", "components/theme-provider.tsx"].forEach((file) => {
    const sourcePath = path.join(__dirname, "..", file)
    const targetPath = path.join(mainDir, file)

    // Create the directory if it doesn't exist
    const targetDir = path.dirname(targetPath)
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true })
    }

    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, targetPath)
    }
  })

  // Create a README.md file
  fs.writeFileSync(
    path.join(mainDir, "README.md"),
    `# SwingIT Solutions Main Site

This is the main site for SwingIT Solutions.

## Getting Started

1. Install dependencies: \`npm install\`
2. Start the development server: \`npm run dev\`
3. Build for production: \`npm run build\`
4. Start the production server: \`npm start\`

## Environment Variables

Create a \`.env.local\` file with the following variables:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`
`,
  )
}

// Copy backoffice files
function copyBackofficeFiles() {
  console.log("Copying backoffice files...")

  copySharedFiles(backofficeDir)

  // Copy backoffice specific files
  ;[
    "app/backoffice",
    "app/(dashboard)",
    "components/dashboard",
    "components/sites",
    "components/api-keys",
    "components/login-form.tsx",
    "components/header.tsx",
    "components/sidebar.tsx",
    "components/api-expiration-alert.tsx",
    "lib/github.ts",
    "lib/vercel.ts",
    "lib/api-client.ts",
    "lib/api-expiration.ts",
    "lib/supabase.ts",
    "types/supabase.ts",
  ].forEach((file) => {
    const sourcePath = path.join(__dirname, "..", file)
    const targetPath = path.join(backofficeDir, file)

    // If it's a directory, copy recursively
    if (fs.existsSync(sourcePath) && fs.statSync(sourcePath).isDirectory()) {
      copyDir(sourcePath, targetPath)
    } else if (fs.existsSync(sourcePath)) {
      // Create the directory if it doesn't exist
      const targetDir = path.dirname(targetPath)
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true })
      }

      fs.copyFileSync(sourcePath, targetPath)
    }
  })

  // Create a README.md file
  fs.writeFileSync(
    path.join(backofficeDir, "README.md"),
    `# SwingIT Solutions Backoffice

This is the backoffice for SwingIT Solutions.

## Getting Started

1. Install dependencies: \`npm install\`
2. Start the development server: \`npm run dev\`
3. Build for production: \`npm run build\`
4. Start the production server: \`npm start\`

## Environment Variables

Create a \`.env.local\` file with the following variables:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
GITHUB_TOKEN=your_github_token
VERCEL_TOKEN=your_vercel_token
\`\`\`
`,
  )

  // Copy scripts
  const scriptsDir = path.join(backofficeDir, "scripts")
  if (!fs.existsSync(scriptsDir)) {
    fs.mkdirSync(scriptsDir, { recursive: true })
  }
  ;[
    "scripts/v0-api.js",
    "scripts/apply-v0-changes.js",
    "scripts/setup-git-hooks.js",
    "scripts/restructure-project.js",
  ].forEach((file) => {
    const sourcePath = path.join(__dirname, "..", file)
    const targetPath = path.join(backofficeDir, file)

    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, targetPath)
    }
  })
}

// Copy affiliate site template files
function copyAffiliateSiteFiles() {
  console.log("Copying affiliate site template files...")

  copySharedFiles(affiliateSiteDir)

  // Copy affiliate site specific files
  ;[
    "app/casinos",
    "app/articles",
    "app/api/backoffice",
    "components/casino-list.tsx",
    "components/article-list.tsx",
    "components/featured-casinos.tsx",
    "components/latest-articles.tsx",
    "components/hero-section.tsx",
    "components/hero-slideshow.tsx",
    "components/footer.tsx",
    "components/promo-section.tsx",
    "components/page-header.tsx",
    "components/casino-details.tsx",
    "components/article-content.tsx",
    "components/related-casinos.tsx",
    "components/related-articles.tsx",
    "components/analytics.tsx",
    "components/client-wrapper.tsx",
    "lib/api/casinos.ts",
    "lib/api/articles.ts",
    "lib/api/banners.ts",
    "lib/supabase.ts",
    "types/casino.ts",
    "types/article.ts",
    "types/banner.ts",
    "types/hero-banner.ts",
    "types/supabase.ts",
    "config/site.ts",
  ].forEach((file) => {
    const sourcePath = path.join(__dirname, "..", file)
    const targetPath = path.join(affiliateSiteDir, file)

    // If it's a directory, copy recursively
    if (fs.existsSync(sourcePath) && fs.statSync(sourcePath).isDirectory()) {
      copyDir(sourcePath, targetPath)
    } else if (fs.existsSync(sourcePath)) {
      // Create the directory if it doesn't exist
      const targetDir = path.dirname(targetPath)
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true })
      }

      fs.copyFileSync(sourcePath, targetPath)
    }
  })

  // Create a README.md file
  fs.writeFileSync(
    path.join(affiliateSiteDir, "README.md"),
    `# SwingIT Solutions Affiliate Site Template

This is the template for SwingIT Solutions affiliate sites.

## Getting Started

1. Install dependencies: \`npm install\`
2. Start the development server: \`npm run dev\`
3. Build for production: \`npm run build\`
4. Start the production server: \`npm start\`

## Environment Variables

Create a \`.env.local\` file with the following variables:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_ID=your_site_id
BACKOFFICE_API_KEY=your_backoffice_api_key
\`\`\`
`,
  )
}

// Helper function to copy a directory recursively
function copyDir(source, target) {
  // Create the target directory if it doesn't exist
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true })
  }

  // Get all files and directories in the source directory
  const entries = fs.readdirSync(source, { withFileTypes: true })

  // Copy each entry
  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name)
    const targetPath = path.join(target, entry.name)

    if (entry.isDirectory()) {
      // Recursively copy directories
      copyDir(sourcePath, targetPath)
    } else {
      // Copy files
      fs.copyFileSync(sourcePath, targetPath)
    }
  }
}

// Main function
function main() {
  console.log("Restructuring project...")

  // Copy files for each project
  copyMainSiteFiles()
  copyBackofficeFiles()
  copyAffiliateSiteFiles()

  console.log("Project restructured successfully!")
  console.log(`Output directories:
- Main site: ${mainDir}
- Backoffice: ${backofficeDir}
- Affiliate site template: ${affiliateSiteDir}
`)
}

// Run the main function
main()

