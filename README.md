# HP-DOCTORHUB – Doctor Appointment Booking System

##  Overview

This is a **Full-Stack Doctor Appointment Booking System** built using the **MERN stack**. It includes separate panels for **Admin**, **Doctor**, and **User** roles. The application also features:

- **Razorpay** for payment processing  
- **Google Maps API** for location services  
- An integrated **medical chatbot** for basic health guidance

---

##  Tech Stack

- **Frontend:** React (Vite), React Router, Tailwind CSS  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB, Mongoose  
- **Authentication:** JWT, bcrypt  
- **File Uploads:** Multer, Cloudinary  
- **Payments:** Razorpay  
- **Other Integrations:**
  - Google Maps API  
  - Medical Chatbot (basic)

---

##  Folder Structure

```bash
HP-DOCTORHUB/
├── backend/       # Backend code (Node.js + Express)
├── frontend/      # User interface (React + Tailwind CSS)
└── admin/         # Admin panel frontend


```

---

###  Getting Started

Follow these steps to set up **MediBot** locally.


###  1. Clone the Repository

```bash
git clone https://github.com/Porwal-Hemant/HP-DOCTORHUB.git
cd MedibotBooking
```
###  2. Install Dependencies
MediBot Booking may have separate folders for backend and frontend ( named **frontend** and **backend** )

- Install Backend Dependencies

```bash
cd backend
npm install

```

-  Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

###  3. Configure Environment Variables

- Create a `.env` file inside the **backend** folder and add:

```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### 4. Start the Backend Server

```bash
cd backend
npm start

```

- The backend will start at: http://localhost:5000



### 5. Start the Frontend Server

Open a new terminal:

```bash
cd frontend
npm run dev

```
- The frontend will run at: http://localhost:5173

Admin Panel Setup:
```bash
cd ../admin
npm install   # Install admin panel dependencies
```


---

### Connect with Me 

- **Name**: Hemant Porwal  
- **Email**: [hemantporwal2k3@gmail.com](mailto:hemantporwal2k3@gmail.com)  
- **LinkedIn**: [https://www.linkedin.com/in/hemantporwal/](https://www.linkedin.com/in/hemant-porwal-462b1b258/)

