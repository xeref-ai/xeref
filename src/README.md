# Source Code Directory (`/src`)

This directory contains the primary source code for the Xeref.ai Next.js application. It follows the standard structure for a modern Next.js project using the App Router.

## Directory Structure

The source code is organized into the following key directories to ensure a clean separation of concerns:

-   **`/src/app`**: Core of the application, built on the Next.js App Router.
    -   Contains all pages and user-facing routes (e.g., `/home`, `/login`).
    -   Contains all backend API endpoints in the `/api` subdirectory (e.g., `/api/chat`, `/api/skool`, `/api/stripe`).

-   **`/src/components`**: Contains all reusable React components.
    -   `/src/components/ui`: Specifically holds components from the ShadCN UI library.
    -   Other components are organized by feature or view (e.g., `chat-interface.tsx`, `tasks-view.tsx`).

-   **`/src/lib`**: Contains core application logic, third-party service initializations, and utility functions.
    -   `firebase.ts`: Client-side Firebase SDK initialization.
    -   `firebase-admin.ts`: Server-side Firebase Admin SDK initialization.
    -   `auth.tsx`: Authentication context and provider for managing user sessions.
    -   `utils.ts`: General utility functions used throughout the application.

-   **`/src/ai`**: Dedicated to all Artificial Intelligence-related logic.
    -   `ai-instance.ts`: Initializes the AI model instance.
    -   `/src/ai/flows`: Contains specific AI-powered workflows, such as `cleanup-task.ts` or `enhance-prompt.ts`, which orchestrate calls to the AI model with specific instructions and schemas.

-   **`/src/hooks`**: Contains custom React hooks for managing stateful logic across components (e.g., `use-toast.ts`).

## Key Files

-   **`src/middleware.ts`**: Handles request middleware for the application, used for tasks like authentication checks before a user can access a protected route.
-   **`src/app/globals.css`**: Contains the global Tailwind CSS styles and definitions for the application.
-   **`src/app/layout.tsx`**: The root layout for the entire application, defining the main HTML structure.
