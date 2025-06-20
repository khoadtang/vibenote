import { AI_CONFIG } from '../config/aiConfig.js';

export async function generateTasks(markdown) {
  const messages = [
    { role: 'system', content: 'Extract concise tasks grouped by hashtags.' },
    { role: 'user', content: markdown }
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
