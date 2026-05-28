# API Contract

## Conventions

- Built with **Hono**. Every route validates input (body, query, params) with a **Zod** schema at the boundary before any logic runs.
- Base URL: `/api/v1`
- Auth: `Authorization: Bearer <token>` (Supabase Auth session token).
- Content-Type: `application/json`
- Request/response contracts are **Zod schemas in `packages/types`**, imported by both apps. The server validates with the schema; the client infers its types from it.

## Success Envelope
```json
{ "data": { } }
```

## Error Envelope
```json
{ "error": { "code": "RESOURCE_NOT_FOUND", "message": "Human readable message" } }
```

## Standard Status Codes
| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Validation error |
| 401 | Unauthenticated |
| 403 | Unauthorized |
| 404 | Not found |
| 409 | Conflict |
| 500 | Server error |

---

## Example Endpoint

### `GET /api/v1/users/:id`
Fetch a single user.

**Request**
```
GET /api/v1/users/123
Authorization: Bearer <token>
```

**Response — 200**
```json
{ "data": { "id": "123", "name": "Ada", "email": "ada@example.com" } }
```

**Response — 404**
```json
{ "error": { "code": "USER_NOT_FOUND", "message": "No user with id 123" } }
```

---

## Consistency Rules

- Resource names plural, lowercase: `/users`, `/orders`.
- Always wrap payloads in `data` / `error` envelopes.
- Never return raw arrays at the top level (wrap in `data`).
- Error `code` is SCREAMING_SNAKE_CASE and stable (clients may switch on it).
- New endpoint → add its Zod schema to `packages/types` first, then implement the route against it.
