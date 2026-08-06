# Quotations API

Base URL: `{{BaseUrlLocal}}/api/quotations`

All routes require auth (`Authorization: Bearer <token>`). Roles allowed to read: `ADMIN`, `SUPER_ADMIN`, `EMPLOYEE`, `AGENT`, `CUSTOMER`. Roles allowed to write (create/update/delete): `ADMIN`, `SUPER_ADMIN`.

Three quote types are supported: `fire`, `business`, `iar` — backed by `fire_quotation`, `business_quotation`, `iar_quotation` tables respectively.

---

## 1. List quotations

`GET /api/quotations`

**Query params** (all optional):

| Param | Default | Notes |
|---|---|---|
| `quoteType` | *(none)* | `fire` \| `business` \| `iar`. **Omit to get all 3 types merged** into one paginated list, each row tagged with `type`. |
| `page` | 1 | Clamped to `>= 1`. |
| `limit` | 10 | Clamped to `1–100` — invalid/oversized values silently fall back to the default/max. |
| `search` | "" | Matches `quotationNo`, `clientName`, `riskLocation`, `pinCode` |
| `sortBy` | `id` | One of `id`, `quotationNo`, `clientName`, `sumInsured`, `grossPremium`, `createdAt`, `updatedAt` |
| `order` | `desc` | `asc` \| `desc` |

**Examples**

```
GET {{BaseUrlLocal}}/api/quotations
GET {{BaseUrlLocal}}/api/quotations?quoteType=fire&page=1&limit=10
GET {{BaseUrlLocal}}/api/quotations?search=Metro&sortBy=grossPremium&order=desc
GET {{BaseUrlLocal}}/api/quotations?page=2&limit=20
```

Response is a flat, paginated list of **summary** rows (list fields only, not the full record). Each row is tagged with `type` (`FIRE` \| `BUSINESS` \| `IAR`). With `quoteType` set, only that table is queried; without it, all 3 tables are merged, sorted, and paginated together as one combined result.

**Response**

```json
{
  "success": true,
  "data": [
    {
      "id": 2,
      "type": "FIRE",
      "quotationNo": "FIRE-1785929233063",
      "companyName": null,
      "productName": null,
      "clientName": "AVON INFRABIZ PVT LTD",
      "brokerName": null,
      "status": "Draft",
      "grossPremium": 32922,
      "sumInsured": 50000000,
      "createdAt": "2026-08-05T11:27:13.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 24,
    "totalPages": 3,
    "hasMore": true
  }
}
```

`hasMore` is `true` when there are more rows beyond the current page — drive a "Load more" button off it (fetch `page + 1` with the same `limit`/`search`/`sortBy`/`order` to continue) instead of assuming a fixed page count up front.

Use `GET /api/quotations/:id?quoteType=...` for the full record (`quotationJson`, `addons`, risk details, etc.) — not returned in the list view.

**Scaling note:** the merged (no-`quoteType`) query never loads whole tables into memory — it only pulls as many sorted rows as the current page could possibly need from each of the 3 tables, so cost scales with how deep you've paged, not with total row count.

---

## 2. Get one quotation

`GET /api/quotations/:id?quoteType=fire`

`quoteType` is **required** — the same `id` can exist in more than one table.

```
GET {{BaseUrlLocal}}/api/quotations/1?quoteType=iar
```

**Response**

```json
{
  "success": true,
  "data": {
    "quoteDetails": { "id": "1", "quotationNo": "...", "companyName": "...", "status": "Draft", "createdAt": "...", "updatedAt": "..." },
    "riskDetails": { "clientName": "...", "brokerName": "...", "riskLocation": "...", "pinCode": "...", "riskCode": 0 },
    "sumInsured": "50000000",
    "premium": { "netPremium": "...", "gstPercent": "...", "gstAmount": "...", "grossPremium": "..." },
    "addons": [],
    "remarks": null,
    "calculation": { }
  }
}
```

Returns `404` if not found, `400` if `quoteType` is missing.

---

## 3. Create a quotation

`POST /api/quotations`

Body must include `quoteType` plus the target table's columns (camelCase, matching the Prisma model — e.g. `quotationNo`, `clientName`, `sumInsured`, `quotationJson`, ...).

```json
{
  "quoteType": "business",
  "quotationNo": "BUS-1234",
  "clientName": "Example Corp",
  "sumInsured": 10000000,
  "netPremium": 50000,
  "gstPercent": 18,
  "gstAmount": 9000,
  "grossPremium": 59000,
  "quotationJson": "{...}"
}
```

Returns `400` if `quoteType` missing/invalid, `201` with the created row on success.

> Note: the calculators (`/api/fire-insurance`, `/api/business-insurance`, `/api/iar-insurance`) already save quotes as part of their own calculate flow — this endpoint is for direct/manual creation, not the normal calculator save path.

---

## 4. Update a quotation

`PUT /api/quotations/:id`

Pass `quoteType` either as a query param or in the body; any other body fields are written as-is to that row.

```
PUT {{BaseUrlLocal}}/api/quotations/1?quoteType=fire
```
```json
{ "status": "Approved", "remarks": "Reviewed and approved" }
```

Returns `400` if `quoteType` missing or the row wasn't found.

---

## 5. Delete a quotation

`DELETE /api/quotations/:id?quoteType=fire`

```
DELETE {{BaseUrlLocal}}/api/quotations/1?quoteType=fire
```

Returns `404` if not found, `400` if `quoteType` missing.

---

## Error shape

All errors follow:

```json
{ "success": false, "message": "..." }
```

Common ones:
- `400` — missing/invalid `quoteType`, or "Quotation not found" on update
- `404` — not found on get/delete
- `501` — `quoteType` not recognized (currently only `fire`, `business`, `iar` are valid)
