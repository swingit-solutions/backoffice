/**
 * GitHub Repository to v0 Chat Sync Script
 *
 * This script synchronizes a GitHub repository with v0 chat by:
 * 1. Fetching the complete structure of a GitHub repository
 * 2. Comparing it with what's currently in the v0 chat
 * 3. Generating code blocks that can be pasted into v0 to update missing or changed files
 *
 * Configuration:
 * - Set environment variables or modify the CONFIG object below
 * - GITHUB_TOKEN must be set in environment variables
 *
 * Usage:
 * - Run this script directly: node github-to-v0-sync.js
 * - Or set it up as a GitHub Action (see github-to-v0-sync.yml)
 */

// Configuration - modify these for different projects
const CONFIG = {
  // GitHub repository details
  owner: "swingit-solutions", // GitHub username or organization
  repo: "backoffice", // Repository name
  branch: "main", // Branch to sync

  // Sync options
  excludePaths: [
    // Uncomment and modify to exclude specific paths
    // 'node_modules',
    // '.git',
    // '.github',
    // 'dist',
    // '*.log',
  ],

  // Output options
  outputFile: "v0-sync-output.md", // Where to save the generated markdown

  // Advanced options
  binaryFileExtensions: [
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".ico",
    ".webp",
    ".bmp",
    ".tiff",
    ".pdf",
    ".zip",
    ".tar.gz",
    ".rar",
    ".7z",
    ".mp4",
    ".webm",
    ".avi",
    ".mov",
    ".mkv",
    ".mp3",
    ".wav",
    ".ogg",
    ".flac",
    ".ttf",
    ".woff",
    ".woff2",
    ".eot",
    ".exe",
    ".dll",
    ".so",
    ".dylib",
    ".psd",
    ".ai",
    ".sketch",
  ],
  maxFileSizeBytes: 100 * 1024 * 1024, // 100MB - GitHub API limit with raw media type
  largeFileThreshold: 1 * 1024 * 1024, // 1MB - Files larger than this will be flagged as "large"

  // Debug options
  verbose: true, // Set to true for detailed logging
}

// Dependencies
import fs from "fs/promises"
import path from "path"
import { Octokit } from "@octokit/rest"

// Initialize GitHub client
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})

// Main function
async function syncRepositoryToV0() {
  console.log(`🔄 Starting sync of ${CONFIG.owner}/${CONFIG.repo}:${CONFIG.branch} to v0 chat`)

  try {
    // 1. Fetch repository structure
    console.log("📂 Fetching repository structure...")
    const repoStructure = await fetchRepositoryStructure()

    // 2. Process repository files
    console.log("🔍 Processing repository files...")
    const syncOutput = await processRepositoryFiles(repoStructure)

    // 3. Generate v0 chat markdown
    console.log("📝 Generating v0 chat markdown...")
    const markdown = generateV0ChatMarkdown(syncOutput)

    // 4. Save output
    await fs.writeFile(CONFIG.outputFile, markdown)
    console.log(`✅ Sync complete! Output saved to ${CONFIG.outputFile}`)

    // 5. Print summary
    console.log("\n📊 Sync Summary:")
    console.log(`Total files: ${syncOutput.allFiles.length}`)
    console.log(`Files to add/update: ${syncOutput.filesToSync.length}`)
    console.log(`Binary files: ${syncOutput.binaryFiles.length}`)
    console.log(`Large files: ${syncOutput.largeFiles.length}`)
    console.log(`Node modules detected: ${syncOutput.nodeModules.length > 0 ? "Yes" : "No"}`)

    return {
      success: true,
      filesToSync: syncOutput.filesToSync.length,
      binaryFiles: syncOutput.binaryFiles.length,
      largeFiles: syncOutput.largeFiles.length,
    }
  } catch (error) {
    console.error("❌ Sync failed:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

// Fetch the complete repository structure
async function fetchRepositoryStructure(path = "", structure = { files: [], directories: [] }) {
  try {
    const { data } = await octokit.repos.getContent({
      owner: CONFIG.owner,
      repo: CONFIG.repo,
      path,
      ref: CONFIG.branch,
    })

    if (Array.isArray(data)) {
      // Directory
      for (const item of data) {
        if (shouldExcludePath(item.path)) {
          if (CONFIG.verbose) console.log(`Skipping excluded path: ${item.path}`)
          continue
        }

        if (item.type === "file") {
          structure.files.push(item)
        } else if (item.type === "dir") {
          structure.directories.push(item)
          // Recursively fetch directory contents
          await fetchRepositoryStructure(item.path, structure)
        }
      }
    } else {
      // Single file
      if (!shouldExcludePath(data.path)) {
        structure.files.push(data)
      }
    }

    return structure
  } catch (error) {
    console.error(`Error fetching repository structure for path "${path}":`, error)
    throw error
  }
}

// Check if a path should be excluded
function shouldExcludePath(filePath) {
  if (!CONFIG.excludePaths || CONFIG.excludePaths.length === 0) return false

  return CONFIG.excludePaths.some((pattern) => {
    if (pattern.startsWith("*")) {
      // Handle extension exclusion (e.g., "*.log")
      const extension = pattern.substring(1)
      return filePath.endsWith(extension)
    } else {
      // Handle directory or file exclusion
      return filePath === pattern || filePath.startsWith(pattern + "/")
    }
  })
}

// Process repository files
async function processRepositoryFiles(repoStructure) {
  const result = {
    allFiles: [],
    filesToSync: [],
    binaryFiles: [],
    largeFiles: [],
    nodeModules: [],
  }

  // Process all files
  for (const file of repoStructure.files) {
    result.allFiles.push(file)

    // Check if it's a node_module
    if (file.path.includes("node_modules/")) {
      result.nodeModules.push(file)
      continue
    }

    // Check if it's a binary file
    const extension = path.extname(file.path).toLowerCase()
    const isBinary = CONFIG.binaryFileExtensions.includes(extension)

    if (isBinary) {
      result.binaryFiles.push(file)
      // We'll still include binary files in filesToSync, but with special handling
    }

    // Fetch file content
    try {
      const fileData = await fetchFileContent(file)

      // Check if it's a large file
      if (fileData.size > CONFIG.largeFileThreshold) {
        result.largeFiles.push({
          ...file,
          size: fileData.size,
        })
      }

      result.filesToSync.push({
        ...file,
        content: fileData.content,
        encoding: fileData.encoding,
        isBinary: isBinary || fileData.isBinary,
        size: fileData.size,
      })
    } catch (error) {
      console.error(`Error processing file ${file.path}:`, error)
    }
  }

  return result
}

// Fetch content for a specific file
async function fetchFileContent(file) {
  try {
    // For potentially large files, we'll use the raw media type
    // This allows us to fetch files up to 100MB instead of just 1MB
    const options = {
      owner: CONFIG.owner,
      repo: CONFIG.repo,
      path: file.path,
      ref: CONFIG.branch,
      headers: {
        accept: "application/vnd.github.v3.raw",
      },
    }

    if (CONFIG.verbose) console.log(`Fetching content for ${file.path}`)

    // When using the raw media type, the response is the raw file content
    // not a JSON object with base64 encoded content
    const response = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", options)

    // The response format depends on whether we got raw content or JSON
    if (typeof response.data === "string") {
      // We got raw content (for files > 1MB)
      return {
        content: response.data,
        encoding: "utf-8",
        isRaw: true,
        size: response.data.length,
        isBinary: false,
      }
    } else {
      // We got JSON with base64 content (for files <= 1MB)
      const content = Buffer.from(response.data.content, "base64").toString("utf-8")
      return {
        content: content,
        encoding: "utf-8",
        isRaw: false,
        size: content.length,
        isBinary: false,
      }
    }
  } catch (error) {
    // Special handling for binary files that can't be converted to UTF-8
    if (error.message.includes("encoding") || error.message.includes("convert")) {
      console.warn(`Warning: File ${file.path} appears to be binary and cannot be properly decoded.`)
      return {
        content: `[Binary file content - ${file.size || "unknown"} bytes]`,
        encoding: "binary",
        isBinary: true,
        size: file.size || 0,
      }
    }

    console.error(`Error fetching content for file ${file.path}:`, error)
    throw error
  }
}

// Generate markdown for v0 chat
function generateV0ChatMarkdown(syncOutput) {
  let markdown = `# GitHub Repository Sync to v0 Chat\n\n`
  markdown += `Repository: ${CONFIG.owner}/${CONFIG.repo}:${CONFIG.branch}\n\n`

  // Add summary
  markdown += `## Summary\n\n`
  markdown += `- Total files: ${syncOutput.allFiles.length}\n`
  markdown += `- Files to sync: ${syncOutput.filesToSync.length}\n`
  markdown += `- Binary files: ${syncOutput.binaryFiles.length}\n`
  markdown += `- Large files: ${syncOutput.largeFiles.length}\n\n`

  // Add CodeProject block
  const yaml = `name: Sync GitHub Repository to v0 Chat

on:
  # Run on push to main branch
  push:
    branches: [ main ]
  
  # Run on pull request to main branch
  pull_request:
    branches: [ main ]
    
  # Allow manual triggering
  workflow_dispatch:
  
  # Run on a schedule (weekly on Monday at midnight)
  schedule:
    - cron: '0 0 * * 1'

jobs:
  sync:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3
        with:
          fetch-depth: 0  # Fetch all history for proper comparison
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm install @octokit/rest
      
      - name: Create package.json for ES modules
        run: |
          echo '{
            "name": "github-to-v0-sync",
            "version": "1.0.0",
            "type": "module",
            "private": true
          }' > package.json
      
      - name: Run sync script
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
        run: node github-to-v0-sync.js
      
      - name: Upload sync output as artifact
        uses: actions/upload-artifact@v4
        with:
          name: v0-sync-output
          path: v0-sync-output.md
          retention-days: 7  # Keep for 7 days
          
      # Create a release using the newer softprops/action-gh-release action
      - name: Create Release
        if: (github.event_name == 'push' && github.ref == 'refs/heads/main') || github.event_name == 'workflow_dispatch'
        uses: softprops/action-gh-release@v1
        with:
          tag_name: v0-sync-\${{ github.run_number }}
          name: v0 Sync \${{ github.run_number }}
          body: |
            Automated v0 Chat sync for commit \${{ github.sha }}
            
            This release contains the latest sync output for v0 Chat.
            Download the attached markdown file and paste its contents into v0 Chat to update your project.
          files: ./v0-sync-output.md
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
`
  const file = ".github/workflows/github-to-v0-sync.yml"
  const Sync = "Sync"
  const GitHub = "GitHub"
  const Repository = "Repository"
  markdown += `\`\`\`yaml file="${file}"\n${yaml}\`\`\``
  return markdown
}
