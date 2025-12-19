# EstateHub - Property Management Project
## Tech Stack
### Backend
- **Server:** Node.js, Express.js
- **Database:** MongoDB (with Mongoose)
- **Authentication:** JWT (JSON Web Tokens)
- **Image Upload:** Cloudinary, Multer
### Frontend
- **Framework:** Next.js (React)
- **State Management:** Redux Toolkit
- **Styling:** Tailwind CSS & Shadcn UI
- **API Calls:** Axios
- **Charts:** Recharts
## Project Setup (How to Get Started)
Follow these steps to get the project running on your local machine.
### 1. Backend Setup
First, let's start the backend server.
1.  **Go to the backend folder:**
    ```bash
    cd backend
    ```
2.  **Install packages:**
    ```bash
    npm install
    ```
3.  **Configure the `.env` file:**
    Create a file named `.env` in the `/backend` folder. Copy the code below, paste it into the file, and fill in your own details.
    ```env
    PORT=5000
    DATABASE_URL=your_mongodb_connection_string
    JWT_SECRET=your_super_secret_key
    JWT_EXPIRES_IN=90d
    # Add your Cloudinary details here
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    ```
4.  **Start the server:**
    ```bash
    npm run dev
    ```
    Your backend is now running at `http://localhost:5000`.

### 2. Frontend Setup
Now, open a **new terminal** and start the frontend.
1.  **Go to the frontend folder:**
    ```bash
    cd frontend
    ```
2.  **Install packages:**
    npm install
3.  **Configure the `.env.local` file:**
    Create a file named `.env.local` in the `/frontend` folder and paste the code below.
    ```env
    NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
    ```
4.  **Start the app:**
    ```bash
    npm run dev
    ```
    Your website is now running at `http://localhost:3000`.
## Sample Login (For Testing)
You can use these credentials to test the application.
| Role       | Email                   | Password   |
|------------|-------------------------|------------|
| **Admin**  | `vj123@gmail.com`   | `1234567890` |
| **Employee** | `vjzest9569@gmail.com`| `9569337844` |-Residential
| **Employee** | `codehub933681@gmail.com`| `1234567890` |-Residential


---

## API Routes (Main Endpoints)
All routes start with `/api/v1`.
-   `/auth` - For Login, Signup.
-   `/users` - To manage employees (Admin only).
-   `/properties` - To manage properties (Admin/Employee).
-   `/properties/public` - To display properties on the website.
-   `/inquiries` - For customer inquiries.
-   `/dashboard` - For Admin dashboard data.
