
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Globe, Type, Upload } from "lucide-react";

interface AddContentTabsProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onUrlSubmit: (url: string) => void;
  onTextSubmit: (title: string, content: string) => void;
  isLoading: boolean;
}

export const AddContentTabs = ({ onFileUpload, onUrlSubmit, onTextSubmit, isLoading }: AddContentTabsProps) => {
  const [urlInput, setUrlInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [textTitle, setTextTitle] = useState('');

  const handlePDFButtonClick = () => {
    const fileInput = document.getElementById('pdf-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onUrlSubmit(urlInput);
      setUrlInput('');
    }
  };

  const handleTextSubmit = () => {
    if (textInput.trim() && textTitle.trim()) {
      onTextSubmit(textTitle, textInput);
      setTextInput('');
      setTextTitle('');
    }
  };

  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Type className="h-5 w-5 mr-2 text-purple-400" />
          Add Content
        </CardTitle>
        <CardDescription className="text-white/60">
          Upload documents, scrape websites, or add custom text
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pdf" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/10">
            <TabsTrigger value="pdf" className="data-[state=active]:bg-white/20">PDF</TabsTrigger>
            <TabsTrigger value="url" className="data-[state=active]:bg-white/20">URL</TabsTrigger>
            <TabsTrigger value="text" className="data-[state=active]:bg-white/20">Text</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pdf" className="space-y-4">
            <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-white/40 transition-colors">
              <FileText className="h-8 w-8 text-white/40 mx-auto mb-2" />
              <p className="text-white/60 mb-4">Upload PDF documents</p>
              <input
                type="file"
                accept=".pdf"
                onChange={onFileUpload}
                className="hidden"
                id="pdf-upload"
              />
              <Button 
                onClick={handlePDFButtonClick}
                className="cursor-pointer bg-purple-600 hover:bg-purple-700" 
                disabled={isLoading}
              >
                <Upload className="h-4 w-4 mr-2" />
                {isLoading ? 'Uploading...' : 'Choose PDF File'}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="url" className="space-y-4">
            <div className="space-y-3">
              <Input
                placeholder="https://example.com"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
              />
              <Button 
                onClick={handleUrlSubmit}
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={!urlInput.trim() || isLoading}
              >
                <Globe className="h-4 w-4 mr-2" />
                {isLoading ? 'Adding...' : 'Scrape Website'}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="text" className="space-y-4">
            <div className="space-y-3">
              <Input
                placeholder="Content title..."
                value={textTitle}
                onChange={(e) => setTextTitle(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
              />
              <Textarea
                placeholder="Enter your custom text content..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40 min-h-[120px]"
              />
              <Button 
                onClick={handleTextSubmit}
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={!textInput.trim() || !textTitle.trim() || isLoading}
              >
                <Type className="h-4 w-4 mr-2" />
                {isLoading ? 'Adding...' : 'Add Text'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
