import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";

interface Member {
  id: string;
  full_name: string;
  birth_date: string | null;
  gender: string | null;
  photo_url: string | null;
}

const FamilyTree = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [members, setMembers] = useState<Member[]>([]);
  const [familyName, setFamilyName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
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

        setFamilyName(family.name);

        const { data: membersData, error: membersError } = await supabase
          .from("family_members")
          .select("*")
          .eq("family_id", family.id);

        if (membersError) throw membersError;
        setMembers(membersData || []);
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

    fetchData();
  }, [navigate, toast]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground">{familyName} Tree</h1>
            <p className="text-sm text-muted-foreground mt-1">Visual family tree (MVP - Basic view)</p>
          </div>
          <Button 
            variant="ghost" 
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        {members.length === 0 ? (
          <Card className="shadow-soft text-center py-12 animate-fade-in">
            <CardContent>
              <p className="text-muted-foreground mb-4">No members to display in tree view</p>
              <Button onClick={() => navigate("/add-member")} className="bg-gradient-heritage">
                Add First Member
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Simple horizontal tree layout for MVP */}
            <div className="flex flex-wrap justify-center gap-8 p-8 bg-card/50 rounded-lg border-2 border-dashed border-border">
              {members.map((member, index) => (
                <div 
                  key={member.id}
                  className="animate-fade-in cursor-pointer"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => navigate(`/member/${member.id}`)}
                >
                  <div className="flex flex-col items-center gap-2 p-4 bg-card rounded-lg shadow-soft hover:shadow-heritage transition-all">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-primary shadow-soft">
                      {member.photo_url ? (
                        <img src={member.photo_url} alt={member.full_name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-heritage flex items-center justify-center">
                          <User className="w-8 h-8 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-sm">{member.full_name}</p>
                      {member.birth_date && (
                        <p className="text-xs text-muted-foreground">
                          {new Date(member.birth_date).getFullYear()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Card className="shadow-soft bg-accent/10 border-accent">
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold mb-2">Advanced Tree View Coming Soon</h3>
                <p className="text-sm text-muted-foreground">
                  Future updates will include relationship connections, multi-generational layouts, 
                  and interactive tree navigation.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FamilyTree;
