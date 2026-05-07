# 📊 API Documentation - WhatsApp Scholarship Agent

Complete API reference for the Scholarship Agent System.

## Base URL

```
http://localhost:3000
```

Production:
```
https://your-domain.com
```

## Authentication

Currently, the API is open. For production, implement authentication:

```javascript
// Add to your requests
headers: {
  'Authorization': 'Bearer YOUR_API_KEY'
}
```

## Endpoints

### 1. Health Check

Check if the system is running.

**Endpoint**: `GET /health`

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2026-05-04T06:39:33.862Z",
  "publisher": {
    "publishedToday": 2,
    "maxPerDay": 3,
    "whatsappReady": true,
    "telegramReady": true
  }
}
```

**Example**:
```bash
curl http://localhost:3000/health
```

---

### 2. Get Statistics

Get system statistics.

**Endpoint**: `GET /api/stats`

**Response**:
```json
{
  "total": 150,
  "posted": 45,
  "active": 105,
  "pending": 60
}
```

**Example**:
```bash
curl http://localhost:3000/api/stats
```

---

### 3. Get Pending Scholarships

Get scholarships that haven't been posted yet.

**Endpoint**: `GET /api/scholarships/pending`

**Query Parameters**:
- `limit` (optional): Number of scholarships to return (default: 10)

**Response**:
```json
[
  {
    "id": 1,
    "title": "DAAD Scholarship Program",
    "country": "Germany",
    "degree_level": "Masters",
    "funding_type": "Fully Funded",
    "deadline": "2026-09-30",
    "source_url": "https://example.com/scholarship",
    "description": "Full scholarship for international students",
    "status": "active",
    "posted": false,
    "date_found": "2026-05-04T06:00:00.000Z"
  }
]
```

**Example**:
```bash
curl "http://localhost:3000/api/scholarships/pending?limit=5"
```

---

### 4. Manual Hunt

Manually trigger scholarship hunting.

**Endpoint**: `POST /api/hunt`

**Response**:
```json
{
  "success": true,
  "count": 12,
  "scholarships": [
    {
      "title": "Scholarship Title",
      "country": "USA",
      "deadline": "2026-12-31",
      "source_url": "https://example.com"
    }
  ]
}
```

**Example**:
```bash
curl -X POST http://localhost:3000/api/hunt
```

---

### 5. Manual Publish

Manually trigger publishing workflow.

**Endpoint**: `POST /api/publish`

**Response**:
```json
{
  "success": true
}
```

**Example**:
```bash
curl -X POST http://localhost:3000/api/publish
```

---

### 6. Get Agent Logs

Get recent agent activity logs.

**Endpoint**: `GET /api/logs`

**Query Parameters**:
- `limit` (optional): Number of logs to return (default: 50)

**Response**:
```json
[
  {
    "id": 1,
    "agent_name": "ScholarshipHunter",
    "action": "Scraped Opportunities Circle",
    "status": "success",
    "details": "{\"count\": 5}",
    "error_message": null,
    "created_at": "2026-05-04T06:30:00.000Z"
  },
  {
    "id": 2,
    "agent_name": "OpportunityValidator",
    "action": "Validated DAAD Scholarship",
    "status": "success",
    "details": "{\"recommendation\": \"post\"}",
    "error_message": null,
    "created_at": "2026-05-04T06:31:00.000Z"
  }
]
```

**Example**:
```bash
curl "http://localhost:3000/api/logs?limit=20"
```

---

## Error Responses

All endpoints return standard error responses:

**400 Bad Request**:
```json
{
  "error": "Invalid parameter: limit must be a number"
}
```

**500 Internal Server Error**:
```json
{
  "error": "Database connection failed"
}
```

## Rate Limiting

Currently no rate limiting is implemented. For production:

- Implement rate limiting per IP
- Suggested: 100 requests per 15 minutes
- Return 429 status code when exceeded

## Webhooks (Future)

Future webhook support for external integrations:

**POST /api/webhook/scholarship**

Receive scholarship submissions from external sources.

**POST /api/webhook/telegram**

Telegram bot webhook endpoint.

## WebSocket Support (Future)

Real-time updates via WebSocket:

```javascript
const ws = new WebSocket('ws://localhost:3000/ws');

ws.on('message', (data) => {
  const event = JSON.parse(data);
  console.log('New scholarship:', event);
});
```

## SDK Examples

### JavaScript/Node.js

```javascript
const axios = require('axios');

const API_BASE = 'http://localhost:3000';

// Get statistics
async function getStats() {
  const response = await axios.get(`${API_BASE}/api/stats`);
  return response.data;
}

// Trigger hunt
async function triggerHunt() {
  const response = await axios.post(`${API_BASE}/api/hunt`);
  return response.data;
}

// Get pending scholarships
async function getPending(limit = 10) {
  const response = await axios.get(`${API_BASE}/api/scholarships/pending`, {
    params: { limit }
  });
  return response.data;
}
```

### Python

```python
import requests

API_BASE = 'http://localhost:3000'

# Get statistics
def get_stats():
    response = requests.get(f'{API_BASE}/api/stats')
    return response.json()

# Trigger hunt
def trigger_hunt():
    response = requests.post(f'{API_BASE}/api/hunt')
    return response.json()

# Get pending scholarships
def get_pending(limit=10):
    response = requests.get(
        f'{API_BASE}/api/scholarships/pending',
        params={'limit': limit}
    )
    return response.json()
```

### cURL

```bash
# Get statistics
curl http://localhost:3000/api/stats

# Trigger hunt
curl -X POST http://localhost:3000/api/hunt

# Get pending scholarships
curl "http://localhost:3000/api/scholarships/pending?limit=5"

# Get logs
curl "http://localhost:3000/api/logs?limit=20"

# Health check
curl http://localhost:3000/health
```

## Testing

### Using Postman

1. Import this collection:

```json
{
  "info": {
    "name": "Scholarship Agent API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/health"
      }
    },
    {
      "name": "Get Statistics",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/api/stats"
      }
    },
    {
      "name": "Get Pending Scholarships",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/api/scholarships/pending?limit=10"
      }
    },
    {
      "name": "Manual Hunt",
      "request": {
        "method": "POST",
        "url": "{{base_url}}/api/hunt"
      }
    },
    {
      "name": "Manual Publish",
      "request": {
        "method": "POST",
        "url": "{{base_url}}/api/publish"
      }
    },
    {
      "name": "Get Logs",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/api/logs?limit=50"
      }
    }
  ],
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:3000"
    }
  ]
}
```

2. Set environment variable `base_url` to your API URL

### Using HTTPie

```bash
# Install HTTPie
pip install httpie

# Get statistics
http GET localhost:3000/api/stats

# Trigger hunt
http POST localhost:3000/api/hunt

# Get pending
http GET localhost:3000/api/scholarships/pending limit==5
```

## Monitoring

### Prometheus Metrics (Future)

```
# HELP scholarships_total Total number of scholarships
# TYPE scholarships_total counter
scholarships_total 150

# HELP scholarships_posted Number of posted scholarships
# TYPE scholarships_posted counter
scholarships_posted 45

# HELP api_requests_total Total API requests
# TYPE api_requests_total counter
api_requests_total{endpoint="/api/stats",method="GET"} 100
```

---

**For more information, see the main [README.md](./README.md)**
