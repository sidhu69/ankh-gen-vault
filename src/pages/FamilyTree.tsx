import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, User } from "lucide-react";

interface Member {
  id: string;
  fullName: string;
  birthDate: string;
  gender: string;
  photoUrl: string;
}

const FamilyTree = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>([]);
  const [familyName, setFamilyName] = useState("");

  useEffect(() => {
    const currentFamily = localStorage.getItem("currentFamily");
    if (!currentFamily) {
      navigate("/auth");
      return;
    }

    setFamilyName(currentFamily);
    const families = JSON.parse(localStorage.getItem("families") || "{}");
    setMembers(families[currentFamily]?.members || []);
  }, [navigate]);

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
          <h1 className="text-2xl font-serif font-bold text-foreground">{familyName} Tree</h1>
          <p className="text-sm text-muted-foreground">Visual family tree (MVP - Basic view)</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
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
                      {member.photoUrl ? (
                        <img src={member.photoUrl} alt={member.fullName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-heritage flex items-center justify-center">
                          <User className="w-8 h-8 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-sm">{member.fullName}</p>
                      {member.birthDate && (
                        <p className="text-xs text-muted-foreground">
                          {new Date(member.birthDate).getFullYear()}
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
      </main>
    </div>
  );
};

export default FamilyTree;
