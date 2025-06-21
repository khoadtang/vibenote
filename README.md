# AI Assistant Seed Document: AI-Powered Task Extractor App

## Overview

This project implements a web-based AI-powered task extraction tool. It converts Markdown-formatted, free-form user inputs into structured, actionable tasks. Tasks are automatically grouped by projects if specified via hashtags (e.g., `#project-name`).

## Functional Requirements

### Input Handling

* Markdown-supported text input.
* Support for project tagging via hashtags (`#`).

### Task Extraction & Grouping

* Use configurable AI models (OpenAI GPT-4, OpenRouter API).
* Generate concise, actionable tasks from whatever notes the user enters.
* When AI is configured, free-form text is transformed into a markdown task list grouped by `#<project-name>` headings.
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

### AI-Powered Extraction

With a valid AI configuration the input box can contain any raw notes or "stream
of consciousness" text. Press **Generate Tasks** and the model will respond with
a markdown list grouped by `#<project-name>` headings. Untagged items are placed
under `#General`.

Example input:

```text
Today I need to fix login for #webapp and also update the #docs about API tokens.
```

Possible AI output:

```markdown
# webapp
- [ ] Fix login

# docs
- [ ] Update API tokens section
```

### Manual Task Entry Without AI

If no AI API key is provided, the app will not call an AI model. In this case you
can still enter tasks directly in the Markdown area. Use clear project tags and
task items, e.g.:

```markdown
#abc-project
- [ ] Add API
```

Press **Generate Tasks** and the tasks will be parsed locally without any AI
requests.

### Task List UI

* Tasks are grouped by project headings.
* Each project section can be collapsed by clicking its title.
* The number of tasks for a project is shown next to the heading.

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
