# 📡 SmartReq API Documentation

## Overview

Submit a candidate's parsed CV (already converted to text in React) to trigger the SmartReq evaluation pipeline.

---

## 🔗 Endpoint

```http
POST https://primary-production-6beb.up.railway.app/webhook/smartreq
```

**Content-Type:** `application/json`

---

## 📋 Request Body

### Required Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ | Candidate's full name |
| `phone_number` | string | ✅ | Candidate's contact number |
| `email` | string | ✅ | Candidate's email address (unique ID) |
| `cv` | string | ✅ | Plain text version of the candidate's CV (parsed client-side) |
| `job_offer` | object | ✅ | Job offer definition (see schema below) |
| `linkedin` | string | ❌ | Optional — LinkedIn PDF text or profile URL |

---

## 🧩 Job Offer Object Schema

```json
{
  "id": "ios_engineer_2025_09",
  "title": "iOS Engineer (SwiftUI)",
  "description": "We are seeking an iOS Engineer experienced with SwiftUI and CoreData to join our mobile team.",
  "company_id": "00000000-0000-0000-0000-000000000000",
  "scoring_scale": "1–5",
  "rubric": "1=Insufficient | 2=Basic | 3=Solid | 4=Strong | 5=Exceptional",
  "eligibility_filters": ["Canada-based", "21+", "SwiftUI experience required"],
  "weights": {
    "professional_experience": 0.30,
    "technical_skills": 0.35,
    "motivation": 0.15,
    "education_learning": 0.10,
    "soft_skills_behavioral": 0.10
  },
  "created_at": "2025-10-25T10:00:00Z",
  "updated_at": "2025-10-25T10:00:00Z"
}
```

---

## 📝 Examples

### Request Example

```json
{
  "name": "Caio Agra Lemos",
  "phone_number": "+39 333 123 4567",
  "email": "caio@example.com",
  "cv": "Experienced iOS Engineer with 3+ years using SwiftUI. Led migration of 3 apps to SwiftUI...",
  "linkedin": "Motivated iOS developer with background in design and XR projects...",
  "job_offer": {
    "id": "ios_engineer_2025_09",
    "title": "iOS Engineer (SwiftUI)",
    "description": "We are seeking an iOS Engineer experienced with SwiftUI and CoreData to join our mobile team.",
    "company_id": "00000000-0000-0000-0000-000000000000",
    "scoring_scale": "1–5",
    "rubric": "1=Insufficient | 2=Basic | 3=Solid | 4=Strong | 5=Exceptional",
    "eligibility_filters": ["Canada-based", "21+", "SwiftUI experience required"],
    "weights": {
      "professional_experience": 0.3,
      "technical_skills": 0.35,
      "motivation": 0.15,
      "education_learning": 0.1,
      "soft_skills_behavioral": 0.1
    },
    "created_at": "2025-10-25T10:00:00Z",
    "updated_at": "2025-10-25T10:00:00Z"
  }
}
```

### Success Response (200)

```json
{
  "ok": true,
  "candidate_id": "caio@example.com",
  "evaluation_id": "3a94d60c-7b59-4e16-b3a5-12a532c93f4b",
  "received": {
    "cv": true,
    "linkedin": true
  },
  "next": "We'll send 0–2 clarifying questions if needed."
}
```

### Error Responses

| Code | Meaning | Example Response |
|------|---------|------------------|
| 400 | Missing required fields | `{"error": "cv is required"}` |
| 422 | Invalid job offer structure | `{"error": "weights must sum to 1.0"}` |
| 500 | Internal error | `{"error": "Evaluation pipeline failed to start"}` |

---

## 💻 Code Examples

### JavaScript/React

```javascript
await fetch("https://primary-production-6beb.up.railway.app/webhook/smartreq", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Caio Agra Lemos",
    phone_number: "+39 333 123 4567",
    email: "caio@example.com",
    cv: parsedCvText, // result from pdfjs
    job_offer: jobOfferObject,
    linkedin: linkedinText || null
  })
});
```

### cURL

```bash
curl -X POST https://primary-production-6beb.up.railway.app/webhook/smartreq \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Caio Agra Lemos",
    "phone_number": "+39 333 123 4567",
    "email": "caio@example.com",
    "cv": "Experienced iOS Engineer...",
    "linkedin": "Motivated iOS developer...",
    "job_offer": {
      "id": "ios_engineer_2025_09",
      "title": "iOS Engineer (SwiftUI)",
      "description": "We are seeking an iOS Engineer...",
      "company_id": "00000000-0000-0000-0000-000000000000",
      "scoring_scale": "1–5",
      "rubric": "1=Insufficient | 2=Basic | 3=Solid | 4=Strong | 5=Exceptional",
      "eligibility_filters": ["Canada-based", "21+", "SwiftUI experience required"],
      "weights": {
        "professional_experience": 0.3,
        "technical_skills": 0.35,
        "motivation": 0.15,
        "education_learning": 0.1,
        "soft_skills_behavioral": 0.1
      },
      "created_at": "2025-10-25T10:00:00Z",
      "updated_at": "2025-10-25T10:00:00Z"
    }
  }'
```

---

## 📌 Important Notes

- **Plain Text Only**: `cv` and `linkedin` must be plain text, not PDF binaries
- **Weights Validation**: `job_offer.weights` must sum to 1.0
- **Size Limit**: Expected request size < 2 MB (keep PDFs parsed client-side)
- **Unique Identifier**: `email` is used as the candidate's unique ID
- **Evaluation ID**: The returned `evaluation_id` can be used later to check status or retrieve results
- **LinkedIn Support**: If the candidate uploads a LinkedIn PDF, parse it client-side and send its text in the `linkedin` field
