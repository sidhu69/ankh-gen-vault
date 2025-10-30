import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, User, Calendar, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="bg-card border-b border-border shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/dashboard")}
            className="mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-serif font-bold text-foreground">{familyName} Members</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {members.length === 0 ? (
          <Card className="shadow-soft text-center py-12 animate-fade-in">
            <CardContent>
              <User className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-medium mb-2">No members yet</h2>
              <p className="text-muted-foreground mb-6">Start building your family tree by adding your first member</p>
              <Button onClick={() => navigate("/add-member")} className="bg-gradient-heritage hover:opacity-90 transition-opacity shadow-soft">
                <Plus className="w-4 h-4 mr-2" />
                Add First Member
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member, index) => (
              <Card 
                key={member.id}
                className="shadow-soft hover:shadow-heritage transition-all cursor-pointer border-border hover:border-primary animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => navigate(`/member/${member.id}`)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary shadow-soft flex-shrink-0">
                      {member.photo_url ? (
                        <img src={member.photo_url} alt={member.full_name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-heritage flex items-center justify-center">
                          <User className="w-8 h-8 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">{member.full_name}</CardTitle>
                      {member.gender && (
                        <p className="text-sm text-muted-foreground capitalize">{member.gender}</p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {member.birth_date && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(member.birth_date)}</span>
                    </div>
                  )}
                  {member.biography && (
                    <p className="text-sm text-foreground line-clamp-3 mt-3">
                      {member.biography}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Members;
