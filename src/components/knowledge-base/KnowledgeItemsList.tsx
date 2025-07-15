
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  Globe, 
  Type, 
  Trash2, 
  Eye,
  Database,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import type { Tables } from '@/integrations/supabase/types';

type KnowledgeItem = Tables<'knowledge_items'>;

interface KnowledgeItemsListProps {
  knowledgeItems: KnowledgeItem[];
  isLoading: boolean;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export const KnowledgeItemsList = ({ knowledgeItems, isLoading, onDelete, isDeleting }: KnowledgeItemsListProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-yellow-400 animate-spin" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-400" />;
      case 'url':
        return <Globe className="h-5 w-5 text-blue-400" />;
      case 'text':
        return <Type className="h-5 w-5 text-green-400" />;
      default:
        return <FileText className="h-5 w-5 text-gray-400" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">Knowledge Items</CardTitle>
        <CardDescription className="text-white/60">
          Manage your uploaded content and training data
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-white/20 mx-auto mb-4 animate-spin" />
            <p className="text-white/60">Loading knowledge items...</p>
          </div>
        ) : knowledgeItems.length === 0 ? (
          <div className="text-center py-8">
            <Database className="h-12 w-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/60">No knowledge items yet. Start by adding some content!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {knowledgeItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  {getTypeIcon(item.type)}
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-white font-medium">{item.title}</h3>
                      {getStatusIcon(item.status)}
                    </div>
                    <p className="text-white/60 text-sm">
                      {item.type === 'url' && item.url}
                      {item.type === 'pdf' && `PDF • ${item.file_name}`}
                      {item.type === 'text' && 'Custom Text'}
                      <span className="ml-2">• {formatDate(item.created_at)}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white/60 hover:text-white hover:bg-white/10"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(item.id)}
                    disabled={isDeleting}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
