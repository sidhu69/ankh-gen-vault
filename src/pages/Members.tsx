import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Calendar, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Layout } from "@/components/Layout";
import { Skeleton } from "@/components/ui/skeleton";

interface Member {
  id: string;
  full_name: string;
  birth_date: string | null;
  death_date: string | null;
  gender: string | null;
  biography: string | null;
  photo_url: string | null;
}

const Members = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [familyName, setFamilyName] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchMembers = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      try {
        const { data: family, error: familyError } = await supabase
          .from("families")
          .select("id, name")
          .eq("created_by", user.id)
          .single();

        if (familyError) throw familyError;

        if (family) {
          setFamilyName(family.name);

          const { data: membersData, error: membersError } = await supabase
            .from("family_members")
            .select("*")
            .eq("family_id", family.id)
            .order("created_at", { ascending: false });

          if (membersError) throw membersError;

          setMembers(membersData || []);
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

    fetchMembers();
  }, [navigate, toast]);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 space-y-6">
          <div className="space-y-2 animate-fade-in">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <Skeleton className="w-20 h-20 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
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
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="text-3xl font-serif font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {familyName} Members
            </h1>
            <p className="text-muted-foreground mt-1">
              {members.length} {members.length === 1 ? 'member' : 'members'} in your family tree
            </p>
          </div>
          <Button 
            onClick={() => navigate("/add-member")} 
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Member
          </Button>
        </div>

        {members.length === 0 ? (
          <Card className="shadow-lg text-center py-16 animate-fade-in border-dashed">
            <CardContent>
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-6">
                <User className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">No members yet</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Start building your family tree by adding your first member. Preserve their stories and memories for generations to come.
              </p>
              <Button 
                onClick={() => navigate("/add-member")} 
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity shadow-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add First Member
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member, index) => (
              <Card 
                key={member.id}
                className="group relative overflow-hidden cursor-pointer border-border hover:border-primary transition-all duration-300 animate-fade-in hover:scale-105 shadow-lg"
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => navigate(`/member/${member.id}`)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="pb-4 relative">
                  <div className="flex items-start gap-4">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-primary shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform">
                      {member.photo_url ? (
                        <img src={member.photo_url} alt={member.full_name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                          <User className="w-10 h-10 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate group-hover:text-primary transition-colors">
                        {member.full_name}
                      </CardTitle>
                      {member.gender && (
                        <p className="text-sm text-muted-foreground capitalize mt-1">
                          {member.gender}
                        </p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 relative space-y-3">
                  {member.birth_date && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span>{formatDate(member.birth_date)}</span>
                    </div>
                  )}
                  {member.biography && (
                    <p className="text-sm text-foreground/80 line-clamp-2">
                      {member.biography}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Members;
