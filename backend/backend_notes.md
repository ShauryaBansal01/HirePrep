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

---

## Folder Structure Breakdown

When building a scalable Node.js backend, we organize our files into specific folders to maintain clarity and separation of concerns. Here is what each folder in our `src/` directory does:

- `src/routes/`: Contains the Route Layer files. These define the API endpoints (URLs) and point them to the correct controller. (e.g., `authRoutes.ts`, `interviewRoutes.ts`)
- `src/controllers/`: Contains the Controller Layer files. These extract data from the HTTP requests and send the final HTTP responses. (e.g., `authController.ts`, `interviewController.ts`)
- `src/services/`: Contains the Service Layer files. These hold the core business logic, database interactions, and external API calls (like Gemini). (e.g., `authService.ts`, `aiService.ts`, `interviewService.ts`)
- `src/models/`: Contains the Mongoose schemas and TypeScript interfaces that define the shape of our data in the MongoDB database. (e.g., `User.ts`, `Interview.ts`)
- `src/middleware/`: Contains functions that run *before* the controllers. These are the "bouncers" that intercept requests to do things like verify JWT tokens or check permissions. (e.g., `authMiddleware.ts`)
- `src/types/`: Contains custom TypeScript declarations. Used when we need to extend existing libraries (like adding a `user` object to the standard Express Request).
