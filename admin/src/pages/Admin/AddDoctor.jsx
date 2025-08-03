import React, { useContext, useState } from 'react';
import { assets } from '../../assets/assets';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AdminContext } from '../../context/AdminContext';

const AddDoctor = () => {
  const [docImg, setDocImg] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [experience, setExperience] = useState('1 Year');
  const [fees, setFees] = useState('');
  const [about, setAbout] = useState('');
  const [speciality, setSpeciality] = useState('General physician');
  const [degree, setDegree] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { aToken } = useContext(AdminContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (!docImg) return toast.error('Image Not Selected');

      const formData = new FormData();
      formData.append('image', docImg);
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('experience', experience);
      formData.append('fees', Number(fees));
      formData.append('about', about);
      formData.append('speciality', speciality);
      formData.append('degree', degree);
      formData.append('address', JSON.stringify({ line1: address1, line2: address2 }));

        // code from adminContext for reference 
        // const [aToken, setAToken] = useState(
        //     localStorage.getItem("aToken") ? localStorage.getItem("aToken") : ""
        // );

        // if it is in the local storage than we can get aToken from adminContext   
      const { data } = await axios.post(`${backendUrl}/api/admin/add-doctor`, formData, {
        headers: { aToken },
      });


      if (data.success) {
        toast.success(data.message);
        setDocImg(false);
        setName('');
        setEmail('');
        setPassword('');
        setExperience('1 Year');
        setFees('');
        setAbout('');
        setSpeciality('General physician');
        setDegree('');
        setAddress1('');
        setAddress2('');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-purple-100 to-pink-100 flex items-center justify-center p-4">
      <form
        onSubmit={onSubmitHandler}
        className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl p-10 space-y-6"
      >
        <div className="flex flex-col items-center">
          <label htmlFor="doc-img" className="cursor-pointer group">
            {/* Clicking on the image (inside the label) will trigger the hidden file input. */}
            <img
              src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
              alt="Doctor"
              className="w-24 h-24 rounded-full object-cover border-4 border-purple-300 shadow-md transition-transform group-hover:scale-105"
            />
          </label>
          <input
            onChange={(e) => setDocImg(e.target.files[0])}
            type="file"
            id="doc-img"
            hidden
          />
          <p className="text-xs mt-2 text-gray-500">Click to upload doctor image</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            { label: 'Your Name', value: name, onChange: setName, type: 'text', placeholder: 'Name' },
            { label: 'Doctor Email', value: email, onChange: setEmail, type: 'email', placeholder: 'Email' },
            { label: 'Set Password', value: password, onChange: setPassword, type: 'password', placeholder: 'Password' },
            { label: 'Fees', value: fees, onChange: setFees, type: 'number', placeholder: 'Doctor fees' },
            { label: 'Degree', value: degree, onChange: setDegree, type: 'text', placeholder: 'Degree' },
          ].map((field, i) => (
            <div key={i}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
              <input
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                type={field.type}
                placeholder={field.placeholder}
                required
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-purple-400 outline-none"
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-purple-400 outline-none"
            >
              {['1 Year', '2 Year', '3 Year', '4 Year', '5 Year', '6 Year', '8 Year', '9 Year', '10 Year'].map((exp) => (
                <option key={exp} value={exp}>{exp}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Speciality</label>
            <select
              value={speciality}
              onChange={(e) => setSpeciality(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-purple-400 outline-none"
            >
              {['General physician', 'Gynecologist', 'Dermatologist', 'Pediatricians', 'Neurologist', 'Gastroenterologist'].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              type="text"
              placeholder="Address Line 1"
              className="w-full px-4 py-2 rounded-md border border-gray-300 mb-2 focus:ring-2 focus:ring-purple-400 outline-none"
              required
            />
            <input
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              type="text"
              placeholder="Address Line 2"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-purple-400 outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">About Doctor</label>
          <textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            rows={4}
            placeholder="Write about the doctor..."
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-purple-400 outline-none"
          />
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-purple-600 text-white px-10 py-3 rounded-full text-lg font-semibold shadow-md hover:bg-purple-700 transition-transform transform hover:scale-105"
          >
            Add Doctor
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDoctor;
