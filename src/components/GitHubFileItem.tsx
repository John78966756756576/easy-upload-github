
import React from "react";
import { FileText, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GitHubFileItemProps {
  item: {
    name: string;
    path: string;
    type: string;
    download_url?: string;
    html_url?: string;
  };
  onSelect: (item: any) => void;
}

const GitHubFileItem: React.FC<GitHubFileItemProps> = ({ item, onSelect }) => {
  const isDirectory = item.type === "dir";
  
  return (
    <div className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-100">
      <div className="flex items-center gap-2">
        {isDirectory ? (
          <Folder className="h-5 w-5 text-blue-500" />
        ) : (
          <FileText className="h-5 w-5 text-gray-500" />
        )}
        <span className="font-medium">{item.name}</span>
      </div>
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => onSelect(item)}
      >
        {isDirectory ? "Open" : "View"}
      </Button>
    </div>
  );
};

export default GitHubFileItem;
