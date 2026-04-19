type StoryInput = {
  content: string;
  emotion: string;
  isPublic: boolean;
  authorId?: string;
};

type StoryRecord = {
  id: number;
  content: string;
  emotion: string;
  createdAt: string;
  isPublic: boolean;
  authorId: string | null;
  reactions: {
    like: number;
    support: number;
    sad: number;
  };
};

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').trim();

function buildApiUrl(path: string) {
  if (!apiBaseUrl) {
    return path;
  }

  return `${apiBaseUrl.replace(/\/$/, '')}${path}`;
}

async function readJson<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type') || '';
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.error || 'Request failed.');
  }

  if (!contentType.includes('application/json')) {
    throw new Error(
      'The stories API returned HTML instead of JSON. Make sure the backend API is running, and if the frontend is hosted separately set VITE_API_BASE_URL to the server URL.',
    );
  }

  if (!payload || typeof payload !== 'object') {
    throw new Error('The stories API returned empty data.');
  }

  return payload as T;
}

export async function addStory(storyData: StoryInput) {
  const response = await fetch(buildApiUrl('/api/stories'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(storyData),
  });

  return readJson<{ ok: true; id: number | null }>(response);
}

export async function getStories(limit = 20, offset = 0, emotion?: string) {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });

  if (emotion) {
    params.set('emotion', emotion);
  }

  const response = await fetch(buildApiUrl(`/api/stories?${params.toString()}`));
  const payload = await readJson<{ stories: StoryRecord[] }>(response);

  if (!Array.isArray(payload.stories)) {
    throw new Error('The stories API returned an invalid stories list.');
  }

  return payload.stories.map((story) => ({
    ...story,
    createdAt: new Date(story.createdAt),
  }));
}

export async function updateReaction(storyId: number, reactionType: 'like' | 'support' | 'sad') {
  const response = await fetch(buildApiUrl(`/api/stories/${storyId}/reactions`), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ reactionType }),
  });

  return readJson<{ ok: true }>(response);
}

export const auth = {
  currentUser: null,
};
