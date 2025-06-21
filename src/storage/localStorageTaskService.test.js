import { describe, it, expect, beforeEach } from 'vitest';
import { LocalStorageTaskService } from './localStorageTaskService.js';

// jsdom provides a global localStorage implementation

describe('LocalStorageTaskService', () => {
  let service;
  beforeEach(() => {
    localStorage.clear();
    service = new LocalStorageTaskService();
  });

  it('creates and reads tasks', async () => {
    await service.createTask('proj', { text: 'task 1', done: false });
    const tasks = await service.readTasks('proj');
    expect(tasks).toEqual([{ text: 'task 1', done: false }]);
  });

  it('updates tasks', async () => {
    await service.createTask('proj', { text: 'task 1', done: false });
    await service.updateTask('proj', 0, { text: 'updated', done: true });
    const tasks = await service.readTasks('proj');
    expect(tasks).toEqual([{ text: 'updated', done: true }]);
  });

  it('deletes tasks', async () => {
    await service.createTask('proj', { text: 'task 1', done: false });
    await service.deleteTask('proj', 0);
    const tasks = await service.readTasks('proj');
    expect(tasks).toEqual([]);
  });
});
