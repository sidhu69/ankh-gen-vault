-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create families table
CREATE TABLE public.families (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.families ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view families they created"
  ON public.families FOR SELECT
  USING (auth.uid() = created_by);

CREATE POLICY "Users can create families"
  ON public.families FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their families"
  ON public.families FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their families"
  ON public.families FOR DELETE
  USING (auth.uid() = created_by);

-- Create family members table
CREATE TABLE public.family_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID REFERENCES public.families(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT NOT NULL,
  birth_date DATE,
  death_date DATE,
  gender TEXT,
  biography TEXT,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view members of their families"
  ON public.family_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.families
      WHERE families.id = family_members.family_id
      AND families.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can create members in their families"
  ON public.family_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.families
      WHERE families.id = family_members.family_id
      AND families.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update members in their families"
  ON public.family_members FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.families
      WHERE families.id = family_members.family_id
      AND families.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can delete members in their families"
  ON public.family_members FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.families
      WHERE families.id = family_members.family_id
      AND families.created_by = auth.uid()
    )
  );

-- Create member relations table for family connections
CREATE TYPE public.relation_type AS ENUM (
  'father', 'mother', 'son', 'daughter', 'brother', 'sister',
  'husband', 'wife', 'grandfather', 'grandmother', 'grandson', 'granddaughter',
  'uncle', 'aunt', 'nephew', 'niece', 'cousin', 'other'
);

CREATE TABLE public.member_relations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES public.family_members(id) ON DELETE CASCADE NOT NULL,
  related_member_id UUID REFERENCES public.family_members(id) ON DELETE CASCADE NOT NULL,
  relation_type public.relation_type NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT different_members CHECK (member_id != related_member_id),
  UNIQUE (member_id, related_member_id, relation_type)
);

ALTER TABLE public.member_relations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view relations in their families"
  ON public.member_relations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.family_members fm
      JOIN public.families f ON f.id = fm.family_id
      WHERE fm.id = member_relations.member_id
      AND f.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can create relations in their families"
  ON public.member_relations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.family_members fm
      JOIN public.families f ON f.id = fm.family_id
      WHERE fm.id = member_relations.member_id
      AND f.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update relations in their families"
  ON public.member_relations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.family_members fm
      JOIN public.families f ON f.id = fm.family_id
      WHERE fm.id = member_relations.member_id
      AND f.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can delete relations in their families"
  ON public.member_relations FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.family_members fm
      JOIN public.families f ON f.id = fm.family_id
      WHERE fm.id = member_relations.member_id
      AND f.created_by = auth.uid()
    )
  );

-- Create member stories table for memories
CREATE TABLE public.member_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES public.family_members(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  story_text TEXT NOT NULL,
  story_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.member_stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view stories in their families"
  ON public.member_stories FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.family_members fm
      JOIN public.families f ON f.id = fm.family_id
      WHERE fm.id = member_stories.member_id
      AND f.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can create stories in their families"
  ON public.member_stories FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.family_members fm
      JOIN public.families f ON f.id = fm.family_id
      WHERE fm.id = member_stories.member_id
      AND f.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update stories in their families"
  ON public.member_stories FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.family_members fm
      JOIN public.families f ON f.id = fm.family_id
      WHERE fm.id = member_stories.member_id
      AND f.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can delete stories in their families"
  ON public.member_stories FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.family_members fm
      JOIN public.families f ON f.id = fm.family_id
      WHERE fm.id = member_stories.member_id
      AND f.created_by = auth.uid()
    )
  );

-- Create story photos table
CREATE TABLE public.story_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID REFERENCES public.member_stories(id) ON DELETE CASCADE NOT NULL,
  photo_url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.story_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view story photos in their families"
  ON public.story_photos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.member_stories ms
      JOIN public.family_members fm ON fm.id = ms.member_id
      JOIN public.families f ON f.id = fm.family_id
      WHERE ms.id = story_photos.story_id
      AND f.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can create story photos in their families"
  ON public.story_photos FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.member_stories ms
      JOIN public.family_members fm ON fm.id = ms.member_id
      JOIN public.families f ON f.id = fm.family_id
      WHERE ms.id = story_photos.story_id
      AND f.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can delete story photos in their families"
  ON public.story_photos FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.member_stories ms
      JOIN public.family_members fm ON fm.id = ms.member_id
      JOIN public.families f ON f.id = fm.family_id
      WHERE ms.id = story_photos.story_id
      AND f.created_by = auth.uid()
    )
  );

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_families_updated_at
  BEFORE UPDATE ON public.families
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_family_members_updated_at
  BEFORE UPDATE ON public.family_members
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_member_relations_updated_at
  BEFORE UPDATE ON public.member_relations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_member_stories_updated_at
  BEFORE UPDATE ON public.member_stories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();