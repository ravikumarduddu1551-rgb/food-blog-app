# Food Blog

A React and Vite frontend with an Express, MongoDB, and Mongoose API.

## Requirements

- Node.js 20.19 or newer
- MongoDB connection string

## Configure the backend

Create `backend/.env` with the following values:

```dotenv
CONNECTION_STRING=mongodb://127.0.0.1:27017/food-blog
SECRET_KEY=replace-with-a-long-random-secret
PORT=5000
```

Keep real credentials out of source control. Uploaded recipe images are stored under `backend/public/images`.

## Run locally

In one terminal:

```powershell
cd backend
npm install
npm run dev
```

In a second terminal:

```powershell
cd frontend/food-blog-app
npm install
npm run dev
```

Open the Vite URL shown in the frontend terminal. The Vite dev and preview servers proxy API and image requests to `http://localhost:5000`. To use a different backend origin, set `VITE_API_URL` in the frontend environment.

## Checks

```powershell
cd frontend/food-blog-app
npm run lint
npm run build

cd ../../backend
npm run check
```
