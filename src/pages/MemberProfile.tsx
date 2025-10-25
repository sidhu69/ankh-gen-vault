import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, User, Calendar, Heart } from "lucide-react";

interface Member {
  id: string;
  fullName: string;
  birthDate: string;
  deathDate: string;
  gender: string;
  biography: string;
  photoUrl: string;
}

const MemberProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState<Member | null>(null);

  useEffect(() => {
    const currentFamily = localStorage.getItem("currentFamily");
    if (!currentFamily) {
      navigate("/auth");
      return;
    }

    const families = JSON.parse(localStorage.getItem("families") || "{}");
    const members = families[currentFamily]?.members || [];
    const foundMember = members.find((m: Member) => m.id === id);
    
    if (foundMember) {
      setMember(foundMember);
    } else {
      navigate("/members");
    }
  }, [id, navigate]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
  };

  const calculateAge = (birthDate: string, deathDate?: string) => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const end = deathDate ? new Date(deathDate) : new Date();
    const age = end.getFullYear() - birth.getFullYear();
    return age;
  };

  if (!member) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const age = calculateAge(member.birthDate, member.deathDate);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="bg-card border-b border-border shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/members")}
            className="mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Members
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Profile Header */}
        <Card className="shadow-heritage mb-6 animate-fade-in">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary shadow-soft flex-shrink-0">
                {member.photoUrl ? (
                  <img src={member.photoUrl} alt={member.fullName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-heritage flex items-center justify-center">
                    <User className="w-16 h-16 text-primary-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-serif font-bold mb-2">{member.fullName}</h1>
                <p className="text-muted-foreground capitalize mb-4">{member.gender}</p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  {member.birthDate && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span>Born {formatDate(member.birthDate)}</span>
                    </div>
                  )}
                  {member.deathDate && (
                    <div className="flex items-center gap-2 text-sm">
                      <Heart className="w-4 h-4 text-destructive" />
                      <span>Died {formatDate(member.deathDate)}</span>
                    </div>
                  )}
                  {age && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">{member.deathDate ? `Lived ${age} years` : `${age} years old`}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Biography */}
        {member.biography && (
          <Card className="shadow-soft animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <CardHeader>
              <CardTitle>Life Story</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground whitespace-pre-wrap leading-relaxed">{member.biography}</p>
            </CardContent>
          </Card>
        )}

        {/* Placeholder for future features */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="shadow-soft border-dashed animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <CardContent className="p-6 text-center text-muted-foreground">
              <p className="text-sm">Stories & Memories</p>
              <p className="text-xs mt-1">Coming soon</p>
            </CardContent>
          </Card>
          <Card className="shadow-soft border-dashed animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <CardContent className="p-6 text-center text-muted-foreground">
              <p className="text-sm">Family Connections</p>
              <p className="text-xs mt-1">Coming soon</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default MemberProfile;
