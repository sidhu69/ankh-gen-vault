import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Users, BookOpen, LogOut, TreePine } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const [familyName, setFamilyName] = useState("");
  const [memberCount, setMemberCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      try {
        const { data: families, error } = await supabase
          .from("families")
          .select("name, id")
          .eq("created_by", user.id)
          .single();

        if (error) throw error;

        if (families) {
          setFamilyName(families.name);
          
          const { count } = await supabase
            .from("family_members")
            .select("*", { count: "exact", head: true })
            .eq("family_id", families.id);

          setMemberCount(count || 0);
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [navigate, toast]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "Come back soon!",
    });
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-soft">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-serif font-bold text-foreground">{familyName}</h1>
            <p className="text-sm text-muted-foreground">Family Tree Dashboard</p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="border-border hover:bg-muted"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Family Tree Card */}
          <Card 
            className="shadow-soft hover:shadow-heritage transition-all cursor-pointer border-border hover:border-primary animate-fade-in"
            onClick={() => navigate("/tree")}
          >
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-gradient-heritage flex items-center justify-center mb-2">
                <TreePine className="w-6 h-6 text-primary-foreground" />
              </div>
              <CardTitle className="text-xl">Family Tree</CardTitle>
              <CardDescription>Visualize your lineage</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">{memberCount} Members</p>
              <p className="text-sm text-muted-foreground mt-1">Click to explore</p>
            </CardContent>
          </Card>

          {/* Add Member Card */}
          <Card 
            className="shadow-soft hover:shadow-heritage transition-all cursor-pointer border-border hover:border-secondary animate-fade-in"
            style={{ animationDelay: "0.1s" }}
            onClick={() => navigate("/add-member")}
          >
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-gradient-gold flex items-center justify-center mb-2">
                <Plus className="w-6 h-6 text-secondary-foreground" />
              </div>
              <CardTitle className="text-xl">Add Member</CardTitle>
              <CardDescription>Expand your family tree</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Add photos, stories, and connections</p>
            </CardContent>
          </Card>

          {/* View Members Card */}
          <Card 
            className="shadow-soft hover:shadow-heritage transition-all cursor-pointer border-border hover:border-accent animate-fade-in"
            style={{ animationDelay: "0.2s" }}
            onClick={() => navigate("/members")}
          >
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-accent-foreground" />
              </div>
              <CardTitle className="text-xl">All Members</CardTitle>
              <CardDescription>Browse family profiles</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">View stories, photos, and memories</p>
            </CardContent>
          </Card>
        </div>

        {/* Welcome Section */}
        <Card className="shadow-soft border-border animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Getting Started
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
              <div>
                <h4 className="font-medium">Add Family Members</h4>
                <p className="text-sm text-muted-foreground">Start by adding your parents, grandparents, or yourself</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
              <div>
                <h4 className="font-medium">Create Relationships</h4>
                <p className="text-sm text-muted-foreground">Connect family members to build your tree</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
              <div>
                <h4 className="font-medium">Add Stories & Photos</h4>
                <p className="text-sm text-muted-foreground">Preserve memories with photos and biographical stories</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
