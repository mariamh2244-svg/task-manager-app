import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import sqlite3 from 'sqlite3';

const app: Express = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// قاعدة البيانات
const db = new sqlite3.Database('./tasks.db', (err) => {
  if (err) {
    console.error('خطأ في قاعدة البيانات:', err);
  } else {
    console.log('تم الاتصال بقاعدة البيانات بنجاح ✅');
  }
});

// إنشاء جدول المهام
db.run(`
  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT 0,
    createdAt TEXT,
    updatedAt TEXT
  )
`);

// الواجهات
interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

// الروابط (Routes)

// الحصول على جميع المهام
app.get('/api/tasks', (req: Request, res: Response) => {
  db.all('SELECT * FROM tasks ORDER BY createdAt DESC', (err, rows: Task[]) => {
    if (err) {
      return res.status(500).json({ error: 'خطأ في استرجاع المهام' });
    }
    res.json(rows);
  });
});

// الحصول على مهمة واحدة
app.get('/api/tasks/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, row: Task) => {
    if (err) {
      return res.status(500).json({ error: 'خطأ في استرجاع ال��همة' });
    }
    if (!row) {
      return res.status(404).json({ error: 'المهمة غير موجودة' });
    }
    res.json(row);
  });
});

// إضافة مهمة جديدة
app.post('/api/tasks', (req: Request, res: Response) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'العنوان مطلوب' });
  }

  const id = uuidv4();
  const now = new Date().toISOString();

  db.run(
    'INSERT INTO tasks (id, title, description, completed, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)',
    [id, title, description || '', false, now, now],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'خطأ في إضافة المهمة' });
      }
      res.status(201).json({
        id,
        title,
        description: description || '',
        completed: false,
        createdAt: now,
        updatedAt: now,
      });
    }
  );
});

// تحديث مهمة
app.put('/api/tasks/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;
  const now = new Date().toISOString();

  db.run(
    'UPDATE tasks SET title = ?, description = ?, completed = ?, updatedAt = ? WHERE id = ?',
    [title || '', description || '', completed || false, now, id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'خطأ في تحديث المهمة' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'المهمة غير موجودة' });
      }
      res.json({ id, title, description, completed, updatedAt: now });
    }
  );
});

// حذف مهمة
app.delete('/api/tasks/:id', (req: Request, res: Response) => {
  const { id } = req.params;

  db.run('DELETE FROM tasks WHERE id = ?', [id], function (err) {
    if (err) {
      return res.status(500).json({ error: 'خطأ في حذف المهمة' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'المهمة غير موجودة' });
    }
    res.json({ message: 'تم حذف المهمة بنجاح' });
  });
});

// فحص صحة الخادم
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'Backend يعمل بنجاح ✅' });
});

// بدء الخادم
app.listen(PORT, () => {
  console.log(`🚀 Backend يعمل على http://localhost:${PORT}`);
});