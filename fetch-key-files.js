const OWNER = 'swingit-solutions';
const REPO = 'backoffice';

// List of important files to fetch based on the repository structure
const filesToFetch = [
  'package.json',
  'next.config.js',
  'tsconfig.json',
  'tailwind.config.js',
  'app/layout.tsx',
  'app/page.tsx',
  'components/header.tsx',
  'components/sidebar.tsx',
  'lib/supabase.ts',
  'lib/utils.ts',
  'components/supabase-provider.tsx',
  'components/auth-provider.tsx',
  'components/ui/button.tsx',
  'components/ui/card.tsx'
];

async function fetchFileContent(path) {
  try {
    const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`;
    
    console.log(`Fetching: ${path}`);
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    if (!response.ok) {
      console.log(`Status: ${response.status} for ${path}`);
      if (response.status === 404) {
        console.log(`File not found: ${path}`);
        return null;
      }
      throw new Error(`GitHub API error: ${response.status} - ${await response.text()}`);
    }
    
    const data = await response.json();
    
    // GitHub API returns content as base64 encoded
    if (data.content) {
      const content = Buffer.from(data.content, 'base64').toString('utf-8');
      console.log(`\n--- ${path} ---\n`);
      console.log(content.substring(0, 500) + (content.length > 500 ? '...' : ''));
      return content;
    } else {
      console.log(`No content found for ${path}`);
      return null;
    }
    
  } catch (error) {
    console.error(`Error fetching ${path}:`, error.message);
    return null;
  }
}

async function fetchDirectoryContents(path) {
  try {
    const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`;
    
    console.log(`Fetching directory: ${path}`);
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    if (!response.ok) {
      console.log(`Status: ${response.status} for directory ${path}`);
      return [];
    }
    
    const data = await response.json();
    
    if (Array.isArray(data)) {
      console.log(`\n--- Directory: ${path} ---\n`);
      data.forEach(item => {
        console.log(`${item.type}: ${item.name}`);
      });
      return data;
    } else {
      console.log(`Not a directory: ${path}`);
      return [];
    }
    
  } catch (error) {
    console.error(`Error fetching directory ${path}:`, error.message);
    return [];
  }
}

async function main() {
  // First, let's check the root directory structure
  await fetchDirectoryContents('');
  
  // Then fetch important directories
  const importantDirs = ['app', 'components', 'lib'];
  for (const dir of importantDirs) {
    await fetchDirectoryContents(dir);
  }
  
  // Finally fetch specific files
  for (const file of filesToFetch) {
    await fetchFileContent(file);
  }
}

main();
