import initSqlJs from 'sql.js';
import { TaskList, Task, AppSettings, Priority } from '../types/shared';

let SQL: any = null;
let db: any = null;

export const initDb = async () => {
  if (!SQL) {
    SQL = await initSqlJs({ locateFile: () => '/sql-wasm.wasm' });
  }
  const savedDb = localStorage.getItem('taskDb');
  if (savedDb) {
    db = new SQL.Database(new Uint8Array(JSON.parse(savedDb)));
    await migrateDb();
  } else {
    db = new SQL.Database();
    createTables();
  }
  return db;
};

const createTables = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS lists (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      list_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      completed INTEGER NOT NULL DEFAULT 0,
      priority TEXT NOT NULL DEFAULT 'none',
      created_at TEXT NOT NULL,
      FOREIGN KEY (list_id) REFERENCES lists(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
    INSERT OR IGNORE INTO settings (key, value) VALUES ('themeColor', 'purple');
  `);
};

const migrateDb = async () => {
  try {
    db.run('ALTER TABLE tasks ADD COLUMN description TEXT');
  } catch (e) {
    // Column might already exist
  }
  saveDb();
};

const saveDb = () => {
  localStorage.setItem('taskDb', JSON.stringify(Array.from(db.export())));
};

export const getLists = async (): Promise<TaskList[]> => {
  if (!db) await initDb();
  const lists: TaskList[] = [];
  const listStmt = db.prepare('SELECT * FROM lists ORDER BY created_at DESC');
  const taskStmt = db.prepare('SELECT * FROM tasks WHERE list_id = ? ORDER BY created_at ASC');

  while (listStmt.step()) {
    const list = listStmt.getAsObject();
    const tasks: Task[] = [];
    taskStmt.bind([list.id]);
    while (taskStmt.step()) {
      const task = taskStmt.getAsObject();
      tasks.push({
        id: task.id,
        title: task.title,
        description: task.description || '',
        completed: Boolean(task.completed),
        priority: task.priority as Priority,
        createdAt: new Date(task.created_at),
        order: 0,
      });
    }
    taskStmt.reset();
    lists.push({
      id: list.id,
      title: list.title,
      description: list.description || '',
      tasks,
      createdAt: new Date(list.created_at),
      order: 0,
    });
  }
  listStmt.free();
  taskStmt.free();
  return lists;
};

export const createList = async (title: string, description: string) => {
  if (!db) await initDb();
  const id = Date.now().toString();
  db.run('INSERT INTO lists (id, title, description, created_at) VALUES (?, ?, ?, ?)', [
    id,
    title,
    description,
    new Date().toISOString(),
  ]);
  saveDb();
  return id;
};

export const updateList = async (id: string, title: string, description: string) => {
  if (!db) await initDb();
  db.run('UPDATE lists SET title = ?, description = ? WHERE id = ?', [title, description, id]);
  saveDb();
};

export const deleteList = async (id: string) => {
  if (!db) await initDb();
  db.run('DELETE FROM lists WHERE id = ?', [id]);
  saveDb();
};

export const createTask = async (listId: string, title: string, description: string, priority: Priority) => {
  if (!db) await initDb();
  const id = Date.now().toString();
  db.run(
    'INSERT INTO tasks (id, list_id, title, description, completed, priority, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [id, listId, title, description, 0, priority, new Date().toISOString()]
  );
  saveDb();
  return id;
};

export const updateTask = async (id: string, title: string, description: string, priority: Priority) => {
  if (!db) await initDb();
  db.run('UPDATE tasks SET title = ?, description = ?, priority = ? WHERE id = ?', [title, description, priority, id]);
  saveDb();
};

export const toggleTask = async (id: string) => {
  if (!db) await initDb();
  db.run('UPDATE tasks SET completed = NOT completed WHERE id = ?', [id]);
  saveDb();
};

export const deleteTask = async (id: string) => {
  if (!db) await initDb();
  db.run('DELETE FROM tasks WHERE id = ?', [id]);
  saveDb();
};

export const getSettings = async (): Promise<AppSettings> => {
  if (!db) await initDb();
  const stmt = db.prepare('SELECT value FROM settings WHERE key = ?');
  stmt.bind(['themeColor']);
  const settings: AppSettings = { themeColor: 'purple' };
  if (stmt.step()) {
    settings.themeColor = stmt.getAsObject().value;
  }
  stmt.free();
  return settings;
};

export const updateSettings = async (settings: Partial<AppSettings>) => {
  if (!db) await initDb();
  const stmt = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
  Object.entries(settings).forEach(([key, value]) => {
    stmt.bind([key, value]);
    stmt.step();
    stmt.reset();
  });
  stmt.free();
  saveDb();
};