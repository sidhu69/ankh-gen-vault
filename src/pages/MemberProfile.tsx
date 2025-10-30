import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, User, Calendar, Heart, Plus, Users, BookOpen } from "lucide-react";
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

type RelationType = 'father' | 'mother' | 'son' | 'daughter' | 'brother' | 'sister' | 'husband' | 'wife' | 'grandfather' | 'grandmother' | 'grandson' | 'granddaughter' | 'uncle' | 'aunt' | 'nephew' | 'niece' | 'cousin' | 'other';

interface Relation {
  id: string;
  related_member_id: string;
  relation_type: RelationType;
  notes: string | null;
  related_member: {
    full_name: string;
    photo_url: string | null;
  };
}

interface Story {
  id: string;
  title: string;
  story_text: string;
  story_date: string | null;
  created_at: string;
}

const MemberProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [member, setMember] = useState<Member | null>(null);
  const [relations, setRelations] = useState<Relation[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [allMembers, setAllMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState<'relation' | 'story' | null>(null);

  // Form states
  const [relationForm, setRelationForm] = useState({
    related_member_id: "",
    relation_type: "",
    notes: "",
  });

  const [storyForm, setStoryForm] = useState({
    title: "",
    story_text: "",
    story_date: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      try {
        // Get family
        const { data: family, error: familyError } = await supabase
          .from("families")
          .select("id")
          .eq("created_by", user.id)
          .single();

        if (familyError) throw familyError;

        // Get member
        const { data: memberData, error: memberError } = await supabase
          .from("family_members")
          .select("*")
          .eq("id", id)
          .eq("family_id", family.id)
          .single();

        if (memberError) throw memberError;
        setMember(memberData);

        // Get all members for relation dropdown
        const { data: membersData, error: membersError } = await supabase
          .from("family_members")
          .select("*")
          .eq("family_id", family.id)
          .neq("id", id);

        if (membersError) throw membersError;
        setAllMembers(membersData || []);

        // Get relations
        const { data: relationsData, error: relationsError } = await supabase
          .from("member_relations")
          .select(`
            id,
            related_member_id,
            relation_type,
            notes,
            related_member:family_members!member_relations_related_member_id_fkey(full_name, photo_url)
          `)
          .eq("member_id", id);

        if (relationsError) throw relationsError;
        setRelations(relationsData || []);

        // Get stories
        const { data: storiesData, error: storiesError } = await supabase
          .from("member_stories")
          .select("*")
          .eq("member_id", id)
          .order("story_date", { ascending: false });

        if (storiesError) throw storiesError;
        setStories(storiesData || []);

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
  }, [id, navigate, toast]);

  const handleAddRelation = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { error } = await supabase
        .from("member_relations")
        .insert([{
          member_id: id,
          related_member_id: relationForm.related_member_id,
          relation_type: relationForm.relation_type as RelationType,
          notes: relationForm.notes || null,
        }]);

      if (error) throw error;

      toast({
        title: "Relation added!",
        description: "Family connection created successfully",
      });

      setDialogOpen(null);
      setRelationForm({ related_member_id: "", relation_type: "", notes: "" });
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAddStory = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { error } = await supabase
        .from("member_stories")
        .insert([{
          member_id: id,
          title: storyForm.title,
          story_text: storyForm.story_text,
          story_date: storyForm.story_date || null,
        }]);

      if (error) throw error;

      toast({
        title: "Story added!",
        description: "Memory preserved successfully",
      });

      setDialogOpen(null);
      setStoryForm({ title: "", story_text: "", story_date: "" });
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
  };

  const calculateAge = (birthDate: string | null, deathDate: string | null) => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const end = deathDate ? new Date(deathDate) : new Date();
    const age = end.getFullYear() - birth.getFullYear();
    return age;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <p className="text-muted-foreground">Member not found</p>
      </div>
    );
  }

  const age = calculateAge(member.birth_date, member.death_date);

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
                {member.photo_url ? (
                  <img src={member.photo_url} alt={member.full_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-heritage flex items-center justify-center">
                    <User className="w-16 h-16 text-primary-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-serif font-bold mb-2">{member.full_name}</h1>
                {member.gender && <p className="text-muted-foreground capitalize mb-4">{member.gender}</p>}
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  {member.birth_date && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span>Born {formatDate(member.birth_date)}</span>
                    </div>
                  )}
                  {member.death_date && (
                    <div className="flex items-center gap-2 text-sm">
                      <Heart className="w-4 h-4 text-destructive" />
                      <span>Died {formatDate(member.death_date)}</span>
                    </div>
                  )}
                  {age && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">{member.death_date ? `Lived ${age} years` : `${age} years old`}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Biography */}
        {member.biography && (
          <Card className="shadow-soft animate-fade-in-up mb-6" style={{ animationDelay: "0.1s" }}>
            <CardHeader>
              <CardTitle>Life Story</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground whitespace-pre-wrap leading-relaxed">{member.biography}</p>
            </CardContent>
          </Card>
        )}

        {/* Relations */}
        <Card className="shadow-soft animate-fade-in-up mb-6" style={{ animationDelay: "0.2s" }}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Family Connections
            </CardTitle>
            <Dialog open={dialogOpen === 'relation'} onOpenChange={(open) => setDialogOpen(open ? 'relation' : null)}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Connection
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Family Connection</DialogTitle>
                  <DialogDescription>Create a relationship with another family member</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddRelation} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Family Member</Label>
                    <Select value={relationForm.related_member_id} onValueChange={(value) => setRelationForm({...relationForm, related_member_id: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select member" />
                      </SelectTrigger>
                      <SelectContent>
                        {allMembers.map((m) => (
                          <SelectItem key={m.id} value={m.id}>{m.full_name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Relationship Type</Label>
                    <Select value={relationForm.relation_type} onValueChange={(value) => setRelationForm({...relationForm, relation_type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="father">Father</SelectItem>
                        <SelectItem value="mother">Mother</SelectItem>
                        <SelectItem value="son">Son</SelectItem>
                        <SelectItem value="daughter">Daughter</SelectItem>
                        <SelectItem value="brother">Brother</SelectItem>
                        <SelectItem value="sister">Sister</SelectItem>
                        <SelectItem value="husband">Husband</SelectItem>
                        <SelectItem value="wife">Wife</SelectItem>
                        <SelectItem value="grandfather">Grandfather</SelectItem>
                        <SelectItem value="grandmother">Grandmother</SelectItem>
                        <SelectItem value="grandson">Grandson</SelectItem>
                        <SelectItem value="granddaughter">Granddaughter</SelectItem>
                        <SelectItem value="uncle">Uncle</SelectItem>
                        <SelectItem value="aunt">Aunt</SelectItem>
                        <SelectItem value="nephew">Nephew</SelectItem>
                        <SelectItem value="niece">Niece</SelectItem>
                        <SelectItem value="cousin">Cousin</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Notes (Optional)</Label>
                    <Textarea value={relationForm.notes} onChange={(e) => setRelationForm({...relationForm, notes: e.target.value})} placeholder="Additional details..." />
                  </div>
                  <Button type="submit" className="w-full">Add Connection</Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {relations.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No connections added yet</p>
            ) : (
              <div className="space-y-3">
                {relations.map((relation) => (
                  <div key={relation.id} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary flex-shrink-0">
                      {relation.related_member.photo_url ? (
                        <img src={relation.related_member.photo_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-heritage flex items-center justify-center">
                          <User className="w-6 h-6 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{relation.related_member.full_name}</p>
                      <p className="text-sm text-muted-foreground capitalize">{relation.relation_type}</p>
                      {relation.notes && <p className="text-sm text-muted-foreground mt-1">{relation.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stories */}
        <Card className="shadow-soft animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Stories & Memories
            </CardTitle>
            <Dialog open={dialogOpen === 'story'} onOpenChange={(open) => setDialogOpen(open ? 'story' : null)}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Story
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add a Story</DialogTitle>
                  <DialogDescription>Share a memory or story about {member.full_name}</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddStory} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input value={storyForm.title} onChange={(e) => setStoryForm({...storyForm, title: e.target.value})} placeholder="Story title" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Date (Optional)</Label>
                    <Input type="date" value={storyForm.story_date} onChange={(e) => setStoryForm({...storyForm, story_date: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Story</Label>
                    <Textarea value={storyForm.story_text} onChange={(e) => setStoryForm({...storyForm, story_text: e.target.value})} placeholder="Write the story..." rows={6} required />
                  </div>
                  <Button type="submit" className="w-full">Add Story</Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {stories.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No stories added yet</p>
            ) : (
              <div className="space-y-4">
                {stories.map((story) => (
                  <div key={story.id} className="p-4 border border-border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium">{story.title}</h3>
                      {story.story_date && <p className="text-sm text-muted-foreground">{formatDate(story.story_date)}</p>}
                    </div>
                    <p className="text-foreground whitespace-pre-wrap">{story.story_text}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default MemberProfile;
