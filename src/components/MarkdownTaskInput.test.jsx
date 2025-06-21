import { describe, it, expect, vi, afterEach } from 'vitest';
import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
import MarkdownTaskInput from './MarkdownTaskInput.jsx';

describe('MarkdownTaskInput', () => {
  afterEach(() => cleanup());

  it('calls onGenerate when Enter is pressed', () => {
    const onGenerate = vi.fn();
    const { getByPlaceholderText } = render(
      <MarkdownTaskInput value="" onChange={() => {}} onGenerate={onGenerate} />
    );
    const textarea = getByPlaceholderText('Enter markdown with tasks... (Press Enter to generate)');
    fireEvent.keyDown(textarea, { key: 'Enter' });
    expect(onGenerate).toHaveBeenCalledTimes(1);
  });
});
