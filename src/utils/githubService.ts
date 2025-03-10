
/**
 * GitHub API service for fetching repository contents
 */

// Base URL for GitHub API
const API_BASE_URL = "https://api.github.com";

// Parse GitHub URL to extract owner, repo, and path
export const parseGitHubUrl = (url: string) => {
  try {
    // Remove trailing slash if present
    url = url.endsWith("/") ? url.slice(0, -1) : url;
    
    // Handle git extension
    if (url.endsWith(".git")) {
      url = url.slice(0, -4);
    }
    
    // Extract parts from URL
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/").filter(Boolean);
    
    if (pathParts.length < 2) {
      throw new Error("Invalid GitHub URL format");
    }
    
    const owner = pathParts[0];
    const repo = pathParts[1];
    const path = pathParts.slice(2).join("/");
    const branch = "main"; // Default to main branch
    
    return { owner, repo, path, branch };
  } catch (error) {
    console.error("Error parsing GitHub URL:", error);
    throw new Error("Invalid GitHub URL");
  }
};

// Fetch repository contents
export const fetchRepoContents = async (owner: string, repo: string, path: string = "", branch: string = "main") => {
  try {
    const url = path
      ? `${API_BASE_URL}/repos/${owner}/${repo}/contents/${path}?ref=${branch}`
      : `${API_BASE_URL}/repos/${owner}/${repo}/contents?ref=${branch}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching repo contents:", error);
    throw error;
  }
};

// Fetch file content
export const fetchFileContent = async (url: string) => {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.status}`);
    }
    
    // Get content as text
    return await response.text();
  } catch (error) {
    console.error("Error fetching file content:", error);
    throw error;
  }
};

// Download file content
export const downloadFile = (filename: string, content: string) => {
  const element = document.createElement("a");
  const file = new Blob([content], { type: "text/plain" });
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};
