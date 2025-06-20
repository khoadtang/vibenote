import React from 'react';

export default function MarkdownTaskInput({ value, onChange, onGenerate }) {
  return (
    <div className="markdown-input">
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Enter markdown with tasks..."
        style={{ width: '100%', height: '200px' }}
      />
      <button onClick={onGenerate}>Generate Tasks</button>
    </div>
  );
}
