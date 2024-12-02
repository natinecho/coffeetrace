"use client";

import React, { useRef, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useSession } from "next-auth/react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "@/app/firebase";

import { toast,ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { random } from "lodash";


interface IFormInput {
  product_name: string;
  description: string;
  price: number; // Price should be a number (float)
  quantity: number; // Quantity should be a number (float)
  origin: string;
  image_url: string;
  rating: string; // For the uploaded image URL
}

interface AddProductProps {
  setOpen: (data: boolean) => void;
}


const AddProduct  = ({ setOpen }: AddProductProps) => {
  const session = useSession()
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IFormInput>();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const notifySuccess = () => {
    toast.success("Product Added successfully!", {
      position: "top-right",
      autoClose: 1000,
    });
  
    setTimeout(() => {
      setOpen(false);
    }, 1000); 
  };
  const notifyError = () => toast.error("Failed to add the product.");

  // const handleImageClick = () => {
  //   if (fileInputRef.current) {
  //     fileInputRef.current.click();
  //   }
  // };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = await uploadImageToCloud(file);
      setValue("image_url", imageUrl); // Update form value with the image URL
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

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const productData = { 
      ...data, 
      rating: Math.floor(Math.random() * 6)
    };
  
    console.log("Submitted product data", productData);
  
    const accessToken = session?.data?.accessToken;
    try {
      const response = await fetch(
        "https://cofeetracebackend-2.onrender.com/api/v0/product/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(productData), // Send the updated product data
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
    <div className="flex flex-col gap-4 bg-white p-4 w-4/5 sm:w-1/2 md:w-1/3 border-2 rounded-xl">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2">
          <label htmlFor="product_name">Product Name</label>
          <input
            type="text"
            id="product_name"
            {...register("product_name", {
              required: "Product Name is required",
            })}
            className="p-4 border-2 border-gray-200 rounded-md outline-none"
          />
          {errors.product_name && (
            <p className="text-red-500">{errors.product_name.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="origin">Origin</label>
          <input
            type="text" // Ensure this is a number input
            id="origin"
            {...register("origin", {
              required: "origin is required",
            })}
            className="p-4 border-2 border-gray-200 rounded-md outline-none"
          />
          {errors.origin && (
            <p className="text-red-500">{errors.origin.message}</p>
          )}
        </div>

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
          {errors.image_url && (
            <p className="text-red-500 text-sm mt-1">
              {errors.image_url.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            {...register("description", {
              required: "Description is required",
            })}
            className="p-4 border-2 border-gray-200 rounded-md outline-none"
          />
          {errors.description && (
            <p className="text-red-500">{errors.description.message}</p>
          )}
        </div>

        <div className="flex gap-2">
          <div className="flex flex-col w-1/2 gap-2">
            <label htmlFor="price">Price</label>
            <input
              type="number"
              step="0.01"
              id="price"
              {...register("price", { required: "Price is required" })}
              className="p-4 border-2 border-gray-200 rounded-md outline-none"
            />
            {errors.price && (
              <p className="text-red-500">{errors.price.message}</p>
            )}
          </div>

          <div className="flex flex-col w-1/2 gap-2">
            <label htmlFor="quantity">Quantity</label>
            <input
              type="number"
              id="quantity"
              {...register("quantity", { required: "Quantity is required" })}
              className="p-4 border-2 border-gray-200 rounded-md outline-none"
            />
            {errors.quantity && (
              <p className="text-red-500">{errors.quantity.message}</p>
            )}
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <input
            type="submit"
            value="Add Product"
            className="w-full p-4 border-2 bg-palette-primary-main text-white border-gray-200 rounded-md outline-none text-center"
          />
          <ToastContainer/>
        </div>

      </form>
    </div>
  );
};

export default AddProduct;
