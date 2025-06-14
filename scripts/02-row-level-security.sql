-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_images ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Stories policies
CREATE POLICY "Users can view own stories" ON public.stories
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stories" ON public.stories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stories" ON public.stories
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own stories" ON public.stories
  FOR DELETE USING (auth.uid() = user_id);

-- Chapters policies
CREATE POLICY "Users can view own chapters" ON public.chapters
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.stories 
      WHERE stories.id = chapters.story_id 
      AND stories.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own chapters" ON public.chapters
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.stories 
      WHERE stories.id = chapters.story_id 
      AND stories.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own chapters" ON public.chapters
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.stories 
      WHERE stories.id = chapters.story_id 
      AND stories.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own chapters" ON public.chapters
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.stories 
      WHERE stories.id = chapters.story_id 
      AND stories.user_id = auth.uid()
    )
  );

-- Characters policies
CREATE POLICY "Users can view own characters" ON public.characters
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.stories 
      WHERE stories.id = characters.story_id 
      AND stories.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own characters" ON public.characters
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.stories 
      WHERE stories.id = characters.story_id 
      AND stories.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own characters" ON public.characters
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.stories 
      WHERE stories.id = characters.story_id 
      AND stories.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own characters" ON public.characters
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.stories 
      WHERE stories.id = characters.story_id 
      AND stories.user_id = auth.uid()
    )
  );

-- Locations policies
CREATE POLICY "Users can view own locations" ON public.locations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.stories 
      WHERE stories.id = locations.story_id 
      AND stories.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own locations" ON public.locations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.stories 
      WHERE stories.id = locations.story_id 
      AND stories.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own locations" ON public.locations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.stories 
      WHERE stories.id = locations.story_id 
      AND stories.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own locations" ON public.locations
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.stories 
      WHERE stories.id = locations.story_id 
      AND stories.user_id = auth.uid()
    )
  );

-- Scenes policies
CREATE POLICY "Users can view own scenes" ON public.scenes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.chapters 
      JOIN public.stories ON stories.id = chapters.story_id
      WHERE chapters.id = scenes.chapter_id 
      AND stories.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own scenes" ON public.scenes
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.chapters 
      JOIN public.stories ON stories.id = chapters.story_id
      WHERE chapters.id = scenes.chapter_id 
      AND stories.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own scenes" ON public.scenes
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.chapters 
      JOIN public.stories ON stories.id = chapters.story_id
      WHERE chapters.id = scenes.chapter_id 
      AND stories.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own scenes" ON public.scenes
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.chapters 
      JOIN public.stories ON stories.id = chapters.story_id
      WHERE chapters.id = scenes.chapter_id 
      AND stories.user_id = auth.uid()
    )
  );

-- Story images policies
CREATE POLICY "Users can view own story images" ON public.story_images
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.stories 
      WHERE stories.id = story_images.story_id 
      AND stories.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own story images" ON public.story_images
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.stories 
      WHERE stories.id = story_images.story_id 
      AND stories.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own story images" ON public.story_images
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.stories 
      WHERE stories.id = story_images.story_id 
      AND stories.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own story images" ON public.story_images
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.stories 
      WHERE stories.id = story_images.story_id 
      AND stories.user_id = auth.uid()
    )
  );
