import { describe, it, expect, vi, afterEach } from 'vitest';
import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
import TaskItem from './TaskItem.jsx';

describe('TaskItem inline editing', () => {
  afterEach(() => cleanup());

  it('saves edits on Enter', () => {
    const onUpdate = vi.fn();
    const { getByText, getByDisplayValue } = render(
      <TaskItem task={{ text: 'task', done: false }} onToggle={() => {}} onDelete={() => {}} onUpdate={onUpdate} />
    );
    const span = getByText('task');
    fireEvent.doubleClick(span);
    const input = getByDisplayValue('task');
    fireEvent.change(input, { target: { value: 'updated' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onUpdate).toHaveBeenCalledWith('updated');
  });

  it('cancels edit on Escape', () => {
    const onUpdate = vi.fn();
    const { getByText, getByDisplayValue } = render(
      <TaskItem task={{ text: 'cancel', done: false }} onToggle={() => {}} onDelete={() => {}} onUpdate={onUpdate} />
    );
    const span = getByText('cancel');
    fireEvent.doubleClick(span);
    const input = getByDisplayValue('cancel');
    fireEvent.change(input, { target: { value: 'nope' } });
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(onUpdate).not.toHaveBeenCalled();
    getByText('cancel');
  });
});
