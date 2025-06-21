import { TaskStorage } from '../services/storageService.js';

export class LocalStorageTaskService extends TaskStorage {
  constructor() {
    super();
    this.storeKey = 'vibenote-tasks';
    this.tasks = JSON.parse(localStorage.getItem(this.storeKey) || '{}');
  }

  _save() {
    localStorage.setItem(this.storeKey, JSON.stringify(this.tasks));
  }

  async createTask(project, task) {
    if (!this.tasks[project]) this.tasks[project] = [];
    const getText = t => (typeof t === 'string' ? t : t.text);
    const text = getText(task);
    const exists = this.tasks[project].some(t => getText(t) === text);
    if (!exists) {
      this.tasks[project].push(task);
      this._save();
    }
  }

  async readTasks(project) {
    return this.tasks[project] || [];
  }

  async readAll() {
    return this.tasks;
  }

  async updateTask(project, taskId, updatedTask) {
    if (!this.tasks[project]) return;
    const getText = t => (typeof t === 'string' ? t : t.text);
    const text = getText(updatedTask);
    const exists = this.tasks[project].some((t, idx) => idx !== taskId && getText(t) === text);
    if (!exists) {
      this.tasks[project][taskId] = updatedTask;
      this._save();
    }
  }

  async deleteTask(project, taskId) {
    if (this.tasks[project]) {
      this.tasks[project].splice(taskId, 1);
      this._save();
    }
  }

  async deleteProject(project) {
    if (this.tasks[project]) {
      delete this.tasks[project];
      this._save();
    }
  }
}
