# AI Agent Documentation for VibeNote

## Project Overview

VibeNote is a web-based AI-powered task extraction tool that converts Markdown-formatted, free-form user inputs into structured, actionable tasks. Tasks are automatically grouped by projects if specified via hashtags (e.g., `#project-name`).

## Architecture

The application follows a React-based architecture with modular components and services:

```
src/
├── components/
│   ├── MarkdownTaskInput.jsx    # Input area for markdown text
│   ├── TaskList.jsx             # Display grouped tasks by project
│   └── TaskItem.jsx             # Individual task item with actions
├── services/
│   ├── storageService.js        # Abstract storage interface
│   └── aiService.js             # AI task generation service
├── storage/
│   ├── localStorageTaskService.js  # Local storage implementation
│   └── todoistTaskService.js       # Future third-party integration
├── utils/
│   └── markdownParser.js        # Parse markdown into task objects
├── config/
│   └── aiConfig.js              # AI service configuration
├── App.jsx                      # Main application component
└── index.jsx                    # Application entry point
```

## Core Features

### 1. Task Generation
- Convert free-form markdown text into structured tasks
- Support for project tagging via hashtags (`#project-name`)
- AI-powered task extraction using configurable models (OpenAI GPT-4, OpenRouter API)
- Automatic deduplication of tasks

### 2. Task Management
- **Create**: Generate new tasks from markdown input
- **Read**: Display tasks grouped by projects
- **Update**: Edit task text inline (double-click to edit)
- **Delete**: Remove individual tasks
- **Toggle**: Mark tasks as completed/incomplete

### 3. Project Management
- **Group tasks** by project hashtags
- **Collapse/expand** project sections
- **Remove entire projects** with all tasks
- **Mark all tasks completed** in a project
- **Auto-scroll** to newly added projects

### 4. Storage Abstraction
- Pluggable storage system with abstract interface
- Current implementation uses browser LocalStorage
- Designed for easy integration with third-party APIs (Todoist, Jira, etc.)

## Component Details

### App.jsx (Main Component)
**State Management:**
- `markdown`: Current input text
- `tasks`: Object with project names as keys, task arrays as values
- `isGenerating`: Prevents duplicate task generation

**Key Handlers:**
- `handleGenerate()`: Process markdown input and create tasks
- `handleToggle(project, idx)`: Toggle task completion status
- `handleDelete(project, idx)`: Remove specific task
- `handleUpdate(project, idx, text)`: Update task text
- `handleRemoveProject(project)`: Delete entire project
- `handleMarkCompleted(project)`: Mark all project tasks as done

### MarkdownTaskInput.jsx
**Features:**
- Textarea for markdown input
- Generate button and Enter key support
- Loading state management
- Input validation and clearing

**Props:**
- `value`: Current markdown text
- `onChange`: Text change handler
- `onGenerate`: Task generation trigger
- `isGenerating`: Loading state

### TaskList.jsx
**Features:**
- Display tasks grouped by projects
- Collapsible project sections
- Project action buttons (Remove, Mark Completed)
- Task count display

**Props:**
- `tasksByProject`: Tasks object
- `onToggle`: Task completion handler
- `onDelete`: Task deletion handler
- `onUpdate`: Task update handler
- `onRemoveProject`: Project removal handler
- `onMarkCompleted`: Mark all completed handler

### TaskItem.jsx
**Features:**
- Checkbox for completion status
- Inline text editing (double-click)
- Delete button
- Keyboard shortcuts (Enter to save, Escape to cancel)

**Props:**
- `task`: Task object `{text: string, done: boolean}`
- `onToggle`: Completion toggle handler
- `onDelete`: Task deletion handler
- `onUpdate`: Text update handler

## Data Models

### Task Object
```javascript
{
  text: string,    // Task description
  done: boolean    // Completion status
}
```

### Tasks State Structure
```javascript
{
  "project-name": [
    { text: "Task 1", done: false },
    { text: "Task 2", done: true }
  ],
  "another-project": [
    { text: "Task 3", done: false }
  ]
}
```

## Storage System

### Abstract Interface (TaskStorage)
```javascript
class TaskStorage {
  async createTask(project, task) {}
  async readTasks(project) {}
  async readAll() {}
  async updateTask(project, taskId, updatedTask) {}
  async deleteTask(project, taskId) {}
  async deleteProject(project) {}
}
```

### LocalStorageTaskService
- Extends TaskStorage abstract class
- Stores data in browser localStorage
- Key: `vibenote-tasks`
- Automatic saving after each operation

## AI Service Integration

### Configuration (aiConfig.js)
```javascript
export const AI_CONFIG = {
  provider: 'openrouter', // or 'openai'
  apiKey: process.env.VITE_AI_API_KEY,
  model: 'gpt-4',
  endpoint: 'https://openrouter.ai/api/v1/chat/completions'
};
```

### Task Generation Flow
1. User inputs markdown text
2. `generateTasks()` sends text to AI service
3. AI returns structured markdown with project headers
4. `parseProjects()` converts to task objects
5. Tasks merged with existing state (deduplicated)
6. UI updates with new tasks

## Markdown Parsing

### Supported Formats
```markdown
# Project Name
- [ ] Task description

#project-tag Task with inline project tag

- [ ] Task with inline #project tag
```

### Parser Logic (markdownParser.js)
- Detects project headers (`# Project Name`)
- Handles inline project tags (`#project-name`)
- Extracts task items (`- [ ] Task text`)
- Groups tasks by projects

## User Interface

### Layout
- Horizontal split: 70% input area, 30% task list
- Responsive design with scrollable task panel
- Loading states and disabled controls during generation

### Styling Features
- Project sections with collapse/expand
- Task completion with strikethrough
- Inline editing with focus management
- Hover effects for action buttons
- Auto-scroll to new content

## Development Guidelines

### Adding New Features
1. **New Task Actions**: Add handler in App.jsx, pass to components
2. **Storage Providers**: Implement TaskStorage interface
3. **AI Services**: Modify aiService.js configuration
4. **UI Components**: Follow existing prop patterns

### State Management Rules
- Always update storage when state changes
- Use functional state updates for immutability
- Handle async operations with try/catch
- Prevent duplicate operations with loading states

### Error Handling
- Storage failures: Graceful degradation
- AI service errors: User notifications
- Input validation: Prevent empty submissions
- Network issues: Retry mechanisms

## Testing Considerations

### Key Test Cases
- Task generation with various markdown formats
- Duplicate task prevention
- Storage persistence across sessions
- UI state management during async operations
- Error handling for AI service failures

### Mock Data
```javascript
const mockTasks = {
  "work": [
    { text: "Review pull requests", done: false },
    { text: "Update documentation", done: true }
  ],
  "personal": [
    { text: "Buy groceries", done: false }
  ]
};
```

## Future Enhancements

### Planned Features
- Third-party integrations (Todoist, Jira, GitHub Issues)
- User authentication and cloud sync
- Advanced markdown features (priorities, due dates)
- Task search and filtering
- Export functionality
- Keyboard shortcuts
- Drag and drop task reordering

### Technical Improvements
- React Query for better state management
- TypeScript for type safety
- Unit tests with Jest/React Testing Library
- E2E tests with Playwright
- Performance optimization with React.memo
- Accessibility improvements (ARIA labels, keyboard navigation)

## Environment Setup

### Required Environment Variables
```bash
VITE_AI_API_KEY=your_api_key_here
```

### Development Commands
```bash
npm install          # Install dependencies
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
```

## Debugging Tips

### Common Issues
1. **Duplicate tasks**: Check `isGenerating` state management
2. **Storage not persisting**: Verify localStorage keys
3. **AI service errors**: Check API key and network
4. **UI not updating**: Ensure immutable state updates

### Debug Tools
- React Developer Tools
- Browser localStorage inspector
- Network tab for AI service calls
- Console for error logging

# VibeNote Project Documentation

## Overview
VibeNote is a task management application that uses AI to extract tasks from markdown input. It organizes tasks by projects and provides features for task and project management.

## Architecture Diagram
```
+-------------------+       +-------------------+       +-------------------+
|   MarkdownTask   |       |     TaskList      |       |    TaskItem       |
|     Input.jsx    |       |      .jsx         |       |      .jsx         |
+-------------------+       +-------------------+       +-------------------+
         |                         |                         |
         |                         |                         |
         v                         v                         v
+-----------------------------------------------------------+
|                         App.jsx                          |
+-----------------------------------------------------------+
         |                         |                         |
         |                         |                         |
         v                         v                         v
+-------------------+       +-------------------+       +-------------------+
|   aiService.js    |       |   storageService  |       | markdownParser.js |
|                   |       |      .js          |       |      .js          |
+-------------------+       +-------------------+       +-------------------+
```

## Components

### App.jsx
- **Purpose**: Main application component.
- **Responsibilities**:
  - Manages state for tasks and markdown input.
  - Handles task generation, updates, deletion, and project management.

### MarkdownTaskInput.jsx
- **Purpose**: Provides a textarea for markdown input and a button to generate tasks.
- **Responsibilities**:
  - Accepts markdown input.
  - Triggers task generation.
  - Displays loading state.

### TaskList.jsx
- **Purpose**: Displays tasks grouped by projects.
- **Responsibilities**:
  - Collapsible project sections.
  - Buttons for removing projects and marking tasks as completed.

### TaskItem.jsx
- **Purpose**: Represents individual tasks.
- **Responsibilities**:
  - Checkbox for marking tasks as completed.
  - Inline editing.
  - Delete button.

## Services

### aiService.js
- **Purpose**: Interacts with AI to generate tasks from markdown input.
- **Responsibilities**:
  - Sends markdown input to AI.
  - Receives structured tasks.

### storageService.js
- **Purpose**: Abstracts storage operations.
- **Responsibilities**:
  - Provides methods for CRUD operations on tasks and projects.

### markdownParser.js
- **Purpose**: Parses markdown input into structured tasks.
- **Responsibilities**:
  - Detects project headers.
  - Extracts tasks.

## Features

### Task Management
- **Create**: Generate tasks from markdown input.
- **Read**: Display tasks grouped by projects.
- **Update**: Edit task text.
- **Delete**: Remove tasks.
- **Toggle**: Mark tasks as completed.

### Project Management
- **Group tasks** by project.
- **Remove projects**.
- **Mark all tasks completed**.

### AI Integration
- **Task Extraction**: Uses AI to convert markdown into structured tasks.

### Storage
- **LocalStorage**: Persists tasks and projects.

## Data Flow
1. User enters markdown input.
2. `MarkdownTaskInput` triggers `handleGenerate` in `App.jsx`.
3. AI processes input and returns tasks.
4. Tasks are parsed and stored.
5. UI updates to display tasks.

## Development

### Setup
1. Install dependencies: `npm install`
2. Start development server: `npm run dev`

### Testing
- Test task generation with various markdown formats.
- Verify task and project management features.

### Future Enhancements
- Add integrations with third-party services.
- Improve AI task extraction.
- Enhance UI/UX.

This documentation provides a comprehensive guide to the VibeNote project, including its architecture, components, features, and development process.
