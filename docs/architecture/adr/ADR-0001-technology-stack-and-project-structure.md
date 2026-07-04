## Decision

We will use a monorepo containing:

- apps/web (Next.js)
- apps/api (NestJS)
- packages/ (shared code)
- docs/ (product and architecture documentation)

## Alternatives Considered

### Polyrepo

Pros:

- Independent deployments

Cons:

- More repositories to manage
- Harder to share code
- More CI/CD complexity

Decision:
Rejected for MVP.
