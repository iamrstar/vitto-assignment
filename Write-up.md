# Vitto Loan Application Portal - Technical Write-up

**What I Built**
I developed a full-stack Loan Application Portal using Node.js and Express for the backend API, and React (bootstrapped with Vite) for the frontend. The backend connects to a live PostgreSQL database hosted on Neon, utilizing a single `applications` table to manage incoming loan requests. The frontend features two primary screens: a borrower-facing "Apply" page with client-side validation, and an internal "Dashboard" page where operations staff can filter applications, view real-time summary statistics, and update statuses dynamically without page reloads. I paid special attention to matching Vitto's brand aesthetics using pure vanilla CSS to create a clean, responsive, and premium UI.

**Deployment Choices**
- **Frontend**: Deployed on Vercel for its seamless integration with Vite and rapid global edge caching.
- **Backend**: Deployed on Render as a Web Service, providing a reliable free-tier Node environment.
- **Database**: Hosted on Neon Postgres, chosen for its fast serverless capabilities and ease of setup.

**Known Issues**
- The current search functionality relies on client-side filtering. If the database grows to thousands of records, this should be moved to the backend to implement server-side pagination and search to maintain performance.

**What I'd Improve**
Given more time, I would implement robust authentication and authorization (e.g., JWT) to secure the Dashboard and API endpoints from public access. I would also add more comprehensive error handling mechanisms, comprehensive unit testing (e.g., using Jest), and an export-to-CSV feature for the operations team on the dashboard.
