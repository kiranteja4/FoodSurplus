# FoodSurplus API Documentation

This page describes the API that currently exists. The only registered application endpoint is the health route. Proposed product routes are documented separately in the [API specification](docs/architecture/API_SPECIFICATION.md) and are **planned, not implemented**.

## Base URL

The local backend defaults to port `5000`; its API prefix is `/api/v1`.

## Implemented endpoint

### `GET /api/v1/health`

Public endpoint. No request body, authentication or query parameters are required or consumed.

**Success — HTTP 200**

```json
{
  "success": true,
  "service": "foodsurplus-api",
  "database": "connected"
}
```

`database` reflects the current Mongoose connection state and can be `connected`, `connecting`, `disconnecting` or `disconnected`. This is a connection-state snapshot; the route does not issue a separate database query. The response keeps the existing top-level shape used by the frontend Axios health-status component.

Example:

```powershell
Invoke-RestMethod http://localhost:5000/api/v1/health
```

### Unknown routes

Unregistered routes reach the not-found middleware and return HTTP 404 with this shape:

```json
{
  "success": false,
  "message": "Route not found: GET /api/v1/unknown"
}
```

The current error response format is not the planned standard business-API envelope. Future endpoints must follow the contracts in the [API specification](docs/architecture/API_SPECIFICATION.md) without silently changing the health response.

## Not implemented

There are no implemented authentication, organization, donation, claim, pickup, notification, upload or administrator endpoints. Their proposed methods, paths, authorization and response contracts in the architecture documents are plans only.
