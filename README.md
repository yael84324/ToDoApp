# To-Do App

To-Do is a modern, responsive task management application built with React, TypeScript, and Tauri. It allows users to create, manage, update and delete, theme customization, and local data persistence using `sql.js`.

## Features
- **Task Lists and Tasks**: Create, read, update, and delete (CRUD) task lists and tasks.
- **Prioritization**: Assign priorities (High, Medium, Low, None) to tasks.
- **Drag-and-Drop Reordering**: Reorder lists and tasks with a user-friendly drag-and-drop interface.
- **Search**: Filter lists by title, description, or task content.
- **Theme Customization**: Choose from multiple color themes to personalize the app.
- **Progress Tracking**: Visualize task completion with progress bars and statistics.
- **Responsive Design**: Works seamlessly on desktop and mobile devices.
- **Local Persistence**: Data is stored locally using `sql.js` and `localStorage`.

## Setup Instructions
### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Rust (for Tauri, if building the desktop app)
- Tauri CLI (`npm install -g @tauri-apps/cli`)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yael84324/ToDoApp.git
   cd todoapp
   ```
2. Install dependencies:
    ```
    npm install
    ```
3. (Optional) For Tauri desktop app:
    Ensure Rust is installed: 
    ```
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
    ```
    Install Tauri CLI: 
    ```
    npm install -g @tauri-apps/cli
    ```

## Running the App
### Web App
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### Desktop App (via Tauri)
```bash
npm run tauri dev
```

## Building the App
### Web App
```bash
npm run build
```
The output will be in the `dist` folder.

### Desktop App
```bash
npm run tauri build
```
The executable will be in the `src-tauri/target/release` folder.

## Running Tests
```bash
npm run test
```

## Architecture Decisions
- **Frontend Framework**: React with TypeScript for type safety and component-based architecture.
- **State Management**: Custom hook (`useTaskManager`) to manage application state and business logic, keeping components clean.
- **Data Persistence**: `sql.js` with `localStorage` for lightweight, client-side storage without external dependencies.
- **Styling**: Tailwind CSS for rapid, utility-first styling with consistent design.
- **Drag-and-Drop**: Custom `useDragAndDrop` hook for reusable drag-and-drop functionality.
- **Testing**: Vitest and React Testing Library for unit tests, ensuring reliability of CRUD operations.

## API Documentation
### `useTaskManager` Hook
- **Purpose**: Manages task lists, tasks, and settings with CRUD operations and search functionality.
- **Methods**:
  - `createList(title: string, description: string)`: Creates a new task list.
  - `updateList(id: string, title: string, description: string)`: Updates a list.
  - `deleteList(id: string)`: Deletes a list and its tasks.
  - `createTask(listId: string, title: string, description: string, priority: Priority)`: Creates a task in a list.
  - `updateTask(taskId: string, title: string, description: string, priority: Priority)`: Updates a task.
  - `deleteTask(taskId: string)`: Deletes a task.
  - `toggleTask(taskId: string)`: Toggles task completion status.
  - `reorderLists(orderedIds: string[])`: Reorders lists.
  - `reorderTasks(orderedIds: string[])`: Reorders tasks within a list.
  - `updateThemeColor(color: string)`: Updates the app's theme color.
  - `getCompletionStats()`: Returns completion statistics for all lists.

### `db.ts` Module
- **Purpose**: Handles database operations using `sql.js` for persistence.
- **Key Functions**:
  - `initDb()`: Initializes the SQLite database.
  - `getLists()`: Retrieves all lists with their tasks.
  - `createList(title: string, description: string)`: Creates a new list.
  - `updateList(id: string, title: string, description: string)`: Updates a list.
  - `deleteList(id: string)`: Deletes a list and its tasks.
  - `createTask(listId: string, title: string, description: string, priority: Priority)`: Creates a task.
  - `updateTask(id: string, title: string, description: string, priority: Priority)`: Updates a task.
  - `toggleTask(id: string)`: Toggles task completion.
  - `deleteTask(id: string)`: Deletes a task.
  - `updateSettings(settings: Partial<AppSettings>)`: Updates app settings.

## Known Limitations
- **Storage**: Data is stored in `localStorage`, which may have size limitations and is not suitable for large datasets.
- **Syncing**: No support for syncing data across devices or users.
- **Testing**: Limited test coverage; additional tests for edge cases and UI interactions are needed.
- **Drag-and-Drop**: The drag-and-drop functionality sometimes doesn't work on the desktop version; this bug is currently being addressed.

## Future Improvements
- Implement real-time sync with a backend server or user difference laptops.
- Add an archive button to hide lists that aren't actively being used. Users will be able to view these lists in a dedicated archive section, ensuring data is preserved rather than permanently deleted. 
- Implement a button allowing users to export their data to a file.
- Expand test coverage for edge cases and performance.