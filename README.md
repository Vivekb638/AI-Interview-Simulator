# AI Interview Simulator

An AI-powered interview practice platform that helps candidates prepare
for technical and behavioral interviews. Users can practice interview
questions, submit answers, and review feedback to improve their
confidence and interview performance.

## Features

-   **Interview practice:** Prepare for technical and behavioral
    interview questions.
-   **AI-assisted feedback:** Review answers and identify areas for
    improvement, depending on the configured AI integration.
-   **Progress-focused learning:** Use feedback to improve answer
    structure, clarity, and technical accuracy.
-   **Web-based experience:** Access the platform through a React
    frontend.
-   **Backend API:** Node.js and Express handle server-side logic and
    API requests.
-   **Database integration:** Supabase provides the database layer.

> Update this section to match the features currently implemented in
> your version of the project.

## Tech Stack

  -----------------------------------------------------------------------
  Layer                               Technologies
  ----------------------------------- -----------------------------------
  Frontend                            React, JavaScript, Vite (if
                                      configured)

  Backend                             Node.js, Express.js

  Database                            Supabase

  Deployment                          AWS S3 and CloudFront for the
                                      frontend; backend hosted separately
                                      (for example, Elastic Beanstalk or
                                      EC2)
  -----------------------------------------------------------------------

## Architecture

``` text
Candidate
   |
   v
React Frontend
(AWS S3 + CloudFront)
   |
   v
Express.js REST API
   |
   +------> Supabase Database
   |
   +------> AI Provider (if configured)
```

The frontend communicates with the Express API. The backend manages
application logic and database access, and can call an AI provider if
that integration is configured.

## Project Structure

Your exact folder names may differ. A common layout is:

``` text
ai-interview-simulator/
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── .env.example
├── backend/
│   ├── src/
│   ├── package.json
│   └── .env.example
├── .gitignore
└── README.md
```

## Prerequisites

Install the following before running the project:

-   Node.js and npm
-   A Supabase project
-   API credentials for an AI provider, if AI feedback is enabled
-   Git (optional, for cloning the repository)

## Getting Started

### 1. Clone the repository

Replace the placeholder with your repository URL.

``` bash
git clone <YOUR_REPOSITORY_URL>
cd ai-interview-simulator
```

### 2. Configure the backend

``` bash
cd backend
npm install
```

Create a `.env` file in the backend directory using the variables
required by your implementation. For example:

``` env
PORT=5000
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_server_side_supabase_key
AI_API_KEY=your_ai_provider_api_key
```

Only include variables that your code actually uses. Keep secret keys on
the server; **never expose a Supabase service-role key or private AI API
key in frontend code or commit them to Git**.

Start the backend using the script defined in `backend/package.json`. If
it provides a `dev` script, run:

``` bash
npm run dev
```

If no `dev` script exists, use the script that is actually defined in
your package file, such as `npm start`.

### 3. Configure the frontend

Open a second terminal:

``` bash
cd frontend
npm install
```

Create a frontend `.env` file with the API URL expected by your
application. For a Vite app, it may look like:

``` env
VITE_API_BASE_URL=http://localhost:5000
```

Use the exact variable name referenced in your frontend code. Vite
exposes variables prefixed with `VITE_` to browser code, so **do not put
private secrets in frontend environment variables**.

Start the frontend:

``` bash
npm run dev
```

Open the local URL printed by Vite in your terminal.

## Supabase Setup

1.  Create a project in Supabase.
2.  Create the tables required by the application (for example, users,
    interview sessions, questions, answers, or feedback, if your
    implementation uses them).
3.  Add the project URL and the appropriate key to the backend
    environment.
4.  Configure Row Level Security (RLS) and policies according to your
    authentication and data-access design.
5.  Never commit credentials or production data to the repository.

The table names and schema must match the queries used by your backend.

## API Documentation

Document the routes implemented in your backend here. Example format:

  -----------------------------------------------------------------------
  Method                  Endpoint                Purpose
  ----------------------- ----------------------- -----------------------
  `GET`                   `/api/health`           Health check, if
                                                  implemented

  `POST`                  `/api/interviews`       Create an interview
                                                  session, if implemented

  `POST`                  `/api/answers`          Submit an answer, if
                                                  implemented

  `GET`                   `/api/feedback/:id`     Retrieve feedback, if
                                                  implemented
  -----------------------------------------------------------------------

These are illustrative examples, not a claim that these routes already
exist. Replace them with your actual API endpoints.

## Deployment

### Frontend: AWS S3 + CloudFront

1.  Build the frontend using the command supported by your package
    scripts, commonly:

    ``` bash
    npm run build
    ```

2.  Upload the generated build output (commonly `dist/` for Vite) to an
    S3 bucket configured for static hosting or private origin access.

3.  Configure CloudFront to serve the frontend and use the correct
    origin-access configuration.

4.  Set the production API URL in the frontend environment before
    building.

5.  Invalidate the CloudFront cache after deploying updates when
    necessary.

### Backend

Deploy the Express application to your chosen host, such as AWS Elastic
Beanstalk or EC2.

-   Configure production environment variables securely.
-   Ensure the server listens on the port supplied by the hosting
    environment where applicable.
-   Configure CORS to allow requests from your deployed frontend domain.
-   Use HTTPS and review logs and health checks after deployment.

## Security Notes

-   Keep `.env` files out of version control.
-   Add `.env` and other secret/configuration files to `.gitignore`.
-   Never put private API keys or Supabase service-role keys in frontend
    code.
-   Validate incoming requests and handle errors without leaking
    secrets.
-   Apply appropriate authentication, authorization, and Supabase RLS
    policies.

## Troubleshooting

-   **Frontend cannot reach the API:** Check the API base URL, backend
    status, and CORS configuration.
-   **Supabase requests fail:** Verify the project URL, key type, table
    names, and RLS policies.
-   **Environment variables appear undefined:** Confirm the variable
    names and restart the development server after changing `.env`.
-   **CloudFront shows an old build:** Invalidate the relevant cache and
    confirm the latest build was uploaded.
-   **S3 returns `AccessDenied`:** Review bucket permissions, CloudFront
    origin access, and the bucket/origin configuration. Avoid making a
    private bucket public just to bypass the error.

## Contributing

1.  Fork the repository or create a feature branch.
2.  Make your changes and test them locally.
3.  Keep credentials and personal data out of commits.
4.  Submit a pull request with a clear description of the changes.

## License

No license has been specified yet. Add a `LICENSE` file and update this
section before distributing the project.

## Author

Vineet Baghel
