/**
 * Setup Git Hooks Script
 *
 * This script sets up Git hooks to automatically apply v0 changes when pulling from the repository.
 * It creates a post-merge hook that checks for v0 response files in the repository and applies them.
 *
 * Usage:
 * node scripts/setup-git-hooks.js
 */

const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

// Get the path to the Git hooks directory
const gitDir = execSync("git rev-parse --git-dir").toString().trim()
const hooksDir = path.join(gitDir, "hooks")

// Create the hooks directory if it doesn't exist
if (!fs.existsSync(hooksDir)) {
  fs.mkdirSync(hooksDir, { recursive: true })
}

// Path to the post-merge hook
const postMergeHookPath = path.join(hooksDir, "post-merge")

// Content of the post-merge hook
const postMergeHookContent = `#!/bin/sh
#
# Post-merge hook to automatically apply v0 changes
#

# Check if there are any v0 response files in the repository
v0_responses=$(git diff-tree -r --name-only ORIG_HEAD HEAD | grep 'v0-responses/.*\\.json$')

if [ -n "$v0_responses" ]; then
  echo "Found v0 response files in the merge. Applying changes..."
  
  # Apply each v0 response file
  for response_file in $v0_responses; do
    echo "Applying changes from $response_file..."
    node scripts/apply-v0-changes.js "$response_file"
  done
  
  echo "All v0 changes applied successfully!"
fi
`

// Write the post-merge hook
fs.writeFileSync(postMergeHookPath, postMergeHookContent)

// Make the hook executable
fs.chmodSync(postMergeHookPath, "755")

console.log("Git hooks set up successfully!")
console.log(`Post-merge hook created at ${postMergeHookPath}`)
console.log("This hook will automatically apply v0 changes when pulling from the repository.")

