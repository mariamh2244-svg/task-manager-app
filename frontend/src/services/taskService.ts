import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const taskService = {
  // الحصول على جميع المهام
  getAllTasks: async (): Promise<Task[]> => {
    const response = await apiClient.get('/tasks');
    return response.data;
  },

  // الحصول على مهمة واحدة
  getTask: async (id: string): Promise<Task> => {
    const response = await apiClient.get(`/tasks/${id}`);
    return response.data;
  },

  // إضافة مهمة جديدة
  createTask: async (title: string, description: string = ''): Promise<Task> => {
    const response = await apiClient.post('/tasks', { title, description });
    return response.data;
  },

  // تحديث مهمة
  updateTask: async (id: string, title: string, description: string, completed: boolean): Promise<Task> => {
    const response = await apiClient.put(`/tasks/${id}`, {
      title,
      description,
      completed,
    });
    return response.data;
  },

  // حذف مهمة
  deleteTask: async (id: string): Promise<void> => {
    await apiClient.delete(`/tasks/${id}`);
  },
};