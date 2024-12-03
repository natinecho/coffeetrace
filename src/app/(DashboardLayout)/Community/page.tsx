"use client";
import React, { useEffect, useState } from "react";
import { LuMessageSquare } from "react-icons/lu";
import { FaPaperclip, FaEye } from "react-icons/fa";
import { AiOutlineMessage } from "react-icons/ai";
import User from "@/../../public/images/profile/user-1.jpg";
import Image from "next/image";
import { RiCloseLine } from "react-icons/ri";
import AddBlog from "../components/community/AddBlog";
import { useSession } from "next-auth/react";
import { BiSend } from "react-icons/bi";
import ItemReplay from "../components/community/replay";
import AllBlogs from "../components/community/allBlogs";
import { divide, reverse } from "lodash";
import AllResource from "../components/community/AllResource";
import AddResource from "../components/community/AddResource";

interface Discription {
  description: string;
}
// interface Replay {
//   id: string;
//   user_id: string;
//   name: string;
//   image: string;
//   reply: string;
//   blog_id: string;
//   created_at: string;
// }

// interface ItemsReplay {
//   id: string;
// }

interface Blog {
  id: string;
  user_id: string;
  name: string;
  image: string;
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

//   const session = useSession();
//   const [isExpanded, setIsExpanded] = useState(true);
//   const [replay, setReplay] = useState<Replay[]>();
//   const [replayValue, setReplayValue] = useState<string>();
//   const toggleExpanded = () => setIsExpanded(!isExpanded);

//   const postReplay = async() =>{
//     try {
//       const response = await fetch(
//         `https://cofeetracebackend-2.onrender.com/api/v0/forum/${id}/getReply`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${session?.data?.accessToken}`,
//           },
//         }
//       );
//       // const data = await response.json();
//       if (response.ok) {
//         console.log("post replay response",response)
//       }
//     } catch (error) {
//       console.error("Error fetching products:", error);
//     }
//   }

//   useEffect(() => {
//     const fetchReplays = async () => {
//       try {
//         const response = await fetch(
//           `https://cofeetracebackend-2.onrender.com/api/v0/forum/${id}/getReply`,
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${session?.data?.accessToken}`,
//             },
//             body:JSON.stringify(replayValue)
//           }
//         );
//         const data = await response.json();
//         if (response.ok) {
//           setReplay(data.replies);
//         }
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       }
//     };

//     fetchReplays();
//   }, []);

//   return (
//     <>
//       {isExpanded ? (
//         <div
//           className="flex gap-3 items-center hover:text-blue-500"
//           onClick={toggleExpanded}
//         >
//           <AiOutlineMessage />
//           <p>{replay?.length} replies</p>
//         </div>
//       ) : (
//         <div>
//           <div
//             className="flex gap-3 items-center mb-5 hover:text-blue-500"
//             onClick={toggleExpanded}
//           >
//             <AiOutlineMessage />
//             <p>{replay?.length} replies</p>
//           </div>

//           {replay?.map((replays, index) => (
//             <div className="flex justify-between items-center">
//               <div className="flex items-center gap-5">
//                 <Image
//                   src={replays?.image}
//                   alt={replays.name}
//                   width={48}
//                   height={48}
//                   className="rounded-full bg-violet-50"
//                 />
//                 <div className="flex flex-col gap-2">
//                   <p>{replays.name}</p>
//                   <p>{replays.reply}</p>
//                 </div>
//               </div>
//               <p>{new Date(replays.created_at).toDateString()}</p>
//             </div>
//           ))}

//           <div className="flex gap-2">
//             <div className="w-full flex gap-3 items-center px-3 py-1 border-2 rounded-full sticky bottom-0 bg-white">
//               <input
//                 type="text"
//                 placeholder="Enter replay"
//                 className="w-full focus:outline-none rounded-md focus:border-blue-500"
//                 onChange={(e) => setReplayValue(e.target.value)}
//               />
//               <button className="text-3xl font-bold text-blue-500 cursor-pointer" type="submit" onClick={postReplay}>
//                 <BiSend className="text-3xl font-bold text-blue-500 cursor-pointer" />
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

const Page = () => {
  const [activeTab, setActiveTab] = useState("discussion");
  const [open, setOpen] = useState<boolean>(false);
  const [blog, setBlog] = useState<Blog[]>();
  const session = useSession();

  const handleAddPost = () => {
    setOpen(!open);
  };
  const handleCloseAddPost = () => {
    setOpen(false);
  };

  const follow = [
    {
      name: "Abebe Kebede",
      sugestion: "Talk about coffee",
    },
    {
      name: "Alemitu Gosa",
      sugestion: "Talk about coffee",
    },
    {
      name: "Amanuel Chala",
      sugestion: "Talk about coffee Production",
    },
  ];

  const sugestion = [
    {
      tag: "Coffee",
    },
    {
      tag: "Study-group",
    },
    {
      tag: "System-update",
    },
  ];

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(
          "https://cofeetracebackend-2.onrender.com/api/v0/forum/getAllBlog",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${session?.data?.accessToken}`,
            },
          }
        );
        const data = await response.json();
        setBlog(data.blogs);
        console.log("i was here", response);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="flex justify-between">
      <div className="w-full  relative lg:w-3/5 flex gap-10 flex-col">
        <div className=" w-full sticky flex justify-between items-center shadow-md p-2">
          <div className=" flex gap-10">
            <div
              className="flex items-center text-xl gap-3"
              onClick={() => setActiveTab("discussion")}
            >
              <LuMessageSquare />
              <h1>Discussion</h1>
            </div>

            <div
              className="flex items-center text-xl gap-3"
              onClick={() => setActiveTab("resource")}
            >
              <FaPaperclip />
              <h1>Resource</h1>
            </div>
          </div>
          <div>
            {/* {session?.data?.user?.role === "farmer" && ( */}
              <button
                className="px-6 py-2 border-2 border-gray-200  bg-[#A67B5B]  text-white rounded-md outline-none text-center "
                onClick={handleAddPost}
              >
                Post
              </button>
            {/* )} */}
          </div>
        </div>

        <div className="flex flex-col gap-8 overflow-hidden overflow-y-scroll max-h-[100dvh]">
          {blog?.reverse().map((items, index) => (
            <div
              key={index}
              className="flex flex-col p-4 border-2 rounded-md gap-4 "
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-5">
                  <Image
                    src={items?.image || "/images/profile/user-2.svg"}
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
                {items.tags.map((tag, index) => (
                  <button
                    key={index}
                    className="px-5 py-2 rounded-full  bg-[#cdcdcd23]"
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <div className="flex w-full">
                <div className="flex gap-3 items-center"></div>
                <ItemReplay id={items.id} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="hidden relative lg:w-[30%] md:flex gap-10 flex-col">
        <div className=" flex flex-col gap-2 border-2 p-4 rounded-3xl shadow-md">
          <h1 className="text-lg font-semibold text-[#858690]">
            People to follow
          </h1>
          <div>
            <div className="flex flex-col gap-4">
              {follow.map((items, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center gap-5">
                    <Image
                      src={User}
                      alt="userprofile"
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                    <div className="flex flex-col">
                      <p>{items.name}</p>
                      <p>{items.sugestion}</p>
                    </div>
                  </div>
                  <button className="px-6 py-2 border-2 border-black rounded-full outline-none text-center ">
                    Follow
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className=" flex flex-col gap-5 border-2 p-4 rounded-3xl shadow-md">
          <h1 className="text-lg font-semibold text-[#858690]">
            Recommended topics
          </h1>
          <div>
            <div className="flex flex-wrap gap-4 ">
              {sugestion.map((items, index) => (
                <button
                  key={index}
                  className="px-5 py-2 rounded-full  bg-[#cdcdcd23]"
                >
                  {items.tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000057]">
          <div
            className="absolute top-5 right-5 border-2 p-2 text-2xl text-white rounded-full cursor-pointer"
            onClick={handleCloseAddPost}
          >
            <RiCloseLine />
          </div>
          {
            activeTab === "discussion" ? <AddBlog setOpen={setOpen} /> : <AddResource setOpen={setOpen} />
          }
          {/* <AddBlog setOpen={setOpen} /> */}
        </div>
      )}
    </div>
  );
};

export default Page;
