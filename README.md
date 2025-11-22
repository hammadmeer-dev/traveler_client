# Traveler – A Social Platform for Travel Enthusiasts

Traveler is a **web-based social platform** designed for travel enthusiasts to **share their experiences, discover destinations, and receive personalized recommendations**. This repository contains the **frontend (client-side)** of the platform, built with **React.js, Vite, and Tailwind CSS** for a fast, responsive, and modern user interface.

Users can post travel stories with images and mapped locations, explore destinations on interactive maps, follow other travelers, like and comment on posts, and earn badges and ranks through gamification.

All **core operations**—such as user authentication, trip storage, AI-powered destination suggestions, route recommendations, and gamification logic—are handled by the backend and AI/ML model engine. The frontend communicates with the backend via secure API routes to provide a complete, interactive travel experience.

Visit Online : [Traveler](https://truetraveler.netlify.app)

---

## Project Overview and Motivation

The goal of the Traveler Management System is to provide a **centralized platform** that combines **AI-powered recommendations, gamification, and social storytelling** for travelers. Traditional travel apps often lack personalization, underutilize gamification, and fail to integrate social features with AI-based suggestions. This platform addresses these gaps, motivating users to explore, share, and interact more effectively.

Key objectives include:  
- Centralized platform for travel story sharing and discovery  
- AI-powered destination suggestions based on user preferences  
- Gamification through badges, ranks, and engagement metrics  
- Map-based exploration using Google Maps API  
- Social interactions through likes, comments, and following  

---

## System Architecture

The platform follows a **MERN + AI architecture**:

- **Frontend:** React.js + Vite + Tailwind CSS  
- **State Management:** Redux Toolkit  
- **Backend:** Node.js + Express.js  
- **Database:** MongoDB  
- **AI Module:** Python (Flask) + Scikit-learn for ML-powered recommendations  
- **Geolocation:** Google Maps API  

### Core Modules

1. **Authentication:** Secure login/signup using JWT  
2. **Travel Stories:** Post images and videos with mapped locations
3. **Travel Journey:** Post journeys using your Experiance And with images and Video And Interact With Other Travelers 
4. **AI Travel Advisor:** ML-powered destination suggestions based on user inputs (district and category)  
5. **Gamification:** Badges and ranks to encourage user engagement  
6. **Social Feed:** Like, comment, and follow system for community interaction  
7. **Notifications:** Real-time alerts for relevant user activity  

---

## Machine Learning Recommendations

The AI Travel Advisor uses a **K-Nearest Neighbors (KNN)** model with **Cosine Similarity** to suggest the top 5 destinations based on user inputs such as district (e.g., Punjab, KPK, Sindh) and category (e.g., Fort, Valley, Museum). Feature engineering includes label encoding of categorical inputs and sentence embeddings for destination descriptions. The model is implemented with **Scikit-learn, Pandas, NumPy, and SentenceTransformer**.

---

**Backend and model engine repositories:**  
[Traveler Backend](https://github.com/hammadmeer-dev/Traveler)  
[Traveler Frontend](https://github.com/hammadmeer-dev/traveler_client)  
[Traveler Model](https://github.com/hammadmeer-dev/Travel-Advisor) — minimal functionality; you can check and contribute.

---

## Project Structure

- **React + Vite** frontend  
- **Tailwind CSS** for UI styling  
- **Axios / Fetch** for API communication  
- Separate backend repository for API, database, authentication, and ML/AI model functionality  

> This repo contains only the client-side code. No database or server logic is stored here.

---

## Requirements

- Node.js (LTS recommended)  
- npm or yarn  
- A running instance of the backend server (from the traveler_backend repository)

---

## How to Install and Run

1. **Clone the repository**
   ```bash
   git clone https://github.com/hammadmeer-dev/traveler_client.git
   cd traveler_client

    Install dependencies

npm install
# or
yarn install

Configure environment variables (optional)
If your backend API URL is different from the default, create a .env file in the root:

VITE_API_BASE_URL=http://localhost:5000/api

Start the development server

    npm run dev
    # or
    yarn dev

    Open in browser
    The app will usually run at http://localhost:5173 (check terminal output).

Recommended Backend Setup

Make sure the Traveler Backend is running so the frontend can connect properly.
Backend repo: Traveler Backend

    Clone backend repository

    Install dependencies

    Start the server (Node.js or via Docker)

    Ensure database is running and API endpoints are accessible

Notes

    This project is frontend-only.

    All database operations, authentication, and AI/ML model computations happen in the backend.

    You can safely develop or deploy the frontend independently, but full functionality requires the backend.

Contributing

    Fork the repository

    Create a new branch: git checkout -b feature/your-feature

    Commit changes: git commit -m "Add your feature"

    Push branch: git push origin feature/your-feature

    Create a Pull Request

License

This project is open-source and available under the MIT License

.
Contact

For questions or suggestions, contact Hammad Farooq Meer.
GitHub: hammadmeer-dev

---

If you want, I can **also create a matching full README** for the **backend repo**, so both repos are perfectly linked and professional-looking.  

Do you want me to do that next?
