# 3-Tier Architecture in Node.js (Controller-Service-Route)

**Interview Question:** Why do we separate our logic into `routes`, `controllers`, and `services` instead of writing everything inside the route definition in `server.ts`?

## 1. The Route Layer (The Receptionist)
Its *only* job is to map an incoming HTTP URL (like `POST /api/interviews`) to a specific controller function. It does not process data or contain any business logic.

## 2. The Controller Layer (The Manager)
Its job is to handle the HTTP Request (`req`) and Response (`res`). 
- It extracts the data (e.g., pulling parameters from the URL or data from the body).
- It calls the Service layer to do the actual work.
- It sends the final HTTP response (e.g., `200 OK` or `500 Internal Server Error`) back to the client.

## 3. The Service Layer (The Worker / Business Logic)
This is where the actual code lives! This layer talks to MongoDB, calls the Gemini API, and processes the AI response. 

**Crucially, the Service layer should know nothing about HTTP, `req`, or `res`.**

### Why is this crucial? (The Interview "Gotcha")
True reusability. Suppose tomorrow we decide to add a CLI (Command Line Interface) or a background cron job to our platform. If our business logic is tied to an HTTP `req` object inside a Route, our CLI cannot use it! By keeping the logic in a pure Service function, both our Express HTTP Controller and our CLI can call the exact same function.
