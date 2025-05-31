
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center max-w-lg p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-4xl font-bold mb-4">GitHub File Explorer</h1>
        <p className="text-xl text-gray-600 mb-8">
          Easily explore GitHub repositories, view and download files directly from your browser.
        </p>
        
        <Link to="/github-import">
          <Button size="lg" className="gap-2">
            <Github className="h-5 w-5" />
            Start Importing Files
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;
