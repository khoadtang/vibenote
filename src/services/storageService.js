export class TaskStorage {
  async createTask(project, task) {}
  async readTasks(project) { return []; }
  async readAll() { return {}; }
  async updateTask(project, taskId, updatedTask) {}
  async deleteTask(project, taskId) {}
}
