import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, User } from "lucide-react";

interface Member {
  id: string;
  fullName: string;
  birthDate: string;
  deathDate: string;
  gender: string;
  biography: string;
  photoUrl: string;
}

const Members = () => {
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

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
  };

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
          <p className="text-sm text-muted-foreground">All family members ({members.length})</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {members.length === 0 ? (
          <Card className="shadow-soft text-center py-12 animate-fade-in">
            <CardContent>
              <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No members yet</h3>
              <p className="text-muted-foreground mb-4">Start building your family tree by adding members</p>
              <Button onClick={() => navigate("/add-member")} className="bg-gradient-heritage">
                Add First Member
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member, index) => (
              <Card 
                key={member.id} 
                className="shadow-soft hover:shadow-heritage transition-all cursor-pointer border-border animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => navigate(`/member/${member.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-primary shadow-soft flex-shrink-0">
                      {member.photoUrl ? (
                        <img src={member.photoUrl} alt={member.fullName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-heritage flex items-center justify-center">
                          <User className="w-8 h-8 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate">{member.fullName}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{member.gender}</p>
                      {member.birthDate && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Born: {formatDate(member.birthDate)}
                        </p>
                      )}
                      {member.deathDate && (
                        <p className="text-sm text-muted-foreground">
                          Died: {formatDate(member.deathDate)}
                        </p>
                      )}
                    </div>
                  </div>
                  {member.biography && (
                    <p className="text-sm text-muted-foreground mt-4 line-clamp-3">
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
