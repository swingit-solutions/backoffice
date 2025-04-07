/**
 * v0 API Integration Script
 *
 * This script provides functions to interact with the v0 API programmatically.
 * It allows you to send prompts to v0 and receive responses, which can then be
 * applied to your codebase automatically.
 *
 * Usage:
 * node scripts/v0-api.js "Create a new component that displays a list of users"
 */

const fs = require("fs")
const path = require("path")
const https = require("https")

// Configuration
const V0_API_KEY = process.env.V0_API_KEY // Set this in your environment variables
const V0_API_URL = "https://api.v0.dev/api/generate"

if (!V0_API_KEY) {
  console.error("Error: V0_API_KEY environment variable is not set.")
  console.error("Please set the V0_API_KEY environment variable with your v0 API key.")
  process.exit(1)
}

/**
 * Send a prompt to the v0 API and get a response
 * @param {string} prompt - The prompt to send to v0
 * @returns {Promise<Object>} - The response from v0
 */
async function sendPromptToV0(prompt) {
  return new Promise((resolve, reject) => {
    // Prepare the request data
    const data = JSON.stringify({
      prompt: prompt,
      // Add any additional parameters here
    })

    // Prepare the request options
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${V0_API_KEY}`,
        "Content-Length": data.length,
      },
    }

    // Send the request
    const req = https.request(V0_API_URL, options, (res) => {
      let responseData = ""

      // Collect the response data
      res.on("data", (chunk) => {
        responseData += chunk
      })

      // Process the response when it's complete
      res.on("end", () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const parsedData = JSON.parse(responseData)
            resolve(parsedData)
          } catch (error) {
            reject(new Error(`Failed to parse response: ${error.message}`))
          }
        } else {
          reject(new Error(`Request failed with status code ${res.statusCode}: ${responseData}`))
        }
      })
    })

    // Handle request errors
    req.on("error", (error) => {
      reject(new Error(`Request error: ${error.message}`))
    })

    // Send the request data
    req.write(data)
    req.end()
  })
}

/**
 * Extract code blocks from v0's response
 * @param {Object} response - The response from v0
 * @returns {Array<Object>} - An array of code blocks
 */
function extractCodeBlocks(response) {
  // This function will need to be adapted based on the actual structure of v0's API response
  // For now, we'll assume the response contains a 'codeBlocks' array
  if (!response.codeBlocks || !Array.isArray(response.codeBlocks)) {
    throw new Error("No code blocks found in the response")
  }

  return response.codeBlocks.map((block) => ({
    path: block.path,
    content: block.content,
  }))
}

/**
 * Main function to process a prompt and apply the changes
 * @param {string} prompt - The prompt to send to v0
 */
async function processPrompt(prompt) {
  try {
    console.log(`Sending prompt to v0: "${prompt}"`)

    // Send the prompt to v0
    const response = await sendPromptToV0(prompt)

    // Extract code blocks from the response
    const codeBlocks = extractCodeBlocks(response)

    // Save the response to a file for reference
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
    const responseFilePath = path.join(__dirname, "..", "v0-responses", `response-${timestamp}.json`)

    // Create the directory if it doesn't exist
    const responseDir = path.dirname(responseFilePath)
    if (!fs.existsSync(responseDir)) {
      fs.mkdirSync(responseDir, { recursive: true })
    }

    // Write the response to a file
    fs.writeFileSync(responseFilePath, JSON.stringify(response, null, 2))

    console.log(`Response saved to ${responseFilePath}`)

    // Apply the code blocks
    applyCodeBlocks(codeBlocks)

    console.log("All changes applied successfully!")
  } catch (error) {
    console.error("Error processing prompt:", error.message)
    process.exit(1)
  }
}

/**
 * Apply code blocks to the codebase
 * @param {Array<Object>} codeBlocks - An array of code blocks
 */
function applyCodeBlocks(codeBlocks) {
  console.log(`Applying ${codeBlocks.length} code blocks...`)

  for (const block of codeBlocks) {
    const filePath = path.join(__dirname, "..", block.path)

    // Create the directory if it doesn't exist
    const dir = path.dirname(filePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    // Write the file
    fs.writeFileSync(filePath, block.content)
    console.log(`Applied changes to ${block.path}`)
  }
}

// If this script is run directly, process the prompt from the command line
if (require.main === module) {
  const prompt = process.argv.slice(2).join(" ")

  if (!prompt) {
    console.error("Error: No prompt provided.")
    console.error('Usage: node scripts/v0-api.js "Your prompt here"')
    process.exit(1)
  }

  processPrompt(prompt)
}

// Export the functions for use in other scripts
module.exports = {
  sendPromptToV0,
  extractCodeBlocks,
  processPrompt,
  applyCodeBlocks,
}

