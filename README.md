# growthx Assignment

Simple Assignment Submission portal API

## Run locally

> NOTE: Node.js and Mongodb URI is required to run this application

```bash
# Setup env vars
cp .env.example .env

# Build and run application
npm install
npm run build
npm start

# Run application in dev mode
npm run dev
```

## API endpoints

- Auth

  - POST /register
    - Register new admin/user
  - POST /login
    - Login admin/user
  - POST /logout
    - Logout admin/user

- User

  - POST /upload
    - Upload Assignment
  - GET /admins
    - Fetch all admins

- Admin

  - GET /assignments
    - View assignments tagged to the admin
  - POST /assignments/:id/accept
    - Accept an assignment
  - POST /assignments/:id/reject
    - Reject an assignment
