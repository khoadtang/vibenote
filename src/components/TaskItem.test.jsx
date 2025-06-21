import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import TaskItem from './TaskItem.jsx';

describe('TaskItem', () => {
  it('renders completed class when task.done is true', () => {
    const { getByText } = render(
      <TaskItem
        task={{ text: 'sample', done: true }}
        onToggle={() => {}}
        onDelete={() => {}}
        onUpdate={() => {}}
      />
    );
    const span = getByText('sample');
    expect(span.className).toContain('completed');
  });

  it('calls onToggle when checkbox is clicked', () => {
    const onToggle = vi.fn();
    const { container } = render(
      <TaskItem
        task={{ text: 'sample', done: false }}
        onToggle={onToggle}
        onDelete={() => {}}
        onUpdate={() => {}}
      />
    );
    const checkbox = container.querySelector('input[type="checkbox"]');
    fireEvent.click(checkbox);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
