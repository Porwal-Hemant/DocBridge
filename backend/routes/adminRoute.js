import express from'express'

import{ addDoctor , allDoctors, loginAdmin , appointmentsAdmin , appointmentCancel , adminDashboard ,  } from '../controllers/adminController.js'
import { changeAvailablity ,  removeDoctor } from '../controllers/doctorController.js';

import upload from '../middleware/multer.js'
import authAdmin from '../middleware/authAdmin.js'
/* 

Imports the upload middleware from the multer.js file inside the middlewares folder.
This middleware is used to handle file uploads.

*/

const adminRouter = express.Router()
adminRouter.post("/login", loginAdmin) 
// No middleware required in this because this will itself will call loginAdmin function in order to create token
 
adminRouter.post("/add-doctor", authAdmin ,  upload.single('image'), addDoctor)
// authAdmin will see atoken verification 
adminRouter.post("/all-doctors", authAdmin ,  allDoctors)
// first we need authentication than only we can add or remove doctors authAdmin is working as a middleware
adminRouter.get("/appointments", authAdmin, appointmentsAdmin)
adminRouter.post("/change-availability", authAdmin, changeAvailablity)
adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel)
adminRouter.get("/dashboard", authAdmin, adminDashboard)
adminRouter.post("/remove-doctor", authAdmin, removeDoctor)
export default adminRouter



/*


Defines a POST route at the path "/add-doctor".
Uses the upload.single('image') middleware to handle a single file upload with the field name 'image'.
Once the image is uploaded, the addDoctor function is called to handle the rest of the logic.


*/
