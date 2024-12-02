"use client";

import React, { useState, useRef } from "react"; // Added useRef
import { useForm, SubmitHandler } from "react-hook-form";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "@/app/firebase";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


// Define the form data type
interface IFormInput {
  name: string;
  email: string;
  password: string;
  role: string;
  start_location: string;
  end_location: string;
  image?: string; // Add image field to form input
}

interface AddUserProps {
  setOpen: (data: boolean) => void;
}


const AddUsers = ({ setOpen }: AddUserProps) => {
  const {
    register,
    reset,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IFormInput>();

  const [uploading, setUploading] = useState(false); // Initialize uploading state

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const notifySuccess = () => {
    toast.success("user Added successfully!", {
      position: "top-right",
      autoClose: 1000,
    });
  
    setTimeout(() => {
      setUploading(false)
      setOpen(false);
    }, 1000); 
  };
  const notifyError = () => {
    toast.error("Failed to add the user.", {
      position: "top-right",
      autoClose: 1000,
    });
  
    setTimeout(() => {
      setUploading(false)
    }, 1000); 
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = await uploadImageToCloud(file);
      setValue("image", imageUrl); // Update form value with the image URL
    }
  };

  const uploadImageToCloud = async (file: File): Promise<string> => {
    const storage = getStorage(app);
    const storageRef = ref(storage, file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Error during upload:", error);
          reject(error);
        },
        async () => {
          try {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            setUploadProgress(null);
            resolve(url);
          } catch (err) {
            console.error("Error getting download URL:", err);
            reject(err);
          }
        }
      );
    });
  };
  // Function to handle form submission
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    console.log("Form data", data);

    setUploading(true); // Start uploading state
    try {
      const response = await fetch(
        "https://cofeetracebackend-2.onrender.com/api/v0/user/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        console.log(response)
        notifySuccess();
      } else {
        notifyError();
      }
    } catch (error) {
      console.error("Error adding the product:", error);
      notifyError();
    }
  };

  return (
    <div className="flex flex-col gap-2 bg-white p-3 border-2 rounded-xl">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Name Field */}
        <div className="flex flex-col gap-2">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            {...register("name", { required: "Name is required" })}
            className="p-2 border-2 border-gray-200 rounded-md outline-none"
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        {/* Email Field */}
        <div className="flex flex-col gap-2">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            {...register("email", { required: "Email is required" })}
            className="p-2 border-2 border-gray-200 rounded-md outline-none"
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-2">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            {...register("password", { required: "Password is required" })}
            className="p-2 border-2 border-gray-200 rounded-md outline-none"
          />
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium">
            Image <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            ref={fileInputRef}
            className="mt-1 block w-full text-sm p-4 border-2 border-gray-200 rounded-md outline-none text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-palette-primary-main hover:file:bg-violet-100"
            onChange={handleFileChange}
          />
          {uploadProgress !== null && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 mb-5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
              <p className="text-sm mt-1">
                {Math.round(uploadProgress)}% uploaded
              </p>
            </div>
          )}
          {errors.image && (
            <p className="text-red-500 text-sm mt-1">
              {errors.image.message}
            </p>
          )}
        </div>

        {/* Role Selection */}
        <div className="flex flex-col gap-2">
          <label htmlFor="role">Role</label>
          <select
            {...register("role", { required: "Role is required" })}
            className="p-2 border-2 border-gray-200 rounded-md outline-none"
          >
            <option value="admin">Admin</option>
            <option value="Farmer">Farmer</option>
            <option value="merchant">Buyer</option>
            <option value="driver">Transporter</option>
          </select>
          {errors.role && <p className="text-red-500">{errors.role.message}</p>}
        </div>

        {/* Start and End Locations */}
        <div className="flex gap-2 md:flex-row flex-col">
          <div className="flex flex-col w-full gap-2">
            <label htmlFor="start_location">Start Location</label>
            <input
              type="text"
              id="start_location"
              {...register("start_location", {
                required: "Start Location is required",
              })}
              className="p-2 border-2 border-gray-200 rounded-md outline-none"
            />
            {errors.start_location && (
              <p className="text-red-500">{errors.start_location.message}</p>
            )}
          </div>
          <div className="flex flex-col w-full gap-2">
            <label htmlFor="end_location">End Location</label>
            <input
              type="text"
              id="end_location"
              {...register("end_location", {
                required: "End Location is required",
              })}
              className="p-2 border-2 border-gray-200 rounded-md outline-none"
            />
            {errors.end_location && (
              <p className="text-red-500">{errors.end_location.message}</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-2 mt-4">
          <input
            type="submit"
            value={uploading ? "Uploading..." : "Add User"}
            disabled={uploading}
            className="w-full p-2 border-2 bg-[#A67B5B] text-white border-gray-200 rounded-md outline-none text-center"
          />
        </div>
      </form>
      <ToastContainer/>
    </div>
  );
};

export default AddUsers;
