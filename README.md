# Knowledge Base Content Extractor Frontend

A React-based frontend application for extracting content from PDF files and websites using a FastAPI backend.

## Project info

**URL**: https://lovable.dev/projects/be583b43-bf66-4f99-8e7c-be921d224e99

## Setup

### 1. Install Dependencies

```sh
npm install
```

### 2. Configure Environment Variables

1. Copy the example environment file:
   ```sh
   cp env.example .env
   ```

2. Edit the `.env` file and configure your backend URL:
   ```
   VITE_BACKEND_URL=http://localhost:8000
   ```

   **Note**: Make sure your backend server is running on the specified URL.

### 3. Start Development Server

```sh
npm run dev
```

The application will be available at `http://localhost:5173`

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/be583b43-bf66-4f99-8e7c-be921d224e99) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Configure environment variables (see above)

# Step 5: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## Environment Variables

The application uses the following environment variables:

- `VITE_BACKEND_URL`: URL of the FastAPI backend server (default: http://localhost:8000)
- `VITE_SUPABASE_URL`: Supabase project URL (optional)
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key (optional)

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- React Router DOM
- React Hook Form
- TanStack Query

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/be583b43-bf66-4f99-8e7c-be921d224e99) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
