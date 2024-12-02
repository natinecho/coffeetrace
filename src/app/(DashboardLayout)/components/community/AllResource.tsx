"use client";
import React, { useEffect, useState } from "react";
import { LuMessageSquare } from "react-icons/lu";
import { FaPaperclip, FaEye } from "react-icons/fa";
import { AiOutlineMessage } from "react-icons/ai";
import User from "@/../../public/images/profile/user-1.jpg";
import Image from "next/image";
import { RiCloseLine } from "react-icons/ri";
// import AddBlog from "../components/community/AddBlog";
import { useSession } from "next-auth/react";
import { BiSend } from "react-icons/bi";
import ItemReplay from "./replay";
import { reverse, stubTrue } from "lodash";

interface Discription {
  description: string;
}

interface Blog {
  id: string;
  user_id: string;
  name: string;
  image: string;
  video_url:string;
  title: string;
  description: string;
  tags: [tag: string];
  created_at: string;
}

const ItemDescription = ({ description }: Discription) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpanded = () => setIsExpanded(!isExpanded);
  const charLimit = 200;

  return (
    <div className="text-[#6D6F7B]">
      {isExpanded ? description : description.slice(0, charLimit)}
      {description.length > charLimit && (
        <button onClick={toggleExpanded} className="text-blue-500 ml-2">
          {isExpanded ? "See Less" : "See More"}
        </button>
      )}
    </div>
  );
};

const AllResource = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [blog, setBlog] = useState<Blog[]>();
  const session = useSession();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(
          "https://cofeetracebackend-2.onrender.com/api/v0/resource/getAllResource",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${session?.data?.accessToken}`,
            },
          }
        );


        const data = await response.json();
    
        setBlog(data.blog);
        console.log("i was here resource",data.blog);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchBlogs();
  }, [session]);

  return (<>
    <div className="flex flex-col gap-8 overflow-hidden overflow-y-scroll max-h-[100dvh]">
      {blog?.reverse().map((items, index) => (
        <div
          key={index}
          className="flex flex-col p-4 border-2 rounded-md gap-4 "
        >
        <video src={items.video_url} autoPlay={true} controls/>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-5">
              <Image
                src={items?.image}
                alt={items.name}
                width={48}
                height={48}
                className="rounded-full bg-violet-50"
              />
              {/* <p>By: {items.author.name}</p> */}
              <p>By: {items.name}</p>
            </div>
            <p>{new Date(items.created_at).toDateString()}</p>
          </div>
          <div className="text-lg font-semibold text-[#6D6F7B]">
            {items.title}
          </div>
          <div className="text-[#6D6F7B]">
            <ItemDescription description={items.description} />
          </div>
          <div className="flex gap-6">
            {items?.tags?.map((tag, index) => (
              <button className="px-5 py-2 rounded-full  bg-[#cdcdcd23]">
                {tag}
              </button>
            ))}
          </div>
          <div className="flex w-full">
            <div className="flex gap-3 items-center">
            </div>
            <ItemReplay id={items.id} />
          </div>
        </div>
      ))}
    </div>
  </>

  );
};

export default AllResource;
