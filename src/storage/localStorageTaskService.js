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

    // Check for duplicates
    const isDuplicate = this.tasks[project].some(existingTask => existingTask.id === task.id);
    if (isDuplicate) return; // Skip adding duplicate tasks

    this.tasks[project].push(task);
    this._save();
  }

  async createTasks(project, tasks) {
    if (!this.tasks[project]) this.tasks[project] = [];

    tasks.forEach(task => {
      const isDuplicate = this.tasks[project].some(existingTask => existingTask.text === task.text);
      if (!isDuplicate) {
        this.tasks[project].push(task);
      }
    });

    this._save();
  }

  async readTasks(project) {
    return this.tasks[project] || [];
  }

  async readAll() {
    return this.tasks;
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

  async deleteProject(project) {
    if (this.tasks[project]) {
      delete this.tasks[project];
      this._save();
    }
  }
}
