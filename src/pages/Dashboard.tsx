import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Users, BookOpen, TreePine, TrendingUp, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { Skeleton } from "@/components/ui/skeleton";

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

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 space-y-8">
          <div className="space-y-2">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="w-12 h-12 rounded-full mb-2" />
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 p-8 border border-border/50 backdrop-blur-sm animate-fade-in">
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_70%)]" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <Heart className="w-8 h-8 text-primary animate-pulse" />
              <h1 className="text-4xl font-serif font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                {familyName}
              </h1>
            </div>
            <p className="text-lg text-muted-foreground">Preserving {memberCount} generations of memories</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card 
            className="group relative overflow-hidden cursor-pointer border-border hover:border-primary transition-all duration-300 animate-fade-in hover:scale-105"
            onClick={() => navigate("/tree")}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="relative">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg">
                <TreePine className="w-7 h-7 text-primary-foreground" />
              </div>
              <CardTitle className="text-xl">Family Tree</CardTitle>
              <CardDescription>Visualize your heritage</CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-primary">{memberCount}</p>
                <p className="text-sm text-muted-foreground">Members</p>
              </div>
              <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
                <TrendingUp className="w-3 h-3" />
                <span>Growing legacy</span>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="group relative overflow-hidden cursor-pointer border-border hover:border-secondary transition-all duration-300 animate-fade-in hover:scale-105"
            style={{ animationDelay: "0.1s" }}
            onClick={() => navigate("/add-member")}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="relative">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-secondary to-secondary/50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg">
                <Plus className="w-7 h-7 text-secondary-foreground" />
              </div>
              <CardTitle className="text-xl">Add Member</CardTitle>
              <CardDescription>Expand your tree</CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <p className="text-sm text-muted-foreground">
                Add photos, stories, and build lasting connections
              </p>
            </CardContent>
          </Card>

          <Card 
            className="group relative overflow-hidden cursor-pointer border-border hover:border-accent transition-all duration-300 animate-fade-in hover:scale-105"
            style={{ animationDelay: "0.2s" }}
            onClick={() => navigate("/members")}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="relative">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent to-accent/50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg">
                <Users className="w-7 h-7 text-accent-foreground" />
              </div>
              <CardTitle className="text-xl">All Members</CardTitle>
              <CardDescription>Browse profiles</CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <p className="text-sm text-muted-foreground">
                Explore stories, photos, and treasured memories
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Getting Started Guide */}
        <Card className="border-border shadow-lg animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle>Getting Started</CardTitle>
                <CardDescription>Build your family legacy in 3 simple steps</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2 p-4 rounded-lg bg-gradient-to-br from-primary/5 to-transparent border border-primary/20">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">1</div>
              <h4 className="font-semibold">Add Family Members</h4>
              <p className="text-sm text-muted-foreground">Start by adding your parents, grandparents, or yourself to begin building</p>
            </div>
            <div className="space-y-2 p-4 rounded-lg bg-gradient-to-br from-secondary/5 to-transparent border border-secondary/20">
              <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-sm font-bold">2</div>
              <h4 className="font-semibold">Create Relationships</h4>
              <p className="text-sm text-muted-foreground">Connect family members together to visualize your family tree structure</p>
            </div>
            <div className="space-y-2 p-4 rounded-lg bg-gradient-to-br from-accent/5 to-transparent border border-accent/20">
              <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-bold">3</div>
              <h4 className="font-semibold">Add Stories & Photos</h4>
              <p className="text-sm text-muted-foreground">Preserve precious memories with photos and biographical stories</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
