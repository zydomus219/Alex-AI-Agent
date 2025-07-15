
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Database, MessageSquare, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect authenticated users to dashboard
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
      
      <div className="relative">
        {/* Navigation */}
        <nav className="border-b border-white/10 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-2">
                <Brain className="h-8 w-8 text-purple-400" />
                <span className="text-xl font-bold text-white">ALEXAI</span>
              </div>
              <div className="flex space-x-4">
                <Link to="/auth">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Sparkles className="h-16 w-16 text-purple-400 animate-pulse" />
                <div className="absolute inset-0 h-16 w-16 bg-purple-400/20 rounded-full blur-xl"></div>
              </div>
            </div>
            <h1 className="text-5xl font-bold text-white mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              Build Your Custom AI Agent
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto mb-8">
              Create intelligent AI agents with your own knowledge base. Upload PDFs, scrape websites, 
              add custom text, and train personalized models for enhanced conversations.
            </p>
            <Link to="/auth">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                    <Database className="h-6 w-6 text-purple-400" />
                  </div>
                  <CardTitle className="text-white">Knowledge Base</CardTitle>
                </div>
                <CardDescription className="text-white/60">
                  Upload PDFs, scrape websites, and add custom text to build your AI's knowledge foundation
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                    <MessageSquare className="h-6 w-6 text-blue-400" />
                  </div>
                  <CardTitle className="text-white">AI Chat</CardTitle>
                </div>
                <CardDescription className="text-white/60">
                  Chat with your custom-trained AI agent powered by your knowledge base
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Process Steps */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-8">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                  1
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Add Knowledge</h3>
                <p className="text-white/60">Upload documents, scrape websites, or add custom text</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                  2
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Train Model</h3>
                <p className="text-white/60">Fine-tune your AI model with the knowledge base</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                  3
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Chat & Deploy</h3>
                <p className="text-white/60">Interact with your custom AI agent</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
