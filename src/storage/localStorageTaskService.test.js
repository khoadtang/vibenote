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
});
