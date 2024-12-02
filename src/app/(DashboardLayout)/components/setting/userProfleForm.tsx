"use client";
import React, { use, useEffect, useRef, useState } from "react";
import { useForm, Controller, SubmitHandler, useWatch } from "react-hook-form";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "@/app/firebase";
import SwitchButton from "./swich";
import { useSession } from "next-auth/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface SettingInputType {
  id?: string;
  name: string;
  email: string;
  password: string;
  role: string;
  phone_number: string;
  address: string;
  image: string;
  order_confirmation: boolean;
  order_status: boolean;
  email_notification: boolean;
}

interface UserProfileFormProps {
  user: SettingInputType;
}

const UserProfileForm: React.FC<UserProfileFormProps> = ({ user }) => {
  const { data: session, status } = useSession();
  console.log("userrrr",user)

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<SettingInputType>({
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
      password: user.password,
      role: user.role || "",
      phone_number: user.phone_number || "",
      address: user.address || "",
      image: user.image || "",
      order_confirmation: user.order_confirmation || false,
      order_status: user.order_status || false,
      email_notification: user.email_notification || false,
    },
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

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
  
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const imageUrl = await uploadImageToCloud(file);
        setValue("image", imageUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };
  const notifySuccess = () => {
    toast.success("Profile updated successfully!", {
      position: "top-right",
      autoClose: 1000,
    });
  };
  const notifyError = () => toast.error("Failed to update.");

  const onSubmit: SubmitHandler<SettingInputType> = async (data) => {
    console.log("Submitted data:", data,session?.accessToken);

    try {
      const response = await fetch(
        "https://cofeetracebackend-2.onrender.com/api/v0/user/updateProfile",
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
          method: "POST",
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        notifySuccess();
      } else {
        notifyError();
      }
    } catch (error) {
      notifyError();
      console.error("Error fetching user data:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2">
          <h1 className="font-semibold text-xl py-4">Edit Profile</h1>
          <div className="p-4 pb-10 flex flex-col gap-3 shadow-md border-2 rounded-md">
            {/* Name Input */}
            <div className="flex flex-col gap-2">
              <label>Your Name</label>
              <input
                type="text"
                defaultValue={user.name}
                {...register("name")}
                className="p-4 border-2 border-gray-200 rounded-md outline-none"
              />
              {errors.name && (
                <p className="text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Image Upload */}
            <div className="flex flex-col gap-2">
              <label>Image</label>
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
            </div>

            {/* Email Input */}
            <div className="flex flex-col gap-2">
              <label>Email</label>
              <input
                type="email"
                defaultValue={user.email}
                {...register("email")}
                className="p-4 border-2 border-gray-200 rounded-md outline-none"
              />
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Phone Input */}
            <div className="flex flex-col gap-2">
              <label>Phone</label>
              <input
                type="text"
                defaultValue={user.phone_number}
                {...register("phone_number")}
                className="p-4 border-2 border-gray-200 rounded-md outline-none"
              />
              {errors.phone_number && (
                <p className="text-red-500">{errors.phone_number.message}</p>
              )}
            </div>

            {/* Address Input */}
            <div className="flex flex-col gap-2">
              <label>Address</label>
              <input
                type="text"
                defaultValue={user.address}
                {...register("address")}
                className="p-4 border-2 border-gray-200 rounded-md outline-none"
              />
              {errors.address && (
                <p className="text-red-500">{errors.address.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col md:w-1/2">
          {/* Notifications Section */}
          <h1 className="font-semibold text-xl py-4">Notifications</h1>
          <div className="flex flex-col gap-3 shadow-md border-2 rounded-md">
            {/* Order Confirmation Switch */}
            <div className="flex w-full justify-between items-center p-4 border-2 border-gray-200 rounded-md">
              <div className="flex flex-col">
                <div className="text-lg">Order Confirmation</div>
                <div>
                  You will receive an email for every order confirmation
                </div>
              </div>
              <div className="w-1/5">
                <Controller
                  name="order_confirmation"
                  control={control}
                  render={({ field }) => (
                    <SwitchButton
                      isOn={user.order_confirmation}
                      onToggle={field.onChange}
                    />
                  )}
                />
              </div>
            </div>

            {/* Order Status Confirmation Switch */}
            <div className="flex w-full justify-between items-center p-4 border-2 border-gray-200 rounded-md">
              <div className="flex flex-col">
                <div className="text-lg">Order Status Confirmation</div>
                <div>
                  You will receive an email for every order status confirmation
                </div>
              </div>
              <div className="w-1/5">
                <Controller
                  name="order_status"
                  control={control}
                  render={({ field }) => (
                    <SwitchButton
                      isOn={user.order_status}
                      onToggle={field.onChange}
                    />
                  )}
                />
              </div>
            </div>

            {/* Email Notification Switch */}
            <div className="flex w-full justify-between items-center p-4 border-2 border-gray-200 rounded-md">
              <div className="flex flex-col">
                <div className="text-lg">Email Notification</div>
                <div>
                  Receive periodic email notifications about our services
                </div>
              </div>
              <div className="w-1/5">
                <Controller
                  name="email_notification"
                  control={control}
                  render={({ field }) => (
                    <SwitchButton
                      isOn={user.email_notification}
                      onToggle={field.onChange}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-5">
        <button
          type="submit"
          className="px-4 py-2 bg-palette-primary-main text-white rounded-md"
        >
          Save Changes
        </button>
        <ToastContainer/>
      </div>
    </form>
  );
};

export default UserProfileForm;
