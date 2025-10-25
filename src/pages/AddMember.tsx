import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Upload } from "lucide-react";

const AddMember = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: "",
    birthDate: "",
    deathDate: "",
    gender: "",
    biography: "",
    photoUrl: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const currentFamily = localStorage.getItem("currentFamily");
    if (!currentFamily) {
      navigate("/auth");
      return;
    }

    const families = JSON.parse(localStorage.getItem("families") || "{}");
    const newMember = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString(),
      stories: [],
      photos: [],
    };

    if (!families[currentFamily].members) {
      families[currentFamily].members = [];
    }
    families[currentFamily].members.push(newMember);
    
    localStorage.setItem("families", JSON.stringify(families));
    
    toast({
      title: "Member added!",
      description: `${formData.fullName} has been added to your family tree`,
    });
    
    navigate("/members");
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
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
          <h1 className="text-2xl font-serif font-bold text-foreground">Add Family Member</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="shadow-heritage animate-fade-in-up">
          <CardHeader>
            <CardTitle>Member Information</CardTitle>
            <CardDescription>Fill in the details to add a new member to your family tree</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Photo Upload */}
              <div className="space-y-2">
                <Label>Profile Photo</Label>
                <div className="flex items-center gap-4">
                  {formData.photoUrl && (
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary shadow-soft">
                      <img src={formData.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1">
                    <label htmlFor="photo-upload" className="cursor-pointer">
                      <div className="border-2 border-dashed border-border rounded-lg p-4 hover:border-primary transition-colors text-center">
                        <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Click to upload photo</p>
                      </div>
                      <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  placeholder="Rajesh Kumar Singh"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Birth Date */}
              <div className="space-y-2">
                <Label htmlFor="birthDate">Birth Date</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                />
              </div>

              {/* Death Date */}
              <div className="space-y-2">
                <Label htmlFor="deathDate">Death Date (if applicable)</Label>
                <Input
                  id="deathDate"
                  type="date"
                  value={formData.deathDate}
                  onChange={(e) => setFormData({ ...formData, deathDate: e.target.value })}
                />
              </div>

              {/* Biography */}
              <div className="space-y-2">
                <Label htmlFor="biography">Biography / Life Story</Label>
                <Textarea
                  id="biography"
                  placeholder="Share their story, achievements, personality, and memories..."
                  value={formData.biography}
                  onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
                  rows={6}
                  className="resize-none"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-heritage hover:opacity-90 transition-opacity shadow-soft"
              >
                Add to Family Tree
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AddMember;
