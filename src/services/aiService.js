import { AI_CONFIG } from '../config/aiConfig.js';

// `notes` can be free-form text or markdown describing what is on the user's mind.
// The AI will turn this into a markdown task list grouped by #project names.
export async function generateTasks(notes) {
  if (!AI_CONFIG.apiKey || !AI_CONFIG.model || !AI_CONFIG.endpoint) {
    // If AI isn't configured, return the raw markdown so it can be parsed manually
    return notes;
  }
  const messages = [
    {
      role: 'system',
      content:
        'From the user notes, extract a markdown task list grouped by project name using "#<project-name>" headings. Use "#General" when no project is provided and return only the list.'
    },
    { role: 'user', content: notes }
  ];

  const response = await fetch(AI_CONFIG.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${AI_CONFIG.apiKey}`
    },
    body: JSON.stringify({
      model: AI_CONFIG.model,
      messages
    })
  });

  if (!response.ok) {
    throw new Error('AI request failed');
  }
  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}
