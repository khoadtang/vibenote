import React from 'react';

export default function MarkdownTaskInput({ value, onChange, onGenerate, isGenerating }) {
  return (
    <div className="markdown-input">
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!isGenerating) {
              onGenerate();
            }
          }
        }}
        placeholder="Enter markdown with tasks... (Press Enter to generate)"
        disabled={isGenerating}
      />
      <button 
        className="generate-button" 
        onClick={onGenerate}
        disabled={isGenerating}
      >
        {isGenerating ? 'Generating...' : 'Add Note'}
      </button>
    </div>
  );
}
