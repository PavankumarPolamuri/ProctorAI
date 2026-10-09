# ProctorAI – AI-Powered Online Examination & Proctoring Platform

ProctorAI is an online examination platform that uses AI-assisted monitoring/proctoring to improve exam security and enforce academic integrity in remote learning environments. Built with a modern React frontend and a robust Java Spring Boot backend, the system actively monitors students during exams and automatically flags or submits exams if malpractice is detected.

## 🚀 Deployment Guide (Render)

### Option 1: 1-Click Blueprint Deployment (Recommended)
1. Push this repository to your GitHub account.
2. Go to your [Render Dashboard](https://dashboard.render.com/) and click **New +** -> **Blueprint**.
3. Connect your GitHub repository. Render will automatically detect `render.yaml` and configure both the **Backend Web Service** and **Frontend Static Site**.
4. Once deployed:
   - Copy your **Frontend URL** (e.g. `https://proctorai-frontend.onrender.com`) and set it as `FRONTEND_URL` in the Backend service environment settings.
   - Copy your **Backend URL** (e.g. `https://proctorai-backend.onrender.com`) and set `VITE_API_URL` (`https://<backend-url>/api`) & `VITE_WS_URL` (`https://<backend-url>/ws`) in the Frontend service environment settings.

---

### Option 2: Manual Deployment on Render

#### 1. Backend (Web Service - Docker)
1. In Render Dashboard, click **New +** -> **Web Service**.
2. Connect your repository and select the **Docker** runtime environment.
3. Set **Root Directory** to `backend`.
4. Add the following **Environment Variables**:
   * `PORT`: `8080`
   * `JWT_SECRET`: `your_secure_random_jwt_secret_key` (min 32 chars)
   * `FRONTEND_URL`: `https://your-frontend.onrender.com` (or Vercel URL)
5. Click **Create Web Service**.

#### 2. Frontend (Static Site - Vite/React)
1. In Render Dashboard, click **New +** -> **Static Site**.
2. Connect your repository.
3. Configure the following build settings:
   * **Root Directory:** `frontend`
   * **Build Command:** `npm install && npm run build`
   * **Publish Directory:** `dist`
4. Under **Redirects / Rewrites**, add an SPA rewrite rule:
   * **Source:** `/*`
   * **Destination:** `/index.html`
   * **Action:** Rewrite
5. Add **Environment Variables**:
   * `VITE_API_URL`: `https://your-backend-service.onrender.com/api`
   * `VITE_WS_URL`: `https://your-backend-service.onrender.com/ws`
6. Click **Create Static Site**.

---

## ✨ Key Features

### 🎓 For Students
* **Strict Full-Screen Enforcement:** Exams cannot be taken unless the browser is locked in full-screen mode.
* **Server-Synced Timers:** Real-time countdowns that automatically submit the exam the moment time expires.
* **Dynamic Warning System:** Students receive instant visual popups when they commit a violation, displaying their remaining attempts.
* **Seamless Exam Interface:** An intuitive UI to mark questions for review, clear responses, and navigate easily.

### 👨‍🏫 For Faculty & Proctors
* **Live Global Monitoring:** An administrative dashboard that tracks all active exams and categorizes students by risk level (High/Medium/Low).
* **Real-Time Proctoring Feed:** Uses WebSockets to stream live webcam snapshots and behavioral alerts directly to the admin without refreshing.
* **Auto-Submission on Violations:** If a student switches tabs, attempts to copy-paste, or exits full-screen beyond their allowed threshold, the system instantly flags and auto-submits their exam.
* **Question Bank Management:** Easily create, edit, and organize exam questions.

---

## 🛠️ Technical Architecture

* **Frontend:** React.js, Vite, Tailwind CSS, Axios
* **Backend:** Java, Spring Boot, Spring Security (JWT)
* **Real-Time Communication:** WebSockets (STOMP)
* **Database:** H2 In-Memory Database (for lightning-fast, lightweight storage)
* **Deployment:** Vercel (Frontend) & Render via Docker (Backend)

---

## 💻 Running Locally

To run this project on your local machine:

**1. Start the Backend:**
```bash
cd backend
./mvnw spring-boot:run
```

**2. Start the Frontend:**
```bash
cd frontend
npm install
npm run dev
```

The application will be available at http://localhost:3000.
