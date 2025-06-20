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
    this.tasks[project].push(task);
    this._save();
  }

  async readTasks(project) {
    return this.tasks[project] || [];
  }

  async updateTask(project, taskId, updatedTask) {
    if (this.tasks[project]) {
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
}
