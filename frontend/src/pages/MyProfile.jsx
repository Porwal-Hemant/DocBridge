import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaPhoneAlt, FaEnvelope, FaHome, FaUserEdit } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";



const MyProfile = () => {
  const {token, setToken , backendUrl, userData, setUserData, loadUserProfileData } = useContext(AppContext);
  const navigate = useNavigate(); //  Call here at the top level
// const handleDeleteID = async () => {
//   if (!userData?.email) return toast.error("No user email found");

//   if (!window.confirm("Are you sure you want to delete this user?")) return;

//   try {
//     const { data } = await axios.delete(`${backendUrl}/api/user/deleteUserByEmail/${userData.email}`, {
//       headers: { token },
//     });

//     if (data.success) {
//       toast.success(data.message);
//       localStorage.removeItem("token"); // Clear token from local storage
//       setUserData(null); // Optional: Clear local user data
//     } else {
//       toast.error(data.message);
//     }
//   } catch (error) {
//     toast.error("Failed to delete user");
//     console.log(error);
//   }
// };


const handleDeleteID = async () => {


  if (!userData?.email) return toast.error("No user email found");

  if (!window.confirm("Are you sure you want to delete this user?")) return;

  try {
    const { data } = await axios.delete(`${backendUrl}/api/user/deleteUserByEmail/${userData.email}`, {
      headers: { token },
    });

    if (data.success) {
      toast.success(data.message);

      // Remove token & user data
      localStorage.removeItem("token");
      setToken(null);
      setUserData(null);

      // Redirect to login
      navigate("/login");
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error("Failed to delete user");
    console.log(error);
  }
};

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);

  // setUserData ->   using setUserData to reflect the current edits in the UI immediately while the user is typing. This is local state — a temporary staging area. 
  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();
      // we are storing userData ( updated userData with the help of setUserData stored in local storage )
      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("address", JSON.stringify(userData.address));
      formData.append("gender", userData.gender);
      formData.append("dob", userData.dob);

      if (image) formData.append("image", image);

      const { data } = await axios.post(`${backendUrl}/api/user/update-profile`, formData, {
        headers: { token },
      });

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  return userData ? (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-2xl mx-auto mt-10 p-6 rounded-2xl shadow-2xl bg-gradient-to-br from-white via-purple-50 to-pink-100"
    >
      {/* Profile Picture */}
      <div className="flex flex-col items-center gap-3">
        {isEdit ? (
          <motion.label htmlFor="image" whileHover={{ scale: 1.05 }} className="relative w-fit cursor-pointer">
            <img
              className="w-36 h-36 object-cover rounded-full shadow-lg"
              src={image ? URL.createObjectURL(image) : userData.image}
              alt="User"
            />
            {!image && (
              <div className="absolute bottom-2 right-2 bg-white p-1 rounded-full shadow">
                <FaUserEdit className="text-purple-600" />
              </div>
            )}
            <input
              onChange={(e) => setImage(e.target.files[0])}
              type="file"
              id="image"
              hidden
              accept="image/*"
            />
          </motion.label>
        ) : (
          <img
            className="w-36 h-36 object-cover rounded-full shadow-xl"
            src={userData.image}
            alt="User"
          />
        )}
      </div>

      {/* Name */}
      <div className="text-center mt-4">
        {isEdit ? (
          <input
            className="bg-gray-100 text-2xl font-bold text-center py-2 px-4 rounded-md"
            type="text"
            value={userData.name}
            onChange={(e) => setUserData((prev) => ({ ...prev, name: e.target.value }))}
          />
        ) : (
          <h2 className="text-3xl font-semibold text-gray-800">{userData.name}</h2>
        )}
      </div>

      <hr className="my-6 border-gray-300" />

      {/* Contact Info */}
      <div className="space-y-5">
        <h3 className="text-lg font-semibold text-purple-700 underline">Contact Information</h3>
        <div className="flex items-center gap-2 text-gray-700">
          <FaEnvelope />
          <span className="text-blue-600">{userData.email}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <FaPhoneAlt />
          {isEdit ? (
            <input
              className="bg-gray-100 px-2 py-1 rounded w-full max-w-xs"
              type="text"
              value={userData.phone}
              onChange={(e) => setUserData((prev) => ({ ...prev, phone: e.target.value }))}
            />
          ) : (
            <span>{userData.phone}</span>
          )}
        </div>
        <div className="flex items-start gap-2 text-gray-700">
          <FaHome className="mt-1" />
          {isEdit ? (
            <div className="flex flex-col gap-2">
              <input
                className="bg-gray-100 px-2 py-1 rounded"
                type="text"
                value={userData.address.line1}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))
                }
              />
              <input
                className="bg-gray-100 px-2 py-1 rounded"
                type="text"
                value={userData.address.line2}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))
                }
              />
            </div>
          ) : (
            <span>
              {userData.address.line1} <br /> {userData.address.line2}
            </span>
          )}
        </div>
      </div>

      <hr className="my-6 border-gray-300" />

      {/* Basic Info */}
      <div className="space-y-5">
        <h3 className="text-lg font-semibold text-purple-700 underline">Basic Information</h3>
        <div className="flex items-center gap-2 text-gray-700">
          <p className="font-medium w-24">Gender:</p>
          {isEdit ? (
            <select
              className="bg-gray-100 px-3 py-1 rounded"
              value={userData.gender}
              onChange={(e) => setUserData((prev) => ({ ...prev, gender: e.target.value }))}
            >
              <option value="Not Selected">Not Selected</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          ) : (
            <span>{userData.gender}</span>
          )}
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <p className="font-medium w-24">Birthday:</p>
          {isEdit ? (
            <input
              type="date"
              className="bg-gray-100 px-3 py-1 rounded"
              value={userData.dob}
              onChange={(e) => setUserData((prev) => ({ ...prev, dob: e.target.value }))}
            />
          ) : (
            <span>{userData.dob}</span>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-8 text-center">
        {isEdit ? (
          <button
            onClick={updateUserProfileData}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-2 rounded-full shadow-lg hover:from-pink-600 hover:to-purple-600 transition-all"
          >
            Save Information
          </button>
        ) : (
          <button
            onClick={() => setIsEdit(true)}
            className="border border-purple-500 text-purple-700 px-8 py-2 rounded-full hover:bg-purple-600 hover:text-white transition-all"
          >
            Edit
          </button>
        )}

        <button
          onClick={handleDeleteID}
          className="mt-4 bg-red-500 text-white px-6 py-2 rounded-full shadow hover:bg-red-600 transition-all"
        >
          Delete ID
        </button>

      </div>

    </motion.div>
  ) : null;
};

export default MyProfile;
