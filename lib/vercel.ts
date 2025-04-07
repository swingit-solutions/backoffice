// Vercel API integration

// Define types for Vercel API responses
interface VercelProject {
  id: string
  name: string
  link: string
}

interface VercelDeployment {
  id: string
  url: string
  readyState: string
}

// Initialize Vercel API client
function getVercelHeaders() {
  // IMPORTANT: Replace with your actual Vercel token
  // For production, store this in an environment variable: process.env.VERCEL_TOKEN
  const vercelToken = process.env.VERCEL_TOKEN || "3VnShsTNe08T7Rsb84ZV6JJI"

  if (!vercelToken) {
    throw new Error("Vercel token is not configured. Please add VERCEL_TOKEN to your environment variables.")
  }

  return {
    Authorization: `Bearer ${vercelToken}`,
    "Content-Type": "application/json",
  }
}

// Create a new Vercel project
export async function createVercelProject({
  name,
  gitRepository,
  environmentVariables = {},
}: {
  name: string
  gitRepository: string
  environmentVariables?: Record<string, string>
}) {
  try {
    // 1. Create the project
    const createResponse = await fetch("https://api.vercel.com/v9/projects", {
      method: "POST",
      headers: getVercelHeaders(),
      body: JSON.stringify({
        name,
        framework: "nextjs",
        gitRepository: {
          type: "github",
          repo: gitRepository,
        },
      }),
    })

    const projectData = await createResponse.json()

    if (!createResponse.ok) {
      throw new Error(projectData.error?.message || "Failed to create Vercel project")
    }

    // 2. Add environment variables
    if (Object.keys(environmentVariables).length > 0) {
      await addEnvironmentVariables(projectData.id, environmentVariables)
    }

    return {
      success: true,
      data: projectData,
    }
  } catch (error: any) {
    console.error("Error creating Vercel project:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

// Add environment variables to a Vercel project
async function addEnvironmentVariables(projectId: string, variables: Record<string, string>) {
  try {
    // Create an array of environment variable objects
    const envVars = Object.entries(variables).map(([key, value]) => ({
      key,
      value,
      target: ["production", "preview", "development"],
      type: key.startsWith("NEXT_PUBLIC_") ? "plain" : "secret",
    }))

    // Add each environment variable
    for (const envVar of envVars) {
      await fetch(`https://api.vercel.com/v9/projects/${projectId}/env`, {
        method: "POST",
        headers: getVercelHeaders(),
        body: JSON.stringify(envVar),
      })
    }

    return { success: true }
  } catch (error: any) {
    console.error("Error adding environment variables:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

// Create a new deployment for a Vercel project
export async function createVercelDeployment(projectId: string) {
  try {
    const response = await fetch(`https://api.vercel.com/v13/deployments`, {
      method: "POST",
      headers: getVercelHeaders(),
      body: JSON.stringify({
        projectId,
        target: "production",
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to create deployment")
    }

    return {
      success: true,
      data,
    }
  } catch (error: any) {
    console.error("Error creating Vercel deployment:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

// Get all Vercel projects
export async function getVercelProjects() {
  try {
    const response = await fetch("https://api.vercel.com/v9/projects", {
      headers: getVercelHeaders(),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to fetch projects")
    }

    return {
      success: true,
      data: data.projects,
    }
  } catch (error: any) {
    console.error("Error fetching Vercel projects:", error)
    return {
      success: false,
      error: error.message,
      data: [],
    }
  }
}

// Add a domain to a Vercel project
export async function addDomainToProject(projectId: string, domain: string) {
  try {
    const response = await fetch(`https://api.vercel.com/v9/projects/${projectId}/domains`, {
      method: "POST",
      headers: getVercelHeaders(),
      body: JSON.stringify({
        name: domain,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to add domain")
    }

    return {
      success: true,
      data,
    }
  } catch (error: any) {
    console.error("Error adding domain to project:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

/*
 * INSTRUCTIONS FOR VERCEL TOKEN EXPIRATION:
 *
 * Your Vercel token (3VnShsTNe08T7Rsb84ZV6JJI) expires on April 8, 2026.
 *
 * To renew it:
 * 1. Go to vercel.com and log in
 * 2. Click on your profile picture in the top right
 * 3. Select "Settings"
 * 4. Go to "Tokens" in the left sidebar
 * 5. Create a new token or regenerate the existing one
 * 6. Update the token in your environment variables
 */

