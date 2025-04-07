/**
 * Apply v0 Changes Script
 *
 * This script applies changes from a v0 response JSON file to your codebase.
 * It extracts code blocks from the response and writes them to the appropriate files.
 *
 * Usage:
 * node scripts/apply-v0-changes.js path/to/v0-response.json
 */

const fs = require("fs")
const path = require("path")

// Get the path to the v0 response JSON file
const v0ResponsePath = process.argv[2]

if (!v0ResponsePath) {
  console.error("Error: No v0 response file provided.")
  console.error("Usage: node scripts/apply-v0-changes.js path/to/v0-response.json")
  process.exit(1)
}

// Check if the file exists
if (!fs.existsSync(v0ResponsePath)) {
  console.error(`Error: File not found: ${v0ResponsePath}`)
  process.exit(1)
}

try {
  // Read the v0 response
  const v0Response = JSON.parse(fs.readFileSync(v0ResponsePath, "utf8"))

  // Extract the code blocks from the response
  // This will need to be adapted based on the actual structure of v0's API response
  const codeBlocks = v0Response.codeBlocks || []

  if (codeBlocks.length === 0) {
    console.warn("Warning: No code blocks found in the response.")
    process.exit(0)
  }

  console.log(`Applying ${codeBlocks.length} code blocks...`)

  // Apply each code block
  for (const block of codeBlocks) {
    const filePath = path.join(process.cwd(), block.path)

    // Create the directory if it doesn't exist
    const dir = path.dirname(filePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    // Write the file
    fs.writeFileSync(filePath, block.content)
    console.log(`Applied changes to ${block.path}`)
  }

  console.log("All changes applied successfully!")
} catch (error) {
  console.error("Error applying changes:", error.message)
  process.exit(1)
}

