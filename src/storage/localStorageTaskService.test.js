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
    await service.createTask('proj', 'task 1');
    const tasks = await service.readTasks('proj');
    expect(tasks).toEqual(['task 1']);
  });

  it('updates tasks', async () => {
    await service.createTask('proj', 'task 1');
    await service.updateTask('proj', 0, 'updated');
    const tasks = await service.readTasks('proj');
    expect(tasks).toEqual(['updated']);
  });

  it('deletes tasks', async () => {
    await service.createTask('proj', 'task 1');
    await service.deleteTask('proj', 0);
    const tasks = await service.readTasks('proj');
    expect(tasks).toEqual([]);
  });

  it('persists task completion', async () => {
    const task = { text: 'persist', done: false };
    await service.createTask('proj', task);
    await service.updateTask('proj', 0, { ...task, done: true });

    const newService = new LocalStorageTaskService();
    const tasks = await newService.readTasks('proj');
    expect(tasks[0]).toEqual({ text: 'persist', done: true });
  });
});
