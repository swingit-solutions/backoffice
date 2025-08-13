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
 * - Run this script directly: node github-to-v0-sync.mjs
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
};

// Dependencies
import fs from "fs/promises";
import path from "path";
import { Octokit } from "@octokit/rest";

// Initialize GitHub client
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

// Main function
async function syncRepositoryToV0() {
  console.log(`🔄 Starting sync of ${CONFIG.owner}/${CONFIG.repo}:${CONFIG.branch} to v0 chat`);

  try {
    // 1. Fetch repository structure
    console.log("📂 Fetching repository structure...");
    const repoStructure = await fetchRepositoryStructure();
    
    console.log(`Found ${repoStructure.files.length} files and ${repoStructure.directories.length} directories`);

    // 2. Process repository files
    console.log("🔍 Processing repository files...");
    const syncOutput = await processRepositoryFiles(repoStructure);
    
    console.log(`Processed ${syncOutput.allFiles.length} files`);

    // 3. Generate v0 chat markdown
    console.log("📝 Generating v0 chat markdown...");
    const markdown = generateV0ChatMarkdown(syncOutput);
    
    console.log(`Generated markdown with ${markdown.length} characters`);

    // 4. Save output
    console.log(`Writing output to ${CONFIG.outputFile}...`);
    await fs.writeFile(CONFIG.outputFile, markdown);
    console.log(`✅ Sync complete! Output saved to ${CONFIG.outputFile}`);

    // 5. Print summary
    console.log("\n📊 Sync Summary:");
    console.log(`Total files: ${syncOutput.allFiles.length}`);
    console.log(`Files to add/update: ${syncOutput.filesToSync.length}`);
    console.log(`Binary files: ${syncOutput.binaryFiles.length}`);
    console.log(`Large files: ${syncOutput.largeFiles.length}`);
    console.log(`Node modules detected: ${syncOutput.nodeModules.length > 0 ? "Yes" : "No"}`);

    return {
      success: true,
      filesToSync: syncOutput.filesToSync.length,
      binaryFiles: syncOutput.binaryFiles.length,
      largeFiles: syncOutput.largeFiles.length,
    };
  } catch (error) {
    console.error("❌ Sync failed:", error);
    
    // Create a minimal output file with the error
    const errorMarkdown = `# GitHub Repository Sync to v0 Chat - Error\n\n` +
      `Repository: ${CONFIG.owner}/${CONFIG.repo}:${CONFIG.branch}\n\n` +
      `## Error\n\n` +
      `\`\`\`\n${error.stack || error.message}\n\`\`\`\n`;
    
    await fs.writeFile(CONFIG.outputFile, errorMarkdown);
    console.log(`Created error report in ${CONFIG.outputFile}`);
    
    return {
      success: false,
      error: error.message,
    };
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
    });

    if (Array.isArray(data)) {
      // Directory
      for (const item of data) {
        if (shouldExcludePath(item.path)) {
          if (CONFIG.verbose) console.log(`Skipping excluded path: ${item.path}`);
          continue;
        }

        if (item.type === "file") {
          structure.files.push(item);
        } else if (item.type === "dir") {
          structure.directories.push(item);
          // Recursively fetch directory contents
          await fetchRepositoryStructure(item.path, structure);
        }
      }
    } else {
      // Single file
      if (!shouldExcludePath(data.path)) {
        structure.files.push(data);
      }
    }

    return structure;
  } catch (error) {
    console.error(`Error fetching repository structure for path "${path}":`, error);
    throw error;
  }
}

// Check if a path should be excluded
function shouldExcludePath(filePath) {
  if (!CONFIG.excludePaths || CONFIG.excludePaths.length === 0) return false;

  return CONFIG.excludePaths.some((pattern) => {
    if (pattern.startsWith("*")) {
      // Handle extension exclusion (e.g., "*.log")
      const extension = pattern.substring(1);
      return filePath.endsWith(extension);
    } else {
      // Handle directory or file exclusion
      return filePath === pattern || filePath.startsWith(pattern + "/");
    }
  });
}

// Process repository files
async function processRepositoryFiles(repoStructure) {
  const result = {
    allFiles: [],
    filesToSync: [],
    binaryFiles: [],
    largeFiles: [],
    nodeModules: [],
  };

  // Process all files
  for (const file of repoStructure.files) {
    result.allFiles.push(file);

    // Check if it's a node_module
    if (file.path.includes("node_modules/")) {
      result.nodeModules.push(file);
      continue;
    }

    // Check if it's a binary file
    const extension = path.extname(file.path).toLowerCase();
    const isBinary = CONFIG.binaryFileExtensions.includes(extension);

    if (isBinary) {
      result.binaryFiles.push(file);
      // We'll still include binary files in filesToSync, but with special handling
    }

    // Fetch file content
    try {
      const fileData = await fetchFileContent(file);

      // Check if it's a large file
      if (fileData.size > CONFIG.largeFileThreshold) {
        result.largeFiles.push({
          ...file,
          size: fileData.size,
        });
      }

      result.filesToSync.push({
        ...file,
        content: fileData.content,
        encoding: fileData.encoding,
        isBinary: isBinary || fileData.isBinary,
        size: fileData.size,
      });
    } catch (error) {
      console.error(`Error processing file ${file.path}:`, error);
    }
  }

  return result;
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
    };

    if (CONFIG.verbose) console.log(`Fetching content for ${file.path}`);

    // When using the raw media type, the response is the raw file content
    // not a JSON object with base64 encoded content
    const response = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", options);

    // The response format depends on whether we got raw content or JSON
    if (typeof response.data === "string") {
      // We got raw content (for files > 1MB)
      return {
        content: response.data,
        encoding: "utf-8",
        isRaw: true,
        size: response.data.length,
        isBinary: false,
      };
    } else {
      // We got JSON with base64 content (for files <= 1MB)
      const content = Buffer.from(response.data.content, "base64").toString("utf-8");
      return {
        content: content,
        encoding: "utf-8",
        isRaw: false,
        size: content.length,
        isBinary: false,
      };
    }
  } catch (error) {
    // Special handling for binary files that can't be converted to UTF-8
    if (error.message.includes("encoding") || error.message.includes("convert")) {
      console.warn(`Warning: File ${file.path} appears to be binary and cannot be properly decoded.`);
      return {
        content: `[Binary file content - ${file.size || "unknown"} bytes]`,
        encoding: "binary",
        isBinary: true,
        size: file.size || 0,
      };
    }

    console.error(`Error fetching content for file ${file.path}:`, error);
    throw error;
  }
}

// Generate markdown for v0 chat
function generateV0ChatMarkdown(syncOutput) {
  let markdown = `# GitHub Repository Sync to v0 Chat\n\n`;
  
  // Add AI instructions at the top
  markdown += `<!-- v0 AI INSTRUCTIONS: Please import ALL files in this document into the Code Project view automatically. This document contains the complete repository structure that needs to be represented in the project chat. -->\n\n`;
  markdown += `<!-- IMPORTANT: After reading this file, please create a CodeProject with all the files below to ensure the entire repository structure is available in the chat. -->\n\n`;
  
  markdown += `Repository: ${CONFIG.owner}/${CONFIG.repo}:${CONFIG.branch}\n\n`;
  
  // Add summary
  markdown += `## Summary\n\n`;
  markdown += `- Total files: ${syncOutput.allFiles.length}\n`;
  markdown += `- Files to sync: ${syncOutput.filesToSync.length}\n`;
  markdown += `- Binary files: ${syncOutput.binaryFiles.length}\n`;
  markdown += `- Large files: ${syncOutput.largeFiles.length}\n\n`;
  
  // Add explicit instruction for the AI
  markdown += `## Instructions for v0 AI\n\n`;
  markdown += `Please import all the files below into the Code Project view to ensure the complete repository structure is available in this chat. This is essential for maintaining synchronization between GitHub and v0.\n\n`;
  
  // Add CodeProject block
  markdown += `<CodeProject id="${CONFIG.repo}">\n\n`;
  
  // Add files
  for (const file of syncOutput.filesToSync) {
    const fileExtension = path.extname(file.path).substring(1); // Remove the dot
    const language = getLanguageForExtension(fileExtension);
    
    if (file.isBinary) {
      markdown += `<!-- Binary file: ${file.path} -->\n`;
      markdown += `<!-- To include this file, upload it to v0 and use the following syntax: -->\n`;
      markdown += "```" + `${fileExtension} file="${file.path}" url="https://v0.blob.com/YOUR_BLOB_URL"\n` + "```\n\n";
    } else {
      markdown += "```" + `${language} file="${file.path}"\n${file.content}\n` + "```\n\n";
    }
  }
  
  // Handle node_modules
  if (syncOutput.nodeModules.length > 0) {
    markdown += `## Node Modules\n\n`;
    markdown += `The following node modules were detected in the repository:\n\n`;
    
    // Group by top-level package
    const topLevelPackages = new Set();
    for (const file of syncOutput.nodeModules) {
      const parts = file.path.split('/');
      if (parts.length > 1 && parts[0] === 'node_modules') {
        topLevelPackages.add(parts[1]);
      }
    }
    
    markdown += `\`\`\`json\n${JSON.stringify([...topLevelPackages], null, 2)}\n\`\`\`\n\n`;
    markdown += `To install these packages, run:\n\n`;
    markdown += `\`\`\`bash\nnpm install ${[...topLevelPackages].join(' ')}\n\`\`\`\n\n`;
  }
  
  // Close CodeProject block
  markdown += `</CodeProject>\n`;
  
  // Add instructions for binary files
  if (syncOutput.binaryFiles.length > 0) {
    markdown += `\n## Binary Files\n\n`;
    markdown += `The following binary files need to be uploaded separately:\n\n`;
    
    for (const file of syncOutput.binaryFiles) {
      markdown += `- \`${file.path}\`\n`;
    }
    
    markdown += `\nTo include these files in v0 chat:\n`;
    markdown += `1. Upload each file to v0 chat\n`;
    markdown += `2. Get the blob URL for each file\n`;
    markdown += `3. Replace the placeholder in the code blocks above with the actual blob URLs\n`;
  }
  
  // Add instructions for large files
  if (syncOutput.largeFiles.length > 0) {
    markdown += `\n## Large Files\n\n`;
    markdown += `The following files are larger than ${CONFIG.largeFileThreshold / 1024}KB and may need special handling:\n\n`;
    
    for (const file of syncOutput.largeFiles) {
      markdown += `- \`${file.path}\` (${Math.round(file.size / 1024)}KB)\n`;
    }
  }
  
  return markdown;
}

// Map file extensions to languages for code blocks
function getLanguageForExtension(extension) {
  const languageMap = {
    'js': 'javascript',
    'jsx': 'jsx',
    'ts': 'typescript',
    'tsx': 'tsx',
    'json': 'json',
    'md': 'markdown',
    'css': 'css',
    'scss': 'scss',
    'html': 'html',
    'yml': 'yaml',
    'yaml': 'yaml',
    'sh': 'bash',
    'bash': 'bash',
    'py': 'python',
    'rb': 'ruby',
    'java': 'java',
    'c': 'c',
    'cpp': 'cpp',
    'cs': 'csharp',
    'go': 'go',
    'rs': 'rust',
    'php': 'php',
    'swift': 'swift',
    'kt': 'kotlin',
    'dart': 'dart',
    'sql': 'sql',
    'graphql': 'graphql',
    'xml': 'xml',
    'dockerfile': 'dockerfile',
    'gitignore': 'gitignore',
    'env': 'env',
  };
  
  return languageMap[extension] || extension || 'text';
}

// Run the script
syncRepositoryToV0().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
