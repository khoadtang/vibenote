# AI Assistant Seed Document: AI-Powered Task Extractor App

## Overview

This project implements a web-based AI-powered task extraction tool. It converts Markdown-formatted, free-form user inputs into structured, actionable tasks. Tasks are automatically grouped by projects if specified via hashtags (e.g., `#project-name`).

## Functional Requirements

### Input Handling

* Markdown-supported text input.
* Support for project tagging via hashtags (`#`).

### Task Extraction & Grouping

* Use configurable AI models (OpenAI GPT-4, OpenRouter API).
* Generate concise, actionable tasks.
* Group tasks by detected project tags, with untagged tasks grouped under a default "General" category.

### CRUD Operations Abstraction

* Clearly abstract CRUD (Create, Read, Update, Delete) task operations.
* Initial storage using browser LocalStorage.
* Design modular interface for easy swapping of storage (e.g., third-party APIs like Todoist, databases).

### User Interface

* Horizontal split layout:

  * Wider markdown input area (60%-70% width).
  * Narrower generated task list area (30%-40% width).
* Button clearly labeled "Generate Tasks."
* Tasks displayed under clear, distinct project headings.

## Technical Requirements

### Project Structure

```
src/
├── components/
│   ├── MarkdownTaskInput.jsx
│   ├── TaskList.jsx
│   └── TaskItem.jsx
├── services/
│   ├── storageService.js
│   └── aiService.js
├── storage/
│   ├── localStorageTaskService.js
│   └── todoistTaskService.js (future integration)
├── config/
│   └── aiConfig.js
├── utils/
│   └── markdownParser.js
├── App.jsx
└── index.jsx
```

### Storage Abstraction Example (`storageService.js`)

```javascript
export class TaskStorage {
  async createTask(project, task) {}
  async readTasks(project) {}
  async updateTask(project, taskId, updatedTask) {}
  async deleteTask(project, taskId) {}
}
```

### AI Configuration (`aiConfig.js`)

```javascript
export const AI_CONFIG = {
  provider: 'openrouter', // or 'openai'
  apiKey: process.env.AI_API_KEY,
  model: 'gpt-4',
  endpoint: 'https://openrouter.ai/api/v1/chat/completions'
};
```

## Local Development Principles

* Users will clone the source code repository.
* Dependencies are managed via `npm install`.
* AI API keys and environment-specific settings are handled through environment variables (`.env`).
  1. Copy `.env.example` to `.env` and set `VITE_AI_API_KEY`.
  2. Install dependencies with `npm install`.
  3. Start the dev server using `npm run dev`.

## UI Layout

```
+----------------------------------------------------------------+
|                         AI Task Extractor                      |
+----------------------------------------------------------------+
| Markdown Input Area (70%)        | Generated Tasks (30%)       |
| +-------------------------------+|+---------------------------+|
| | #rigver issue connecting...   ||| Project: rigver           ||
| |                               ||| - [ ] Implement retries   ||
| |                               ||| - [ ] Add monitoring      ||
| |                               |||                           ||
| |                               ||| Project: General          ||
| |                               ||| - (no tasks yet)          ||
| +-------------------------------+|+---------------------------+|
|                                [Generate Tasks]                 |
+----------------------------------------------------------------+
```

## Future Enhancements

* Third-party task management integration (Todoist, Jira).
* User authentication and cloud-based task syncing.
* Enhanced markdown live-preview capabilities.

This document seeds the AI assistant clearly, providing all necessary context for understanding and implementing the project's functional and technical requirements.
