import { getSupabaseClient } from '@/lib/supabase';
import { sanitizeStoryHtml } from '@/lib/storySanitizer';

type StoryInput = {
  content: string;
  emotion: string;
  isPublic: boolean;
  authorId?: string;
};

type StoryRow = {
  id: number;
  content: string;
  emotion: string;
  created_at: string;
  is_public: boolean;
  author_id: string | null;
  reactions_like: number;
  reactions_support: number;
  reactions_sad: number;
};

function mapStory(row: StoryRow) {
  return {
    id: row.id,
    content: sanitizeStoryHtml(row.content),
    emotion: row.emotion,
    createdAt: new Date(row.created_at),
    isPublic: row.is_public,
    authorId: row.author_id,
    reactions: {
      like: row.reactions_like ?? 0,
      support: row.reactions_support ?? 0,
      sad: row.reactions_sad ?? 0,
    },
  };
}

export async function addStory(storyData: StoryInput) {
  const supabase: any = getSupabaseClient();
  const sanitizedContent = sanitizeStoryHtml(storyData.content);
  const { data, error } = await supabase
    .from('stories')
    .insert({
      content: sanitizedContent,
      emotion: storyData.emotion || 'unspecified',
      is_public: storyData.isPublic,
      author_id: storyData.authorId || null,
    })
    .select('id')
    .single();

  if (error) {
    throw new Error(error.message || 'Failed to save story.');
  }

  return { ok: true, id: data.id };
}

export async function getStories(limit = 20, offset = 0, emotion?: string) {
  const supabase: any = getSupabaseClient();
  let query = supabase
    .from('stories')
    .select(
      'id, content, emotion, created_at, is_public, author_id, reactions_like, reactions_support, reactions_sad',
    )
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (emotion) {
    query = query.eq('emotion', emotion);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message || 'Failed to fetch stories.');
  }

  return (data || []).map((row) => mapStory(row as StoryRow));
}

export async function updateReaction(storyId: number, reactionType: 'like' | 'support' | 'sad') {
  const supabase: any = getSupabaseClient();
  const { error } = await supabase.rpc('increment_story_reaction', {
    story_id_input: storyId,
    reaction_type_input: reactionType,
  });

  if (error) {
    throw new Error(
      error.message ||
        'Failed to update reaction. Make sure the increment_story_reaction SQL function exists in Supabase.',
    );
  }

  return { ok: true };
}

export const auth = {
  currentUser: null,
};
