# DOCBRIDGE

##  Overview

This is a **Full-Stack Doctor Appointment Booking System** built using the **MERN stack**. It includes separate panels for **Admin**, **Doctor**, and **User** roles. The application also features:

- **Razorpay** for payment processing  
- **video call/Message** for personalized interaction 
-  Full **Email verification** for the security of the application

---

##  Tech Stack

- **Frontend:** React (Vite), React Router, Tailwind CSS  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB, Mongoose  
- **Authentication:** JWT, bcrypt  
- **File Uploads:** Multer, Cloudinary  
- **Payments:** Razorpay  
- **Other Integrations:**
  - websockets and webRTC for message and video call

---

##  Folder Structure

```bash
DOCBRIDGE/
├── backend/       # Backend code (Node.js + Express)
├── frontend/      # User interface (React + Tailwind CSS)
└── admin/         # Admin panel frontend


```

---

##  Getting Started

Follow these steps to set up **DOCBRIDGE** locally.


###  1. Clone the Repository

```bash
git clone https://github.com/Porwal-Hemant/DocBridge
cd DOCBRIDGE
```
###  2. Install Dependencies
DOCBRIDGE Booking may have separate folders for backend and frontend ( named **frontend** and **backend** )

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
MONGODB_URI=''
CLOUDINARY_NAME = ''
CLOUDINARY_API_KEY = ''

CLOUDINARY_SECRET_KEY = '' 
# Admin Panel Credentials
ADMIN_EMAIL = "admin@example.com"
ADMIN_PASSWORD = ""

JWT_SECRET = "hemant" 

# Razorpay Payment Integration
CURRENCY ='INR'
RAZORPAY_KEY_ID = 'YOUR_KEY'
RAZORPAY_KEY_SECRET = 'YOUR_KEY_SECRET'
MAILTRAP_TOKEN= YOUR MAILTRAP TOKEN 

STEAM_API_KEY =  NEW STREAM API KEY
STEAM_API_SECRET = NEW STREAM API SECRET KEY 
```

### 4. Start the Backend Server

```bash
cd backend
npm start

```

- The backend will start at: http://localhost:4000



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

##  Screenshots

### 🔹 Home Page ( User Interface ) 
![Home Page](https://github.com/Porwal-Hemant/DocBridge/blob/main/Screenshot%202025-08-03%20161406.png?raw=true)

### 🔹 Home Page ( During speciality selection )
![Home Page](https://github.com/Porwal-Hemant/DocBridge/blob/main/Screenshot%202025-08-03%20161424.png?raw=true)


### 🔹 All Doctors ( User Interface )
![All Doctors](https://github.com/Porwal-Hemant/DocBridge/blob/main/Screenshot%202025-08-03%20161500.png?raw=true)


### 🔹 Contact Details ( User Interface )
![Contact Details](https://github.com/Porwal-Hemant/DocBridge/blob/main/Screenshot%202025-08-03%20161517.png?raw=true)


### 🔹 Admin Home Page
![Admin Home Page](https://github.com/Porwal-Hemant/DocBridge/blob/main/Screenshot%202025-08-03%20161532.png?raw=true)


### 🔹 Admin Appointment Page
![Admin Appointment Page](https://github.com/Porwal-Hemant/DocBridge/blob/main/Screenshot%202025-08-03%20161543.png?raw=true)


### 🔹 Admin Doctor List
![Admin Doctor List](https://github.com/Porwal-Hemant/DocBridge/blob/main/Screenshot%202025-08-03%20161552.png?raw=true)

### 🔹 Doctor Appointment Page
![Doctor Appointment Page](https://github.com/Porwal-Hemant/DocBridge/blob/main/Screenshot%202025-08-03%20161618.png?raw=true)

### 🔹 Message Page
![Message Page](https://github.com/Porwal-Hemant/DocBridge/blob/main/Screenshot%202025-08-05%20195751.png?raw=true)

---

## Connect with Me 

- **Name**: Hemant Porwal  
- **Email**: [hemantporwal2k3@gmail.com](mailto:hemantporwal2k3@gmail.com)  
- **LinkedIn**: [https://www.linkedin.com/in/hemantporwal/](https://www.linkedin.com/in/hemant-porwal-462b1b258/)





