Status Report: Ticket Management Module
1. What was built
Backend: Built a FastAPI REST API with 5 CRUD endpoints for tickets. Integrated Pydantic V2 for validation and SQLAlchemy 2.0 ORM.
RBAC: Implemented Role-Based Access Control. Any authenticated user can view/create. Only the assigned user or admin can update status. Only admin can delete.
Frontend: Built a React (Vite) frontend with Redux Toolkit (ticketsSlice) for state management. Implemented a list page with useMemo filtering, a routed detail page (/tickets/:id), and a create form with validation. Role-based UI hides unauthorized buttons.
Testing: Wrote 6 automated tests (3 backend Pytest, 3 frontend Vitest/RTL) covering API endpoints, RBAC, and component rendering.
Production Setup: Configured Gunicorn/Uvicorn workers, environment variables via pydantic-settings, disabled /docs in prod, restricted CORS, added /health endpoint, and documented hosted MySQL (SSL/IP Allowlisting) in DEPLOYMENT.md.
2. What is not yet done
Real-time WebSocket updates (currently uses manual refresh/polling).
Pagination on the ticket list page (loads all tickets at once).
Frontend is currently hosted separately; Nginx reverse proxy is not yet set up for unified deployment.
3. Known Issues
If the JWT token expires, the user gets a 401 error and has to manually navigate to the login page.
The assigned_to field relies on user IDs; a user-search dropdown is not yet implemented for better UX.
4. Recommendation
Ready to ship? Yes, with caveats.The core functionality is robust, tested, and secure for an MVP. The RBAC and validation are strictly enforced on both frontend and backend. However, before a full public launch, it is recommended to implement pagination and set up a proper Nginx reverse proxy for serving the React dist folder and API on the same domain.