import fs from 'fs/promises';
import path from 'path';
import initSqlJs from 'sql.js';

const dataDir = path.resolve(process.cwd(), 'data');
const databasePath = path.join(dataDir, 'unsaid.sqlite');

let sqlPromise;
let dbPromise;

function getSql() {
  if (!sqlPromise) {
    sqlPromise = initSqlJs();
  }

  return sqlPromise;
}

async function persistDatabase(db) {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(databasePath, Buffer.from(db.export()));
}

async function createSchema(db) {
  db.run(`
    CREATE TABLE IF NOT EXISTS stories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL,
      emotion TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      is_public INTEGER DEFAULT 1,
      author_id TEXT,
      reactions_like INTEGER DEFAULT 0,
      reactions_support INTEGER DEFAULT 0,
      reactions_sad INTEGER DEFAULT 0
    )
  `);

  await persistDatabase(db);
}

async function openDatabase() {
  const SQL = await getSql();

  try {
    const existing = await fs.readFile(databasePath);
    return new SQL.Database(existing);
  } catch (error) {
    if (error?.code !== 'ENOENT') {
      throw error;
    }

    const db = new SQL.Database();
    await createSchema(db);
    return db;
  }
}

export async function getDatabase() {
  if (!dbPromise) {
    dbPromise = openDatabase();
  }

  return dbPromise;
}

export async function addStory(storyData) {
  const db = await getDatabase();
  const stmt = db.prepare(`
    INSERT INTO stories (content, emotion, is_public, author_id)
    VALUES (?, ?, ?, ?)
  `);

  try {
    stmt.run([
      storyData.content,
      storyData.emotion,
      storyData.isPublic ? 1 : 0,
      storyData.authorId || null,
    ]);
  } finally {
    stmt.free();
  }

  const storyId = db.exec('SELECT last_insert_rowid() AS id')[0]?.values?.[0]?.[0] ?? null;
  await persistDatabase(db);

  return storyId;
}

export async function listStories({ limit = 20, offset = 0, emotion }) {
  const db = await getDatabase();
  const query = `
    SELECT id, content, emotion, created_at, is_public, author_id,
           reactions_like, reactions_support, reactions_sad
    FROM stories
    WHERE is_public = 1
    ${emotion ? 'AND emotion = ?' : ''}
    ORDER BY datetime(created_at) DESC, id DESC
    LIMIT ? OFFSET ?
  `;
  const stmt = db.prepare(query);

  try {
    stmt.bind(emotion ? [emotion, limit, offset] : [limit, offset]);
    const results = [];

    while (stmt.step()) {
      const row = stmt.getAsObject();
      results.push({
        id: Number(row.id),
        content: String(row.content),
        emotion: String(row.emotion || 'unspecified'),
        createdAt: String(row.created_at),
        isPublic: Number(row.is_public) === 1,
        authorId: row.author_id ? String(row.author_id) : null,
        reactions: {
          like: Number(row.reactions_like || 0),
          support: Number(row.reactions_support || 0),
          sad: Number(row.reactions_sad || 0),
        },
      });
    }

    return results;
  } finally {
    stmt.free();
  }
}

export async function incrementReaction(storyId, reactionType) {
  const db = await getDatabase();
  const validColumns = new Set(['like', 'support', 'sad']);

  if (!validColumns.has(reactionType)) {
    throw new Error('Invalid reaction type');
  }

  const column = `reactions_${reactionType}`;
  db.run(
    `
      UPDATE stories
      SET ${column} = ${column} + 1
      WHERE id = ?
    `,
    [storyId],
  );

  await persistDatabase(db);
}
