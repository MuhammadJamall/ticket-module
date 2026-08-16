Deployment Guide
This document outlines the steps and configurations required to move the Ticket Management Module from local development to a production environment.

1. Running the FastAPI Application
In development, the app uses uvicorn app.main:app --reload. The --reload flag is strictly for development as it watches for file changes and restarts the server, which consumes extra CPU and is not designed for high concurrency.

Production Command:We use Gunicorn as a process manager to run Uvicorn workers. This allows the application to handle multiple requests concurrently across different CPU cores.

gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000
-w 4: Runs 4 worker processes.
-k uvicorn.workers.UvicornWorker: Tells Gunicorn to use ASGI workers for FastAPI.
2. Secrets Management
No secrets (DB credentials, JWT secrets) are hardcoded in the repository.

All sensitive data is loaded dynamically via Environment Variables using pydantic-settings (app/core/config.py).
When deploying to platforms like AWS, Render, or Heroku, these variables must be set in the platform's dashboard/settings UI, NOT in a committed .env file.

3. Disabling Interactive Docs
FastAPI automatically generates Swagger UI at /docs and ReDoc at /redoc.
Exposing API documentation in production is a security risk. The application checks the ENVIRONMENT variable and disables these routes if the environment is set to "production".

4. CORS Configuration
Cross-Origin Resource Sharing (CORS) is configured to restrict which domains can access the API.
While development allows localhost, the production .env or hosting platform environment variable must be updated to only allow the real frontend domain:
ALLOWED_ORIGINS=["https://www.yourproductiondomain.com"]

5. Health Check Endpoint
A lightweight endpoint has been added for uptime monitoring and load balancers.

Endpoint: GET /health
Response: {"status": "ok"} with HTTP 200 status code.
Cloud providers (e.g., AWS ALB) can ping this endpoint every 10 seconds to ensure the server process is alive without triggering database queries.
6. Database Migration: Local to Managed MySQL
Moving from a local MySQL instance to a managed cloud database (e.g., AWS RDS, PlanetScale) requires three major changes:

Connection String Format: The DATABASE_URL will point to the remote host instead of localhost.
mysql+pymysql://user:password@remote-host.amazonaws.com:3306/dbname
SSL Requirement: Managed databases enforce SSL/TLS to encrypt data in transit. The connection string must include SSL parameters:
mysql+pymysql://user:password@remote-host/dbname?ssl=true
IP Allowlisting: Managed databases have firewalls. The backend server's IP address must be explicitly added to the database's Security Group / IP Allowlist. Without this, the backend server will receive a "Connection Timed Out" error when trying to connect.