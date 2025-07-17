
import { useState, useRef } from 'react';
import { Upload, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AgentAvatarUploadProps {
  avatarUrl?: string;
  onAvatarChange: (url: string | null) => void;
  agentName: string;
}

export const AgentAvatarUpload = ({ avatarUrl, onAvatarChange, agentName }: AgentAvatarUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File size must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `agent-avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('knowledge-files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('knowledge-files')
        .getPublicUrl(filePath);

      onAvatarChange(data.publicUrl);
      
      toast({
        title: "Success",
        description: "Avatar uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Error",
        description: "Failed to upload avatar",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!avatarUrl) return;

    try {
      // Extract file path from URL
      const url = new URL(avatarUrl);
      const pathParts = url.pathname.split('/');
      const filePath = pathParts.slice(-2).join('/'); // Get last two parts (folder/filename)

      const { error } = await supabase.storage
        .from('knowledge-files')
        .remove([filePath]);

      if (error) throw error;

      onAvatarChange(null);
      
      toast({
        title: "Success",
        description: "Avatar removed successfully",
      });
    } catch (error) {
      console.error('Error removing avatar:', error);
      toast({
        title: "Error",
        description: "Failed to remove avatar",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Avatar className="w-16 h-16">
        {avatarUrl ? (
          <AvatarImage src={avatarUrl} alt={agentName} />
        ) : (
          <AvatarFallback>
            <User className="w-6 h-6" />
          </AvatarFallback>
        )}
      </Avatar>
      
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="gap-2"
        >
          <Upload className="w-4 h-4" />
          {uploading ? 'Uploading...' : avatarUrl ? 'Change' : 'Upload'}
        </Button>
        
        {avatarUrl && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRemoveAvatar}
            className="gap-2"
          >
            <X className="w-4 h-4" />
            Remove
          </Button>
        )}
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};
