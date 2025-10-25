import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [familyName, setFamilyName] = useState("");
  const [passkey, setPasskey] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simple local authentication for MVP
      const storedFamilies = JSON.parse(localStorage.getItem("families") || "{}");

      if (isLogin) {
        // Login flow
        if (storedFamilies[familyName] && storedFamilies[familyName].passkey === passkey) {
          localStorage.setItem("currentFamily", familyName);
          toast({
            title: "Welcome back!",
            description: `Logged in to ${familyName} family`,
          });
          navigate("/dashboard");
        } else {
          toast({
            title: "Authentication failed",
            description: "Invalid family name or passkey",
            variant: "destructive",
          });
        }
      } else {
        // Signup flow
        if (storedFamilies[familyName]) {
          toast({
            title: "Family exists",
            description: "This family name is already registered. Please login instead.",
            variant: "destructive",
          });
        } else {
          storedFamilies[familyName] = {
            passkey,
            createdAt: new Date().toISOString(),
            members: [],
            adminId: null,
          };
          localStorage.setItem("families", JSON.stringify(storedFamilies));
          localStorage.setItem("currentFamily", familyName);
          toast({
            title: "Family created!",
            description: `Welcome to ${familyName} family tree`,
          });
          navigate("/dashboard");
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle p-4">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNjMjY5NGYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2djRoNHYtNGgtNHptMCA4djRoNHYtNGgtNHptLTggMHY0aDR2LTRoLTR6bS04IDB2NGg0di00aC00em0wIDh2NGg0di00aC00em04IDB2NGg0di00aC00em04IDB2NGg0di00aC00em0wIDh2NGg0di00aC00em0tOCAwdjRoNHYtNGgtNHptLTggMHY0aDR2LTRoLTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40"></div>
      
      <Card className="w-full max-w-md shadow-heritage animate-fade-in-up relative">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-heritage flex items-center justify-center shadow-soft">
              <svg className="w-10 h-10 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <CardTitle className="text-3xl font-serif">Vanshavali</CardTitle>
          <CardDescription className="text-base">
            {isLogin ? "Welcome back to your family tree" : "Create your family legacy"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="familyName">Family Name</Label>
              <Input
                id="familyName"
                placeholder="Kumar Family, Singh Parivaar..."
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                required
                className="border-border focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="passkey">Family Passkey</Label>
              <Input
                id="passkey"
                type="password"
                placeholder="Shared family password"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                required
                className="border-border focus:ring-primary"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-heritage hover:opacity-90 transition-opacity shadow-soft"
              disabled={loading}
            >
              {loading ? "Please wait..." : isLogin ? "Enter Family Tree" : "Create Family"}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {isLogin ? "Need to create a new family? Sign up" : "Already have a family? Login"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
