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
        `You are an expert project-assistant AI.

INPUT NOTE (Markdown, may contain one or many "#project" tags):
---
{user_note}
---

**Your task**
You're a senior technical architecture, so you need to think my note and extract the proper tasks 
to solve problems/issues

1. Read the note line-by-line.
2. Identify every clear, actionable piece of work (e.g., "fix login", "update docs", "test API").
3. Deduce the project for each task:
   • If the line (or a preceding heading) contains "#tag", use that tag (dont keep the "#").
   • If no tag is present, assign the task to "General".
4. Make each task concise and imperative, suitable for a to-do list style.
5. Remove duplicates within the same project (case-insensitive match on the full task text).
6. Ensure hashtags are not duplicated or repeated unnecessarily.


**Output format**

Return **only** a valid JSON object—no prose, no markdown formatting, no #(hashtag) for each project name no code blocks—structured like:
{
  "projectA": [
    "fix login",
    "update docs"
  ],
  "anotherProject": [
    "test API",
    "write tests"
  ],
  "general": [
    "buy groceries",
  ]
}

**Important**
- Do not include any additional text, markdown, or formatting.
- Incorrect output examples:
  \`\`\`json
  {
    "#projectA": ["fix login"]
  }
  \`\`\`
- Correct output example:
  {
    "#projectA": ["fix login"]
  }

Ensure the output is plain JSON without any wrapping or formatting.`
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
  return data;
}
