"use client";
import React, { useEffect, useState } from "react";
import { AiOutlineMessage } from "react-icons/ai";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { BiSend } from "react-icons/bi";
import { useForm } from "react-hook-form"; // Import useForm

interface Replay {
  id: string;
  user_id: string;
  name: string;
  image: string;
  reply: string;
  blog_id: string;
  created_at: string;
}

interface ItemsReplay {
  id: string;
}

interface FormValues {
  reply: string;
}

const ItemReplay = ({ id }: ItemsReplay) => {
  const session = useSession();
  const [isExpanded, setIsExpanded] = useState(true);
  const [replay, setReplay] = useState<Replay[]>();

  const { register, handleSubmit, reset } = useForm<FormValues>(); // Initialize useForm

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  const postReplay = async (data: FormValues) => {
    try {
      const response = await fetch(
        `https://cofeetracebackend-2.onrender.com/api/v0/forum/${id}/reply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.data?.accessToken}`,
          },
          body: JSON.stringify({ reply: data.reply }),
        }
      );
      if (response.ok) {
        console.log("Post reply response", response);
        reset(); // Reset the form when response is OK
      }
    } catch (error) {
      console.error("Error posting replay:", error);
    }
  };

  useEffect(() => {
    const fetchReplays = async () => {
      try {
        const response = await fetch(
          `https://cofeetracebackend-2.onrender.com/api/v0/forum/${id}/getReply`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.data?.accessToken}`,
            },
          }
        );
        const data = await response.json();
        if (response.ok) {
          setReplay(data.replies);
        }
      } catch (error) {
        console.error("Error fetching replays:", error);
      }
    };

    fetchReplays();
  }, [replay]);

  return (
    <>
      {isExpanded ? (
        <div
          className="flex gap-2 items-center hover:text-blue-500 cursor-pointer"
          onClick={toggleExpanded}
        >
          <AiOutlineMessage className="text-xl" />
          <p className="text-sm text-gray-500">{replay?.length} replies</p>
        </div>
      ) : (
        <div className="w-full">
          <div
            className="flex gap-2 items-center mb-4 hover:text-blue-500 cursor-pointer"
            onClick={toggleExpanded}
          >
            <AiOutlineMessage className="text-xl" />
            <p className="text-sm text-gray-500">{replay?.length} replies</p>
          </div>

          <div className="flex flex-col gap-6 w-full">
            {replay?.map((replays, index) => (
              <div key={index} className="flex gap-4 items-start w-full">
                <Image
                  src={replays?.image}
                  alt={replays.name}
                  width={40}
                  height={40}
                  className="rounded-full object-cover bg-gray-100"
                />
                <div className="flex flex-col gap-1 text-sm w-full">
                  <div className="flex justify-between items-center w-full">
                    <p className="font-semibold">{replays.name}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(replays.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-gray-700">{replays.reply}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Reply Input Section */}
          <div className="mt-4">
            <form
              className="w-full flex gap-2 items-center px-3 py-2 border border-gray-300 rounded-full bg-white"
              onSubmit={handleSubmit(postReplay)} // Use handleSubmit from useForm
            >
              <input
                type="text"
                placeholder="Enter reply"
                className="w-full px-3 py-2 outline-none text-sm text-gray-700 rounded-full"
                {...register("reply", { required: true })} // Register reply input
              />
              <button
                className="text-blue-500 hover:text-blue-700"
                type="submit"
              >
                <BiSend className="text-2xl md:text-3xl" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ItemReplay;
