// API client functions for the backoffice

// Create a new site
export async function createSite(siteData: {
  name: string
  domain: string
  description: string
  contactEmail: string
}) {
  try {
    const response = await fetch("/api/sites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(siteData),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Failed to create site")
    }

    return {
      success: true,
      data: data.site,
    }
  } catch (error: any) {
    console.error("Error creating site:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

// Get all sites
export async function getSites() {
  try {
    const response = await fetch("/api/sites")
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch sites")
    }

    return {
      success: true,
      data: data.sites,
    }
  } catch (error: any) {
    console.error("Error fetching sites:", error)
    return {
      success: false,
      error: error.message,
      data: [],
    }
  }
}

// Get API keys that are expiring soon
export async function getExpiringApiKeys() {
  try {
    const response = await fetch("/api/api-keys/expiring")
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch expiring API keys")
    }

    return {
      success: true,
      data: data.keys,
    }
  } catch (error: any) {
    console.error("Error fetching expiring API keys:", error)
    return {
      success: false,
      error: error.message,
      data: [],
    }
  }
}

