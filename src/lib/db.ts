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
      created_at TEXT NOT NULL,
      order_idx INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      list_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      completed INTEGER NOT NULL DEFAULT 0,
      priority TEXT NOT NULL DEFAULT 'none',
      created_at TEXT NOT NULL,
      order_idx INTEGER NOT NULL DEFAULT 0,
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
    db.run('ALTER TABLE lists ADD COLUMN order_idx INTEGER NOT NULL DEFAULT 0');
  } catch (e) {
    // Column might already exist
  }

  try {
    db.run('ALTER TABLE tasks ADD COLUMN description TEXT');
  } catch (e) {
    // Column might already exist
  }
  try {
    db.run('ALTER TABLE tasks ADD COLUMN order_idx INTEGER NOT NULL DEFAULT 0');
  } catch (e) {
    // Column might already exist
  }

  const lists = db.exec('SELECT id FROM lists WHERE order_idx = 0');
  if (lists[0]) {
    lists[0].values.forEach((row: any[], index: number) => {
      const id: string = row[0];
      db.run('UPDATE lists SET order_idx = ? WHERE id = ?', [index + 1, id]);
    });
  }

  const tasks = db.exec('SELECT id, list_id FROM tasks WHERE order_idx = 0');
  if (tasks[0]) {
    const tasksByList: Record<string, string[]> = {};
    tasks[0].values.forEach(([id, list_id]: [string, string]) => {
      if (!tasksByList[list_id]) tasksByList[list_id] = [];
      tasksByList[list_id].push(id);
    });
    Object.entries(tasksByList).forEach(([_ , taskIds]) => {
      taskIds.forEach((id, index) => {
        db.run('UPDATE tasks SET order_idx = ? WHERE id = ?', [index + 1, id]);
      });
    });
  }

  saveDb();
};

const saveDb = () => {
  localStorage.setItem('taskDb', JSON.stringify(Array.from(db.export())));
};

export const getLists = async (): Promise<TaskList[]> => {
  if (!db) await initDb();
  const lists: TaskList[] = [];
  const listStmt = db.prepare('SELECT * FROM lists ORDER BY order_idx ASC, created_at DESC');
  const taskStmt = db.prepare('SELECT * FROM tasks WHERE list_id = ? ORDER BY order_idx ASC, created_at ASC');

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
        order: task.order_idx,
      });
    }
    taskStmt.reset();
    lists.push({
      id: list.id,
      title: list.title,
      description: list.description || '',
      tasks,
      createdAt: new Date(list.created_at),
      order: list.order_idx,
    });
  }
  listStmt.free();
  taskStmt.free();
  return lists;
};

export const createList = async (title: string, description: string) => {
  if (!db) await initDb();
  const id = Date.now().toString();
  const order = (db.exec('SELECT MAX(order_idx) as max FROM lists')[0]?.values[0]?.[0] || 0) + 1;
  db.run('INSERT INTO lists (id, title, description, created_at, order_idx) VALUES (?, ?, ?, ?, ?)', [
    id,
    title,
    description,
    new Date().toISOString(),
    order,
  ]);
  saveDb();
  return id;
};

export const updateList = async (id: string, title: string, description: string) => {
  if (!db) await initDb();
  db.run('UPDATE lists SET title = ?, description = ? WHERE id = ?', [title, description, id]);
  saveDb();
};

export const updateListOrder = async (id: string, order: number) => {
  if (!db) await initDb();
  db.run('UPDATE lists SET order_idx = ? WHERE id = ?', [order, id]);
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
  const order = (db.exec('SELECT MAX(order_idx) as max FROM tasks WHERE list_id = ?', [listId])[0]?.values[0]?.[0] || 0) + 1;
  db.run(
    'INSERT INTO tasks (id, list_id, title, description, completed, priority, created_at, order_idx) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [id, listId, title, description, 0, priority, new Date().toISOString(), order]
  );
  saveDb();
  return id;
};

export const updateTask = async (id: string, title: string, description: string, priority: Priority) => {
  if (!db) await initDb();
  db.run('UPDATE tasks SET title = ?, description = ?, priority = ? WHERE id = ?', [title, description, priority, id]);
  saveDb();
};

export const updateTaskOrder = async (id: string, order: number) => {
  if (!db) await initDb();
  db.run('UPDATE tasks SET order_idx = ? WHERE id = ?', [order, id]);
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