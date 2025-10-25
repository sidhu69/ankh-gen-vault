import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TreePine, Users, BookOpen, Heart } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const currentFamily = localStorage.getItem("currentFamily");
    if (currentFamily) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-heritage flex items-center justify-center shadow-heritage animate-float">
              <TreePine className="w-12 h-12 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 text-foreground">
            Vanshavali
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-4">
            वंशावली - Your Family's Legacy, Preserved Forever
          </p>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Record your family lineage, share stories, preserve memories, and connect generations 
            in a beautiful, private space for your family.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button 
              size="lg"
              onClick={() => navigate("/auth")}
              className="bg-gradient-heritage hover:opacity-90 transition-opacity shadow-heritage text-lg px-8"
            >
              Start Your Family Tree
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => navigate("/auth")}
              className="border-2 border-primary hover:bg-primary/10 text-lg px-8"
            >
              Login to Family
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-serif font-bold text-center mb-12">
          Preserve Your Heritage
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="w-16 h-16 rounded-full bg-gradient-heritage flex items-center justify-center mx-auto mb-4 shadow-soft">
              <Users className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Family Tree</h3>
            <p className="text-muted-foreground">
              Visualize your family connections across generations with an intuitive tree view
            </p>
          </div>
          
          <div className="text-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="w-16 h-16 rounded-full bg-gradient-gold flex items-center justify-center mx-auto mb-4 shadow-soft">
              <BookOpen className="w-8 h-8 text-secondary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Stories & Memories</h3>
            <p className="text-muted-foreground">
              Write biographies, share stories, and upload photos to keep memories alive
            </p>
          </div>
          
          <div className="text-center animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-4 shadow-soft">
              <Heart className="w-8 h-8 text-accent-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Private & Secure</h3>
            <p className="text-muted-foreground">
              Your family data stays private, accessible only to family members with the passkey
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 mb-16">
        <div className="max-w-3xl mx-auto bg-card border border-border rounded-2xl p-8 md:p-12 shadow-heritage text-center animate-fade-in-up">
          <h2 className="text-3xl font-serif font-bold mb-4">
            Start Building Your Legacy Today
          </h2>
          <p className="text-muted-foreground mb-6">
            Create a lasting tribute to your family's history. Add members, share stories, 
            and preserve your heritage for future generations.
          </p>
          <Button 
            size="lg"
            onClick={() => navigate("/auth")}
            className="bg-gradient-heritage hover:opacity-90 transition-opacity shadow-soft text-lg px-8"
          >
            Create Family Tree - It's Free
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
