# Chess AI Review

A production-ready monorepo workspace for the Chess AI Review project.

## Repository Structure

The repository is organized as a monorepo using npm workspaces:

```
├── frontend/           # Frontend application (React 19 + Vite + TypeScript + Tailwind CSS)
├── backend/            # Backend application (Node.js + Express + TypeScript)
├── LICENSE             # MIT License
├── README.md           # This file
└── package.json        # Root package configuration (Workspaces & shared scripts)
```

## Prerequisites

- **Node.js**: >= 18.x
- **npm**: >= 9.x

## Getting Started

### 1. Install Dependencies

Install all dependencies for both the frontend extension and backend server from the repository root:

```bash
npm install
```

This will automatically configure and link all workspaces under a shared `node_modules` directory in the root.

### 2. Available Scripts

All scripts can be run from the root of the project:

#### Development

Start development servers for both workspaces or target them individually:

```bash
# Start both frontend and backend in development mode
# (Note: You can run these in separate terminal tabs)
npm run dev:frontend
npm run dev:backend
```

#### Production Build

Build the project workspace outputs:

```bash
# Build all workspaces
npm run build

# Build frontend only
npm run build:frontend

# Build backend only
npm run build:backend
```

#### Linting & Formatting

Lint and format code across all workspaces:

```bash
# Check code style and rules across all workspaces
npm run lint

# Format code across all workspaces
npm run format
```

## Technologies Used

### Frontend
- **Framework**: React 19, Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Code Quality**: ESLint, Prettier

### Backend
- **Framework**: Express, Node.js
- **Language**: TypeScript
- **Code Quality**: ESLint, Prettier
