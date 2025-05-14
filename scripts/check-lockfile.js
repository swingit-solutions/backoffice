const fs = require("fs")
const { execSync } = require("child_process")
const path = require("path")

// Get the root directory of the project
const rootDir = path.resolve(__dirname, "..")

// Paths to package.json and pnpm-lock.yaml
const packageJsonPath = path.join(rootDir, "package.json")
const lockfilePath = path.join(rootDir, "pnpm-lock.yaml")

// Check if both files exist
if (!fs.existsSync(packageJsonPath)) {
  console.error("Error: package.json not found")
  process.exit(1)
}

if (!fs.existsSync(lockfilePath)) {
  console.log("Lock file not found. Running pnpm install to create it...")
  execSync("pnpm install", { stdio: "inherit" })
  process.exit(0)
}

// Get file modification times
const packageJsonMtime = fs.statSync(packageJsonPath).mtime
const lockfileMtime = fs.statSync(lockfilePath).mtime

// Check if package.json is newer than the lock file
if (packageJsonMtime > lockfileMtime) {
  console.log("package.json is newer than pnpm-lock.yaml. Updating lock file...")
  try {
    execSync("pnpm install --no-frozen-lockfile", { stdio: "inherit" })
    console.log("Lock file updated successfully.")
  } catch (error) {
    console.error("Error updating lock file:", error.message)
    process.exit(1)
  }
} else {
  console.log("Lock file is up to date.")
}
