
import React, { useState, useEffect } from "react";
import { fetchFileContent, downloadFile } from "@/utils/githubService";
import { Button } from "@/components/ui/button";
import { Download, Copy, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface FileViewerProps {
  file: {
    name: string;
    path: string;
    download_url: string;
  };
  onClose: () => void;
}

const FileViewer: React.FC<FileViewerProps> = ({ file, onClose }) => {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getFileContent = async () => {
      try {
        setLoading(true);
        const fileContent = await fetchFileContent(file.download_url);
        setContent(fileContent);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to load file content");
        toast({
          title: "Error",
          description: "Failed to load file content",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    getFileContent();
  }, [file.download_url]);

  const handleDownload = () => {
    downloadFile(file.name, content);
    toast({
      title: "File downloaded",
      description: `${file.name} has been downloaded successfully`,
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied to clipboard",
      description: "File content has been copied to clipboard",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{file.name}</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handleCopy}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleDownload}>
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 p-4 border border-red-200 rounded-md">
          {error}
        </div>
      ) : (
        <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm max-h-[60vh]">
          {content}
        </pre>
      )}
    </div>
  );
};

export default FileViewer;
