import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { parseGitHubUrl, fetchRepoContents } from "@/utils/githubService";
import GitHubFileItem from "@/components/GitHubFileItem";
import FileViewer from "@/components/FileViewer";
import { toast } from "@/components/ui/use-toast";
import { Github } from "lucide-react";

const GitHubImport = () => {
  const [url, setUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [repoInfo, setRepoInfo] = useState<{ owner: string; repo: string; path: string; branch: string } | null>(null);
  const [contents, setContents] = useState<any[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<{ path: string; label: string }[]>([]);
  const [selectedFile, setSelectedFile] = useState<any | null>(null);
  
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };
  
  const handleImport = async () => {
    try {
      if (!url.trim()) {
        toast({
          title: "Error",
          description: "Please enter a GitHub URL",
          variant: "destructive",
        });
        return;
      }
      
      setIsLoading(true);
      const parsed = parseGitHubUrl(url);
      setRepoInfo(parsed);
      
      const contents = await fetchRepoContents(parsed.owner, parsed.repo, parsed.path, parsed.branch);
      setContents(Array.isArray(contents) ? contents : [contents]);
      
      // Set initial breadcrumb
      setBreadcrumbs([{ path: "", label: "Root" }]);
      
      if (parsed.path) {
        const pathParts = parsed.path.split("/");
        let currentPath = "";
        
        pathParts.forEach((part) => {
          currentPath += (currentPath ? "/" : "") + part;
          setBreadcrumbs((prev) => [...prev, { path: currentPath, label: part }]);
        });
      }
      
      toast({
        title: "Success",
        description: `Loaded repository: ${parsed.owner}/${parsed.repo}`,
      });
    } catch (error: any) {
      console.error("Import error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to import from GitHub",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSelectItem = async (item: any) => {
    if (item.type === "dir") {
      try {
        setIsLoading(true);
        const newContents = await fetchRepoContents(repoInfo!.owner, repoInfo!.repo, item.path, repoInfo!.branch);
        setContents(Array.isArray(newContents) ? newContents : [newContents]);
        
        // Update breadcrumbs
        setBreadcrumbs((prev) => [...prev, { path: item.path, label: item.name }]);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to open directory",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      setSelectedFile(item);
    }
  };
  
  const navigateToBreadcrumb = async (breadcrumb: { path: string; label: string }) => {
    try {
      setIsLoading(true);
      const path = breadcrumb.path;
      const newContents = await fetchRepoContents(repoInfo!.owner, repoInfo!.repo, path, repoInfo!.branch);
      setContents(Array.isArray(newContents) ? newContents : [newContents]);
      
      // Trim breadcrumbs
      const index = breadcrumbs.findIndex((b) => b.path === breadcrumb.path);
      if (index >= 0) {
        setBreadcrumbs(breadcrumbs.slice(0, index + 1));
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to navigate",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-center mb-8">
        <div className="flex gap-2 items-center">
          <Github className="h-6 w-6" />
          <h1 className="text-3xl font-bold">GitHub Import</h1>
        </div>
      </div>
      
      <div className="flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            placeholder="Enter GitHub repository URL"
            value={url}
            onChange={handleUrlChange}
            className="flex-grow"
          />
          <Button 
            onClick={handleImport} 
            disabled={isLoading || !url.trim()}
            className="whitespace-nowrap"
          >
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⌛</span>
                Importing...
              </>
            ) : (
              "Import Repository"
            )}
          </Button>
        </div>
        
        {repoInfo && (
          <div className="mt-4">
            <div className="mb-4 text-sm">
              <div className="font-semibold">Repository: {repoInfo.owner}/{repoInfo.repo}</div>
              <div>Branch: {repoInfo.branch}</div>
            </div>
            
            {/* Breadcrumbs */}
            <div className="flex flex-wrap gap-1 items-center mb-4">
              {breadcrumbs.map((breadcrumb, index) => (
                <React.Fragment key={breadcrumb.path}>
                  {index > 0 && <span className="text-gray-400">/</span>}
                  <button
                    onClick={() => navigateToBreadcrumb(breadcrumb)}
                    className="text-blue-500 hover:underline text-sm px-1"
                  >
                    {breadcrumb.label}
                  </button>
                </React.Fragment>
              ))}
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : contents.length > 0 ? (
              <div className="grid gap-2">
                {contents.map((item) => (
                  <GitHubFileItem 
                    key={item.path} 
                    item={item} 
                    onSelect={handleSelectItem} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No files found in this directory.
              </div>
            )}
          </div>
        )}
        
        {selectedFile && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-4xl">
              <FileViewer 
                file={selectedFile} 
                onClose={() => setSelectedFile(null)} 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GitHubImport;
