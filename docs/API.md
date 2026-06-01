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

**Response - 200**
```json
{ "data": { "id": "123", "name": "Ada", "email": "ada@example.com" } }
```

**Response - 404**
```json
{ "error": { "code": "USER_NOT_FOUND", "message": "No user with id 123" } }
```

---

## Detection Endpoint

### `POST /api/v1/detect`
Analyze one uploaded crossing image with either the deep learning detector or the classic ML classifier.

**Request**
```
POST /api/v1/detect
Content-Type: multipart/form-data
```

Fields:

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `file` | File | Yes | Image only: JPG, PNG, WEBP, or BMP |
| `modelType` | String | No | `classic_ml` or `deep_learning`; defaults to `classic_ml` |

**Response - 200**
```json
{
  "data": {
    "job_id": "uuid",
    "filename": "crossing.jpg",
    "model_type": "classic_ml",
    "model_name": "Classic CV RBF SVM",
    "status": "SAFE",
    "reason": "RBF SVM classified the frame as safe.",
    "latency_ms": 31.4,
    "kind": "image",
    "confidence": 0.82,
    "detections": [],
    "preprocessing": [
      { "name": "Resize", "description": "Image resized to 128x128 for feature extraction." }
    ]
  }
}
```

The endpoint returns a direct verdict only. It does not return annotated image output.

**Response - 400**
```json
{ "error": { "code": "UNSUPPORTED_FILE", "message": "Use a JPG, PNG, WEBP, or BMP image." } }
```

---

## Consistency Rules

- Resource names plural, lowercase: `/users`, `/orders`.
- Always wrap payloads in `data` / `error` envelopes.
- Never return raw arrays at the top level (wrap in `data`).
- Error `code` is SCREAMING_SNAKE_CASE and stable (clients may switch on it).
- New endpoint → add its Zod schema to `packages/types` first, then implement the route against it.

---

## Payments & Auth (when used)

- **Auth flows** (sign up, sign in, OAuth with Google/GitHub, password reset, avatar upload) run through the **Supabase SDK** from `apps/web`, not custom API endpoints. Add a server endpoint only for trusted operations that need the service-role key.
- **Payment webhook** (e.g. `POST /api/v1/payments/notification`) is the one route that is **not** Bearer-authenticated: Midtrans calls it server-to-server, so verify the **signature hash** instead (SHA512 of `order_id + status_code + gross_amount + server_key`). Still validate the body with Zod like any other route, and treat it as the source of truth for order status. See ADR-012.
