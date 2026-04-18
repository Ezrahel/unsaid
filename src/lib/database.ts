import initSqlJs from 'sql.js';

// Initialize SQLite database
let SQL: any;
let db: any;

export async function initDatabase() {
  if (!SQL) {
    SQL = await initSqlJs({
      locateFile: (file: string) => `https://sql.js.org/dist/${file}`
    });
  }

  if (!db) {
    try {
      // Try to load existing database from localStorage
      let dbData = null;
      try {
        dbData = localStorage.getItem('unsaid-db');
      } catch (e) {
        console.warn('localStorage not available, creating new database');
      }

      if (dbData) {
        try {
          const dbArray = new Uint8Array(JSON.parse(dbData));
          db = new SQL.Database(dbArray);
        } catch (e) {
          console.error('Error loading saved database:', e);
          db = new SQL.Database();
          createTables();
        }
      } else {
        db = new SQL.Database();
        createTables();
      }
    } catch (error) {
      console.error('Error initializing database:', error);
      throw new Error('Failed to initialize database');
    }
  }

  return db;
}

function createTables() {
  try {
    db.run(`
      CREATE TABLE IF NOT EXISTS stories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT NOT NULL,
        emotion TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_public BOOLEAN DEFAULT 1,
        author_id TEXT,
        reactions_like INTEGER DEFAULT 0,
        reactions_support INTEGER DEFAULT 0,
        reactions_sad INTEGER DEFAULT 0
      )
    `);
    saveDatabase();
  } catch (error) {
    console.error('Error creating tables:', error);
  }
}

function saveDatabase() {
  if (db) {
    try {
      const data = db.export();
      const buffer = Array.from(data);
      try {
        localStorage.setItem('unsaid-db', JSON.stringify(buffer));
      } catch (e) {
        console.warn('Could not save to localStorage:', e);
      }
    } catch (error) {
      console.error('Error exporting database:', error);
    }
  }
}

// Story operations
export async function addStory(storyData: {
  content: string;
  emotion: string;
  isPublic: boolean;
  authorId?: string;
}) {
  const database = await initDatabase();
  try {
    const stmt = database.prepare(`
      INSERT INTO stories (content, emotion, is_public, author_id)
      VALUES (?, ?, ?, ?)
    `);
    stmt.run([
      storyData.content,
      storyData.emotion,
      storyData.isPublic ? 1 : 0,
      storyData.authorId || null
    ]);
    stmt.free();
    saveDatabase();
  } catch (error) {
    console.error('Error adding story:', error);
    throw new Error('Failed to save story');
  }
}

export async function getStories(limit: number = 20, offset: number = 0) {
  const database = await initDatabase();
  try {
    const stmt = database.prepare(`
      SELECT id, content, emotion, created_at, is_public, author_id,
             reactions_like, reactions_support, reactions_sad
      FROM stories
      WHERE is_public = 1
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `);
    stmt.bind([limit, offset]);
    const results = [];
    while (stmt.step()) {
      const row = stmt.getAsObject();
      results.push({
        id: row.id,
        content: row.content,
        emotion: row.emotion,
        createdAt: new Date(row.created_at),
        isPublic: row.is_public === 1,
        authorId: row.author_id,
        reactions: {
          like: row.reactions_like,
          support: row.reactions_support,
          sad: row.reactions_sad
        }
      });
    }
    stmt.free();
    return results;
  } catch (error) {
    console.error('Error fetching stories:', error);
    throw new Error('Failed to fetch stories');
  }
}

export async function updateReaction(storyId: number, reactionType: 'like' | 'support' | 'sad') {
  const database = await initDatabase();
  
  // Whitelist validation for column name to prevent SQL injection
  const validColumns = ['like', 'support', 'sad'];
  if (!validColumns.includes(reactionType)) {
    throw new Error('Invalid reaction type');
  }
  
  const column = `reactions_${reactionType}`;
  try {
    const stmt = database.prepare(`
      UPDATE stories
      SET ${column} = ${column} + 1
      WHERE id = ?
    `);
    stmt.run([storyId]);
    stmt.free();
    saveDatabase();
  } catch (error) {
    console.error('Error updating reaction:', error);
    throw new Error('Failed to update reaction');
  }
}

// For now, no auth - we'll keep it simple
export const auth = {
  currentUser: null
};