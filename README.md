# 🃏 Blackjack Master

> A modern, full-stack platform for mastering Blackjack through interactive training, simulations, analytics, and strategy.

![GitHub Actions](https://img.shields.io/github/actions/workflow/status/<your-org>/<repo>/ci.yml?branch=main)
![License](https://img.shields.io/badge/license-MIT-blue)
![Node](https://img.shields.io/badge/node-24.x-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)

---

## Overview

Blackjack Master is an educational platform designed to help players improve their Blackjack skills through:

- 🎯 Guided training
- 🧠 Basic Strategy practice
- ♠️ Card counting drills
- 📈 Performance analytics
- 🎮 Realistic game simulations

The project is built as a modern TypeScript monorepo with separate frontend and backend applications.

---

# Tech Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

## Backend

- NestJS
- Prisma ORM
- PostgreSQL (Supabase)

## Tooling

- Turborepo
- pnpm
- ESLint
- Prettier
- Husky
- lint-staged

## Testing

- Vitest
- React Testing Library
- Playwright
- Jest

## CI/CD

- GitHub Actions

---

# Project Structure

```
blackjack-mastery/
│
├── apps/
│   ├── api/                 # NestJS backend
│   └── web/                 # Next.js frontend
│
├── packages/
│   └── typescript/          # Shared TypeScript configuration
│
├── docs/
│   ├── architecture/
│   ├── design/
│   ├── engineering/
│   └── product/
│
└── .github/
```

---

# Prerequisites

Install the following before getting started.

- Node.js 24+
- pnpm 10+
- Git

Verify your versions:

```bash
node -v
pnpm -v
git --version
```

---

# Getting Started

Clone the repository.

```bash
git clone <repository-url>
cd blackjack-mastery
```

Install dependencies.

```bash
pnpm install
```

Create your environment file.

```bash
cp apps/api/.env.example apps/api/.env
```

Configure the required environment variables.

```text
DATABASE_URL=
DIRECT_URL=
```

Start the development environment.

```bash
pnpm dev
```

---

# Development Commands

## Start Development

```bash
pnpm dev
```

---

## Lint

```bash
pnpm lint
```

---

## Format

Automatically format the project.

```bash
pnpm format
```

Verify formatting.

```bash
pnpm format:check
```

---

## Testing

Run every test suite.

```bash
pnpm test
```

Frontend unit tests.

```bash
pnpm --filter web test
```

Frontend end-to-end tests.

```bash
pnpm --filter web test:e2e
```

Backend unit tests.

```bash
pnpm --filter api test
```

Backend end-to-end tests.

```bash
pnpm --filter api test:e2e
```

---

## Build

```bash
pnpm build
```

---

# Engineering Workflow

## Branch Naming

Feature work follows:

```text
feature/BLA-###
```

Example:

```text
feature/BLA-42-user-authentication
```

---

## Commit Messages

This project follows Conventional Commits.

Examples:

```text
feat(api): add authentication service
feat(web): create login page
feat(platform): configure GitHub Actions
fix(api): resolve Prisma migration issue
```

---

## Pull Requests

Every Pull Request should:

- Pass GitHub Actions
- Pass all tests
- Build successfully
- Receive review before merging

---

# Documentation

Project documentation is organized by topic.

## Product

- Vision
- Product Requirements Document (PRD)
- Personas
- Roadmap
- Success Metrics

## Architecture

- System Architecture
- API Design
- Database Design
- Domain Model
- Architecture Decision Records (ADRs)

## Engineering

- Getting Started
- Coding Standards
- Engineering Principles
- Git Workflow
- Testing Strategy
- Troubleshooting
- Contributing Guide

## Design

- Design System
- Component Library
- User Flows
- Wireframes
- UI Principles

---

# Continuous Integration

Every push and pull request automatically runs:

- ESLint
- Prettier
- Unit Tests
- Integration Tests
- End-to-End Tests
- Production Build

All checks must pass before code is merged into `main`.

---

# Roadmap

Current development priorities include:

- User Authentication
- Blackjack Rules Engine
- Basic Strategy Trainer
- Card Counting Trainer
- Performance Analytics
- Practice Sessions
- User Profiles

See the full roadmap in:

```
docs/product/Roadmap.md
```

---

# Contributing

Please review the following before contributing.

- `docs/engineering/Getting-started.md`
- `docs/engineering/Coding-Standards.md`
- `docs/engineering/Contributing.md`

---

# License

This project is licensed under the MIT License.
