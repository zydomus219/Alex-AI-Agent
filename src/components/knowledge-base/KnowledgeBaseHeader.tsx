
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Database, Brain } from "lucide-react";
import { Link } from "react-router-dom";

interface KnowledgeBaseHeaderProps {
  itemCount: number;
}

export const KnowledgeBaseHeader = ({ itemCount }: KnowledgeBaseHeaderProps) => {
  return (
    <nav className="border-b border-white/10 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Database className="h-6 w-6 text-purple-400" />
              <span className="text-lg font-semibold text-white">Knowledge Base</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-200 border-purple-500/30">
              {itemCount} items
            </Badge>
            <Link to="/chat">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Brain className="h-4 w-4 mr-2" />
                Train & Chat
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
