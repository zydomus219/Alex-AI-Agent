
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const Actions = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Actions</h1>
          <p className="text-white/60">Automate tasks and workflows with custom actions</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          New Action
        </Button>
      </div>

      <div className="grid gap-6">
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Zap className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <CardTitle className="text-white">Coming Soon</CardTitle>
                <CardDescription className="text-white/60">
                  Actions feature is under development
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-white/80">
              This feature will allow you to create automated workflows and actions for your AI agents.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Actions;
