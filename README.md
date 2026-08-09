# Full-Stack Calculator

A full-stack calculator built with React, TypeScript, and FastAPI. The frontend communicates with a REST API to perform basic and advanced calculations, with validation and error handling implemented on both sides.

Although the application itself is intentionally simple, I used the project to focus on the kind of structure I would use in a larger application: keeping the UI, API communication, validation, and calculation logic separate, while adding automated tests and CI from the start.

## Features

* Addition, subtraction, multiplication, and division
* Exponentiation, square root, and percentage
* Input validation on both the frontend and backend
* Clear error handling for invalid calculations
* Responsive and keyboard-accessible interface
* Frontend and backend automated tests
* Test coverage reporting
* Docker Compose configuration
* GitHub Actions CI

## Architecture

```text
Browser (React + TypeScript)
        |
        | POST /api/v1/calculations
        v
FastAPI API route
        |
        | validated request
        v
Calculator service
        |
        v
JSON response
```

The React frontend sends calculation requests to the FastAPI backend. The backend validates the request and passes it to a separate calculator service containing the calculation logic.

I kept the calculation logic separate from the API routes so it can be tested independently and extended without changing the HTTP layer.

The frontend application is located in `app/`, while the backend service is located in `backend/app/`.

## Prerequisites

Before running the project locally, make sure you have:

* Node.js 22.13 or newer
* Python 3.11 or newer
* npm
* Optional: Docker Desktop

## Setup

### Frontend

Install the frontend dependencies from the repository root:

```bash
npm install
```

Create the local environment file:

```bash
cp .env.example .env.local
```

### Backend

Create a Python virtual environment:

```bash
cd backend
python3 -m venv .venv
```

Activate it on macOS or Linux:

```bash
source .venv/bin/activate
```

Install the backend dependencies:

```bash
pip install -r requirements-dev.txt
```

Return to the repository root:

```bash
cd ..
```

On Windows PowerShell, the backend virtual environment can be activated with:

```powershell
backend\.venv\Scripts\Activate.ps1
```

## Running the application locally

The frontend and backend run as separate services.

### Start the backend

From the repository root:

```bash
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

The backend will be available at:

```text
http://localhost:8000
```

FastAPI's interactive API documentation is available at:

```text
http://localhost:8000/docs
```

### Start the frontend

Open a second terminal from the repository root and run:

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

The included VS Code task **Run full stack** can also be used to launch both services.

## API usage

The backend exposes a versioned REST API under:

```text
/api/v1
```

### Health check

Request:

```bash
curl http://localhost:8000/health
```

Response:

```json
{
  "status": "ok"
}
```

### Create a calculation

Endpoint:

```text
POST /api/v1/calculations
```

Example request:

```bash
curl -X POST http://localhost:8000/api/v1/calculations \
  -H "Content-Type: application/json" \
  -d '{"operation":"multiply","operands":[6,7]}'
```

Example response:

```json
{
  "operation": "multiply",
  "operands": [6.0, 7.0],
  "result": 42.0,
  "expression": "6 × 7"
}
```

### Supported operations

| Operation     | Operands | Example  |
| ------------- | -------: | -------- |
| `add`         |        2 | `[2, 3]` |
| `subtract`    |        2 | `[9, 4]` |
| `multiply`    |        2 | `[6, 7]` |
| `divide`      |        2 | `[8, 4]` |
| `power`       |        2 | `[2, 3]` |
| `square_root` |        1 | `[81]`   |
| `percentage`  |        1 | `[25]`   |

Invalid calculations return a `422 Unprocessable Entity` response with a clear error message.

For example, dividing by zero returns:

```json
{
  "detail": "Division by zero is not allowed."
}
```

## Testing and coverage

### Frontend tests

Run:

```bash
npm test
```

This prints the frontend coverage summary and generates an HTML report at:

```text
coverage/index.html
```

### Backend tests

Run:

```bash
cd backend
source .venv/bin/activate
pytest
```

### Run all local quality checks

From the repository root:

```bash
npm run lint
npm test
npm run build
cd backend && .venv/bin/pytest
```

Latest verified local results:

| Layer                                   |      Tests | Line coverage |
| --------------------------------------- | ---------: | ------------: |
| Frontend service and validation modules |  6 passing |          100% |
| Backend API and calculation service     | 14 passing |           94% |

Generated coverage files are ignored by Git and recreated when the tests or CI pipeline run.

## Docker

Both services can also be run with Docker Compose.

Build and start the application:

```bash
docker compose up --build
```

The frontend will be available at:

```text
http://localhost:3000
```

Stop and remove the local containers with:

```bash
docker compose down
```

## Design decisions and assumptions

### Single calculation endpoint

I chose to use one versioned `/calculations` endpoint rather than creating a separate endpoint for each arithmetic operation.

The requested operation is included in the request body, which keeps the API small and makes adding new operations straightforward.

### Separate calculation service

I kept the calculation logic outside the FastAPI route handlers.

This means the arithmetic logic can be unit tested without starting the API and keeps the route responsible mainly for receiving, validating, and returning data.

### Validation on both frontend and backend

The frontend validates user input so errors can be shown immediately in the interface.

The backend validates the request independently because API clients can call it without using the React frontend.

The backend therefore remains the final source of validation.

### Error handling

Invalid operations, incorrect operand counts, unsupported values, and cases such as division by zero return clear API errors rather than allowing unexpected exceptions to reach the user.

Invalid calculations return a `422` response.

### Floating-point arithmetic

Standard floating-point arithmetic is sufficient for the purpose of this calculator.

For a financial or payments application, I would instead use decimal values, such as Python's `Decimal`, together with an explicit rounding policy to avoid floating-point precision issues.

### Percentage behaviour

A percentage is converted to its decimal representation.

For example:

```text
25% = 0.25
```

A percentage of another value can then be calculated by combining percentage and multiplication operations.

### Stateless backend

The application does not store calculations because persistence is not required for the current use case.

There is therefore no database, authentication system, or user-specific state.

### CORS

During local development, CORS is restricted to the expected frontend development origins instead of allowing requests from every origin.

## Continuous integration

GitHub Actions runs the project's automated checks on pushes to `main` and on pull requests.

The pipeline runs:

* Frontend linting
* Frontend tests
* Frontend production build
* Backend tests

This provides an additional check that the frontend and backend continue to build and pass their test suites outside the local development environment.

## AI-assisted development

OpenAI Codex was used as a development assistant during this project.

I used it for project scaffolding, implementation suggestions, debugging, testing ideas, and documentation support. I reviewed and adapted the resulting code and verified the final implementation using automated tests, manual API checks, linting, production builds, Docker configuration, and GitHub Actions.

The `.openai/hosting.json` file supports optional deployment tooling used by the frontend scaffold. It contains no application logic, credentials, secrets, or user data.

## Prompts used

Below are representative prompts used during development. They are included to document how AI assistance was used as part of the development workflow.

### Architecture and planning

> Propose a maintainable architecture for a full-stack calculator using a React and TypeScript frontend and a Python FastAPI backend. Include input validation, error handling, testing, and a suggested project structure. Help me break the implementation into manageable development steps.

I used this to help think through the separation between the frontend, API layer, calculation service, validation, and tests.

### Development workflow

> Show me a maintainable VS Code and Git workflow for implementing the backend, tests, frontend, infrastructure, CI, and documentation in focused commits.

I used this as guidance for breaking the work into smaller commits rather than implementing the entire application in one change.

### Backend structure

> Help me structure a FastAPI calculator backend so that the API routes, Pydantic models, and calculation logic are separated. I want the calculation functions to be independently testable.

This helped guide the separation between the HTTP layer and the calculator service.

### Testing

> Suggest unit and API test cases for a calculator that supports addition, subtraction, multiplication, division, exponentiation, square root, and percentage. Include edge cases such as division by zero and invalid operand counts.

I used these suggestions as a starting point and reviewed the test cases against the implemented behaviour.

### Runtime debugging

> The frontend fails because `node:fs/promises` does not provide an export named `glob`. What causes this error and how should it be fixed?

This helped identify that the local Node.js version was incompatible with part of the frontend tooling. I upgraded the runtime to Node.js 22 and reinstalled the dependencies before verifying the application again.

### Continuous integration debugging

> GitHub Actions reports unescaped quotation marks in `app/page.tsx`. How should the issue be corrected and verified locally?

This helped identify a JSX lint issue. I corrected it locally and verified the change using the project's lint command before confirming the CI workflow passed.

### Documentation review

> Review the README for this full-stack calculator. Make sure it clearly explains setup, how to run both services, REST API examples, testing, design decisions, and how AI assistance was used.

I used this to review the final documentation against the assignment requirements.
