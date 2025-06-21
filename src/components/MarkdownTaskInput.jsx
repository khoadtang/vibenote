import React from 'react';

export default function MarkdownTaskInput({ value, onChange, onGenerate }) {
  return (
    <div className="markdown-input">
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onGenerate();
          }
        }}
        placeholder="Enter markdown with tasks..."
      />
      <button className="generate-button" onClick={onGenerate}>
        Generate Tasks
      </button>
    </div>
  );
}
