# Why Does React Talk to Express Instead of Calling Gemini Directly?

A common question in system design is: **Why do we make the React Frontend communicate with an Express Backend, which then communicates with the AI model (Gemini), instead of letting React call Gemini directly?**

At first glance, direct communication seems faster because it removes an extra server hop. However, in production systems, the backend serves several critical purposes.

## 1. Security (Most Important Reason)

If the React frontend calls the Gemini API directly, the Gemini API key must be included in the frontend code.

Since React code is sent to the user's browser, anyone can inspect the network requests or source code and steal the API key. A malicious user could then use the key for their own requests, potentially generating a huge bill.

**Rule:** Never expose API keys, database credentials, or any sensitive secrets in the frontend.

The Express backend acts as a secure layer that stores the API key safely on the server.

---

## 2. Rate Limiting and Cost Control

Without a backend, users can send unlimited requests directly to the AI service.

A malicious user could automate thousands of requests per second, leading to excessive costs and potential service abuse.

The backend acts as a gateway and can enforce rules such as:

* Maximum requests per user
* Daily usage limits
* Subscription-based access control
* Request throttling

Example:

```text
User Request
      ↓
Express Backend
      ↓
Check Rate Limit
      ↓
If Allowed → Gemini API
Else → Reject Request
```

---

## 3. Data Persistence and State Synchronization

Applications often need to store user interactions for future use.

For example, in a mock interview platform, we may want to:

* Save interview transcripts
* Track user progress
* Generate performance reports
* Store feedback history

If React communicates directly with Gemini, the backend has no knowledge of the conversation and cannot save this information.

By routing requests through Express:

```text
React Frontend
      ↓
Express Backend
      ├── Save Transcript to MongoDB
      └── Forward Request to Gemini
                ↓
             Response
```

This ensures that application state remains synchronized with the database.

---

## 4. Separation of Concerns

Keeping AI-related business logic inside the backend makes the frontend simpler and easier to maintain.

### Frontend Responsibilities

* User Interface
* Form Handling
* State Management
* Displaying Results

### Backend Responsibilities

* Authentication
* Authorization
* AI Integration
* Database Operations
* Business Logic
* Validation

This separation improves code organization, readability, and maintainability.

---

## 5. Flexibility and Vendor Independence

Suppose the application initially uses Gemini but later switches to OpenAI or Claude.

If the frontend directly calls Gemini, every client application must be updated.

With a backend:

```text
Frontend
    ↓
Backend API
    ↓
Gemini / OpenAI / Claude
```

Only the backend implementation changes, while the frontend remains unchanged.

---

## Interview Answer (Short Version)

We route requests through the Express backend instead of calling Gemini directly because:

1. **Security** – API keys remain hidden on the server.
2. **Rate Limiting & Cost Control** – Prevent abuse and manage AI usage.
3. **Data Persistence** – Save conversations and application data to MongoDB.
4. **Separation of Concerns** – Keep business logic out of the UI layer.
5. **Flexibility** – Easily switch AI providers without changing the frontend.

The most critical reason is **security**, since exposing AI API keys in the frontend is a major production risk.



# Why do we need a services/ folder instead of fetching in useEffect?

**1. The DRY Principle (Don't Repeat Yourself)**
If 5 different pages need to fetch the current user's profile, writing `fetch('/api/user')` 5 times is a nightmare. If the endpoint changes to `/api/v1/user`, you have to find and update it in 5 places. A `services/userService.ts` centralizes this.

**2. Centralized Configuration & Interceptors**
Every request to our Express backend will eventually need an Authentication Token (JWT). If you fetch in the page, you have to manually attach the token to the headers every time. By using a service layer (often powered by axios), we can configure an Interceptor that automatically attaches the token to every outgoing request.

**3. Global Error Handling**
If the backend returns a 401 Unauthorized (meaning the user's login expired), you don't want to write redirect logic in every single component. The service layer can catch all 401 errors globally and redirect the user to the login page automatically.



# How does a Single Page Application (SPA) using React Router differ from a traditional multi-page website (like a PHP or old-school HTML site) when a user clicks a link to go to a new page? What is actually happening under the hood?


The Old Way (MPA - e.g., PHP, Django, old HTML sites): In a traditional application, when a user clicks a link to go to /dashboard, the browser throws away the current page, sends a brand new HTTP GET request to the server, and the server computes and sends back a brand new HTML document. The screen flashes white, the entire DOM is destroyed, and everything is downloaded again (CSS, JS, Header, Footer). This is slow and uses a lot of bandwidth.

The Modern Way (SPA - React, Vue, Angular): React builds a Single Page Application. When the user first visits your website, the server sends exactly one HTML file (index.html) and a massive bundle of JavaScript. When the user clicks the link to go to /dashboard, the browser does not send a new request to the server for a new HTML page. Instead, React intercepts the click, looks at the URL bar, and uses JavaScript to instantly swap out the HomePage component with the DashboardPage component in the DOM. No white screen flash, no full page reload, instant navigation.

React Router's job is simply to sync the browser's URL bar (e.g., /dashboard) with whatever component should be visible on the screen.

