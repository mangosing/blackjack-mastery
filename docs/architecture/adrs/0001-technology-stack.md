# ADR-0001: Technology Stack and Project Structure

## Status

Accepted

---

## Context

Blackjack Mastery is intended to grow from a single educational application into a comprehensive learning platform.

The technology stack should optimize for maintainability, developer experience, scalability, and future expansion.

---

## Decision

The project will use:

- Monorepo
- Next.js (Frontend)
- NestJS (Backend)
- TypeScript
- PostgreSQL (Supabase)
- Prisma ORM
- Linear for project management
- GitHub for source control

---

## Alternatives Considered

### Polyrepo

Pros

- Independent repositories

Cons

- Increased complexity
- Harder code sharing
- Additional CI/CD overhead

Decision

Rejected for MVP.

---

### Python Backend

Pros

- Excellent AI ecosystem

Cons

- Two-language stack
- Increased complexity

Decision

Deferred.

Future AI services may be implemented in Python while the primary application remains TypeScript.

---

## Consequences

### Positive

- Single language across frontend and backend
- Excellent developer experience
- Shared tooling
- Easier onboarding
- Scalable architecture

### Negative

- AI services may eventually require a secondary technology stack.

---

## Future Considerations

Future ADRs will document:

- Authentication
- AI services
- Mobile applications
- Event architecture
- Caching
