import { Octokit } from "@octokit/rest"

// Initialize Octokit with GitHub token
function getOctokit() {
  // IMPORTANT: Replace this with your actual GitHub token
  // For production, store this in an environment variable: process.env.GITHUB_TOKEN
  const githubToken = process.env.GITHUB_TOKEN

  if (!githubToken) {
    throw new Error("GitHub token is not configured. Please add GITHUB_TOKEN to your environment variables.")
  }

  return new Octokit({
    auth: githubToken,
  })
}

// Create a new GitHub repository
export async function createGitHubRepository(name: string, description = "SwingIT Solutions affiliate site") {
  const octokit = getOctokit()

  try {
    const response = await octokit.repos.createForAuthenticatedUser({
      name,
      description,
      private: true,
      auto_init: true, // Initialize with README
    })

    return {
      success: true,
      data: response.data,
    }
  } catch (error: any) {
    console.error("Error creating GitHub repository:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

// Clone template repository to new repository
export async function cloneTemplateToNewRepo(templateOwner: string, templateRepo: string, newRepoName: string) {
  const octokit = getOctokit()

  try {
    // 1. Get template repository contents
    const { data: templateContents } = await octokit.repos.getContent({
      owner: templateOwner,
      repo: templateRepo,
      path: "",
    })

    // 2. For each file/directory in the template, copy to new repo
    // Fix: Ensure templateContents is an array before iterating
    const contentArray = Array.isArray(templateContents) ? templateContents : [templateContents]

    for (const item of contentArray) {
      if (item.type === "file") {
        // Get file content
        const { data: fileData } = await octokit.repos.getContent({
          owner: templateOwner,
          repo: templateRepo,
          path: item.path,
        })

        // Create file in new repo
        await octokit.repos.createOrUpdateFileContents({
          owner: templateOwner, // Your GitHub username or organization
          repo: newRepoName,
          path: item.path,
          message: `Add ${item.path} from template`,
          content: (fileData as any).content,
        })
      } else if (item.type === "dir") {
        // For directories, you'd need to recursively copy contents
        // This is a simplified example
        await copyDirectory(templateOwner, templateRepo, newRepoName, item.path)
      }
    }

    return {
      success: true,
      message: "Template cloned successfully",
    }
  } catch (error: any) {
    console.error("Error cloning template to new repo:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

// Helper function to copy a directory recursively
async function copyDirectory(owner: string, templateRepo: string, newRepo: string, path: string) {
  const octokit = getOctokit()

  // Get directory contents
  const { data: contents } = await octokit.repos.getContent({
    owner,
    repo: templateRepo,
    path,
  })

  // Copy each item in the directory
  // Fix: Ensure contents is an array before iterating
  const contentArray = Array.isArray(contents) ? contents : [contents]

  for (const item of contentArray) {
    if (item.type === "file") {
      const { data: fileData } = await octokit.repos.getContent({
        owner,
        repo: templateRepo,
        path: item.path,
      })

      await octokit.repos.createOrUpdateFileContents({
        owner,
        repo: newRepo,
        path: item.path,
        message: `Add ${item.path} from template`,
        content: (fileData as any).content,
      })
    } else if (item.type === "dir") {
      await copyDirectory(owner, templateRepo, newRepo, item.path)
    }
  }
}

/*
 * INSTRUCTIONS FOR GETTING A GITHUB TOKEN:
 *
 * 1. Go to GitHub.com and log in to your account
 * 2. Click on your profile picture in the top right corner
 * 3. Select "Settings"
 * 4. Scroll down and select "Developer settings" from the left sidebar
 * 5. Select "Personal access tokens" and then "Tokens (classic)"
 * 6. Click "Generate new token" and select "Generate new token (classic)"
 * 7. Give your token a descriptive name like "SwingIT Solutions Site Creator"
 * 8. Set the expiration as needed (e.g., 1 year)
 * 9. Select the following scopes:
 *    - repo (all)
 *    - workflow
 *    - admin:org (if you're using an organization)
 * 10. Click "Generate token"
 * 11. IMPORTANT: Copy the token immediately and store it securely
 * 12. Add this token as an environment variable named GITHUB_TOKEN in your Vercel project
 */
