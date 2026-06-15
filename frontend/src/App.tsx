import React, { useState, useEffect } from 'react';
import { Task, taskService } from './services/taskService';
import './App.css';

interface UITask extends Task {
  isEditing?: boolean;
  editTitle?: string;
  editDescription?: string;
}

function App() {
  const [tasks, setTasks] = useState<UITask[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // تحميل المهام عند فتح التطبيق
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.getAllTasks();
      setTasks(data.map(task => ({ ...task, isEditing: false })));
      setError(null);
    } catch (err) {
      setError('خطأ في تحميل المهام');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // إضافة مهمة جديدة
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTitle.trim()) {
      setError('الرجاء إدخال عنوان المهمة');
      return;
    }

    try {
      const newTask = await taskService.createTask(newTitle, newDescription);
      setTasks([{ ...newTask, isEditing: false }, ...tasks]);
      setNewTitle('');
      setNewDescription('');
      setError(null);
    } catch (err) {
      setError('خطأ في إضافة المهمة');
      console.error(err);
    }
  };

  // تحديث حالة المهمة (مكتملة أم لا)
  const handleToggleTask = async (id: string, completed: boolean) => {
    try {
      const task = tasks.find(t => t.id === id);
      if (task) {
        await taskService.updateTask(id, task.title, task.description || '', !completed);
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: !completed } : t));
      }
    } catch (err) {
      setError('خطأ في تحديث المهمة');
      console.error(err);
    }
  };

  // حذف مهمة
  const handleDeleteTask = async (id: string) => {
    try {
      await taskService.deleteTask(id);
      setTasks(tasks.filter(t => t.id !== id));
      setError(null);
    } catch (err) {
      setError('خطأ في حذف المهمة');
      console.error(err);
    }
  };

  // تفعيل وضع التعديل
  const handleStartEdit = (task: UITask) => {
    setTasks(tasks.map(t =>
      t.id === task.id
        ? { ...t, isEditing: true, editTitle: t.title, editDescription: t.description || '' }
        : t
    ));
  };

  // حفظ التعديلات
  const handleSaveEdit = async (id: string) => {
    try {
      const task = tasks.find(t => t.id === id);
      if (task && task.editTitle) {
        await taskService.updateTask(id, task.editTitle, task.editDescription || '', task.completed);
        setTasks(tasks.map(t =>
          t.id === id
            ? { ...t, title: task.editTitle!, description: task.editDescription || '', isEditing: false }
            : t
        ));
        setError(null);
      }
    } catch (err) {
      setError('خطأ في حفظ التعديلات');
      console.error(err);
    }
  };

  // إلغاء التعديل
  const handleCancelEdit = (id: string) => {
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, isEditing: false } : t
    ));
  };

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>📋 إدارة المهام</h1>
          <p>تطبيق بسيط وسهل لإدارة مهامك اليومية</p>
        </header>

        {error && <div className="error-message">{error}</div>}

        {/* نموذج إضافة مهمة جديدة */}
        <form onSubmit={handleAddTask} className="add-task-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="أدخل عنوان المهمة..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="input"
            />
          </div>
          <div className="form-group">
            <textarea
              placeholder="الوصف (اختياري)..."
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="textarea"
              rows={2}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            ➕ إضافة مهمة
          </button>
        </form>

        {/* قائمة المهام */}
        <div className="tasks-section">
          <h2 className="tasks-title">
            المهام ({tasks.length})
          </h2>

          {loading ? (
            <p className="loading">جاري التحميل...</p>
          ) : tasks.length === 0 ? (
            <p className="no-tasks">لا توجد مهام حالياً. أضف مهمة جديدة! 🎉</p>
          ) : (
            <ul className="tasks-list">
              {tasks.map((task) => (
                <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                  <div className="task-checkbox">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleTask(task.id, task.completed)}
                      className="checkbox"
                    />
                  </div>

                  {task.isEditing ? (
                    <div className="task-edit">
                      <input
                        type="text"
                        value={task.editTitle || ''}
                        onChange={(e) =>
                          setTasks(tasks.map(t =>
                            t.id === task.id ? { ...t, editTitle: e.target.value } : t
                          ))
                        }
                        className="input"
                      />
                      <textarea
                        value={task.editDescription || ''}
                        onChange={(e) =>
                          setTasks(tasks.map(t =>
                            t.id === task.id ? { ...t, editDescription: e.target.value } : t
                          ))
                        }
                        className="textarea"
                        rows={2}
                      />
                      <div className="edit-actions">
                        <button
                          onClick={() => handleSaveEdit(task.id)}
                          className="btn btn-small btn-success"
                        >
                          ✅ حفظ
                        </button>
                        <button
                          onClick={() => handleCancelEdit(task.id)}
                          className="btn btn-small btn-cancel"
                        >
                          ❌ إلغاء
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="task-content">
                      <h3 className="task-title">{task.title}</h3>
                      {task.description && <p className="task-description">{task.description}</p>}
                      <small className="task-date">
                        {new Date(task.createdAt).toLocaleDateString('ar-SA')}
                      </small>
                    </div>
                  )}

                  {!task.isEditing && (
                    <div className="task-actions">
                      <button
                        onClick={() => handleStartEdit(task)}
                        className="btn btn-small btn-edit"
                        title="تعديل"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="btn btn-small btn-delete"
                        title="حذف"
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;