import { AI_CONFIG } from '../config/aiConfig.js';

// `notes` can be free-form text or markdown describing what is on the user's mind.
// The AI will turn this into a markdown task list grouped by #project names.
export async function generateTasks(notes) {
  console.log('AI_CONFIG:', AI_CONFIG);
  console.log('Notes:', notes);

  if (!AI_CONFIG.apiKey || !AI_CONFIG.model || !AI_CONFIG.endpoint) {
    console.warn('AI configuration is missing. Returning raw notes.');
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

  console.log('Sending request to AI endpoint:', AI_CONFIG.endpoint);

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

  console.log('AI response status:', response.status);
  if (!response.ok) {
    console.error('AI request failed:', response.statusText);
    throw new Error('AI request failed');
  }

  const data = await response.json();
  console.log('AI response data:', data);
  return data.choices?.[0]?.message?.content || '';
}
