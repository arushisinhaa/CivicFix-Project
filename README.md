# CivicFix 

**CivicFix** is a civic engagement platform designed to streamline communication between citizens and municipal authorities. It allows individuals to easily report local issues such as potholes, broken streetlights, garbage accumulation, water leakage, and more—right from their devices. By digitizing and centralizing civic complaints, CivicFix promotes transparency, accountability, and faster resolutions.

This platform not only empowers residents to be active participants in city development but also provides administrators with a powerful dashboard to manage, prioritize, and resolve reported issues efficiently. Each report includes descriptions, status updates, timestamps, and images, ensuring clear and continuous communication between the public and the government.

Whether it’s a broken lamp post or a sanitation issue, **CivicFix** is your go-to civic grievance redressal tool.

**Live Demo:** [https://client-frontend-rosy.vercel.app](https://client-frontend-rosy.vercel.app)

---

## Tech Stack

**Frontend:**  
- React.js  
- React Router  
- Tailwind CSS / Custom CSS  
- Axios

**Backend:**  
- Node.js  
- Express.js  
- MongoDB (with Mongoose)  
- Multer (for image uploads)  
- JWT (for authentication)  
- Cloudinary (for image storage, optional)

**Deployment:**  
- Frontend: Vercel 
- Backend: Render 
- Database: MongoDB Atlas

---

## Features

- Report civic issues with images and detailed descriptions  
- Track the status of your submitted issues in real-time  
- View history of all previously reported issues  
- Secure authentication system using JWT  
- Admin dashboard to manage, comment on, and resolve issues  
- Timestamps and logs for every status update  
- Supports image uploads for better context  
- Role-based access: General Users and Admins

---

## Local Setup Instructions

1. Clone the Repository
```
git clone https://github.com/arushisinhaa/CivicFix-Project.git
cd CivicFix-Project

2. Setup Frontend
cd client
npm install
npm run dev   # or npm start

3. Setup Backend
cd server
npm install
npm run dev

4. Configure Environment Variables
Create a .env file inside the server/ directory and add the following:
ADMIN_CREATION_KEY: ""
ATLASDB: ""
JWT_SECRET: ""
MONGO_URI: ""
NODE_ENV: ""
SECRET: ""

Testing Credentials
User Logins:
Email: rohan.verma22@gmail.com
Password: R0han@2025

Email: meera.sharma91@gmail.com
Password: Meer@1234

Admin Login:
Email: arushisinha@gmail.com
Password: 123456

Note:
> On the first attempt, login might not work immediately due to backend cold starts or deployment delays (especially on free-tier hosting platforms like Render).  
> Please refresh the page 2–3 times and then try logging in again.
> Once you log in, give it a few seconds to fetch the data and navigate smoothly.
