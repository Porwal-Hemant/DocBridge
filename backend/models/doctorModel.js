import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, required: true },
    speciality: { type: String, required: true },
    degree: { type: String, required: true },
    experience: { type: String, required: true },
    about: { type: String, required: true },
    available: { type: Boolean, default: true },
    fees: { type: Number, required: true },
    slots_booked: { type: Object, default: {} },   // Since it’s an object, it can store multiple slots in a structured way.
    //     // slots_booked = {
    //   "6_4_2025": ["10:00 AM", "10:30 AM", ...]  // Format: day_month_year: [booked_times]
    // }
    /*
    3_2_2025
    Array (1)
    0 
    "12:00 pm"
    */
    address: { type: Object, required: true },
    date: { type: Number, required: true },
}, { minimize: false })

const doctorModel = mongoose.models.doctor || mongoose.model("doctor", doctorSchema);
//in my mongoDB database , doctorSchema will going to be stored in name of doctor ( if it is already created don't need to initialise it again )
export default doctorModel;

