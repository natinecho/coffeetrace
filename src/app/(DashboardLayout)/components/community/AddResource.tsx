import { method } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
  } from "firebase/storage";
  import app from "@/app/firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { dark } from "@mui/material/styles/createPalette";

interface Tag {
  tag: string;
}
interface Blog {
  title: string;
  description: string;
  video_url:string;
  tag: string;
}

interface AddBlogProps {
  setOpen: (data: boolean) => void;
}

const AddBlog = ({ setOpen }: AddBlogProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Blog>();
  const session = useSession();

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
        setValue("video_url", imageUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const notifySuccess = () => {
    toast.success("Blog posted successfully!", {
      position: "top-right",
      autoClose: 1000,
    });
  
    setTimeout(() => {
      setOpen(false);
    }, 1000); 
  };
  const notifyError = () => toast.error("Failed to post the blog.");

  const onSubmit = async (data: Blog) => {

    console.log("resource here",data)

    const tagsArray = [];

    if (data.tag) {
      tagsArray.push(data.tag);
    }


    const submitData = {
      ...data,
      tags: tagsArray,
    };


    try {
      const res = await fetch(
        "https://cofeetracebackend-2.onrender.com/api/v0/resource/post",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.data?.accessToken}`,
          },
          body: JSON.stringify(submitData),
        }
      );

      if (res.ok) {
        notifySuccess();
      } else {
        notifyError();
      }
    } catch (error) {
      notifyError();
    }
  };

  return (
    <>
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 bg-white p-4 w-4/5 sm:w-1/2 md:w-1/3 border-2"
    >
    <h1 className="text-center text-xl font-semibold">
        post Resource
    </h1>
      <div className="flex flex-col gap-2">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          {...register("title", { required: "Title is required" })}
          className="p-4 border-2 border-gray-200 rounded-md outline-none"
        />
        {errors.title && (
          <span className="text-red-500">{errors.title.message}</span>
        )}
      </div>
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
      <div className="flex flex-col gap-2">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          {...register("description", { required: "Description is required" })}
          className="p-4 border-2 border-gray-200 rounded-md outline-none"
        />
        {errors.description && (
          <span className="text-red-500">{errors.description.message}</span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="tags">Tags</label>
        <select
          id="tags"
          {...register("tag", { required: "Please select a tag" })}
          className="p-4 border-2 border-gray-200 rounded-md outline-none"
        >
          <option value="">Select ...</option>
          <option value="Coffee">Coffee</option>
          <option value="System Update">System Update</option>
          <option value="Improvement">Improvement</option>
          <option value="Selling">Selling</option>
          <option value="Indigenous">Indigenous</option>
        </select>
        {errors.tag && (
          <span className="text-red-500">{errors.tag.message}</span>
        )}
      </div>

      <div className="flex justify-center gap-2 mt-4">
        <button
          type="submit"
          className="p-2 border-2 border-gray-200 rounded-md bg-palette-primary-main text-white outline-none text-center"
        >
          Post Response
        </button>
        <ToastContainer />
      </div>
    </form>
    </>

  );
};

export default AddBlog;
