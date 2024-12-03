"use client";
import React, { useState } from "react";
import Image from "next/image";
import { TbMessage2Search } from "react-icons/tb";
import { IoIosArrowBack } from "react-icons/io";
import { BiSend } from "react-icons/bi";
import User from "@/../../public/images/profile/user-1.jpg";
// import {User2,User3} from "@/../../public/images/profile/userImage";

interface Chat {
  sender_id: number;
  receiver_id: number;
  created_at: string;
  message: string;
}

const Page = () => {
  const [selectedChatIndex, setSelectedChatIndex] = useState<number | null>(
    null
  );
  const [selectedChatMessages, setSelectedChatMessages] = useState<Chat[]>([]);

  // Sample individual messages data from API
  const chats = [
    {
      name: "Abebe Kebede",
      image: User,
      messages: [
        {
          sender_id: 0,
          receiver_id: 2,
          created_at: "2024-09-24T10:00:00Z",
          message: "Hello, Abebe",
        },
        {
          sender_id: 2,
          receiver_id: 0,
          created_at: "2024-09-24T10:02:00Z",
          message: "Hi!",
        },
        {
          sender_id: 0,
          receiver_id: 2,
          created_at: "2024-09-24T10:05:00Z",
          message: "How is the quality of the recent shipment?",
        },
        {
          sender_id: 2,
          receiver_id: 0,
          created_at: "2024-09-24T10:07:00Z",
          message: "The quality is great, as always.",
        },
        {
          sender_id: 1,
          receiver_id: 2,
          created_at: "2024-09-24T10:10:00Z",
          message: "Fantastic! Let’s discuss the next order.",
        },
        {
          sender_id: 2,
          receiver_id: 0,
          created_at: "2024-09-24T10:12:00Z",
          message: "Sounds good. I’ll have the details ready.",
        },
      ],
    },
    {
      name: "Chala",
      image: User,
      messages: [
        {
          sender_id: 1,
          receiver_id: 2,
          created_at: "2024-09-24T11:00:00Z",
          message:
            "Good morning, Chala. Do you think the price is fair for the Sidamo beans?",
        },
        {
          sender_id: 2,
          receiver_id: 1,
          created_at: "2024-09-24T11:02:00Z",
          message: "Yes, I believe the price is fair, considering the quality.",
        },
        {
          sender_id: 1,
          receiver_id: 2,
          created_at: "2024-09-24T11:05:00Z",
          message: "Great! When are you planning to place the next order?",
        },
        {
          sender_id: 2,
          receiver_id: 1,
          created_at: "2024-09-24T11:07:00Z",
          message: "Probably next week. I’ll confirm with my team.",
        },
      ],
    },
    {
      name: "Mohamed Ali",
      image: User,
      messages: [
        {
          sender_id: 3,
          receiver_id: 2,
          created_at: "2024-09-24T12:00:00Z",
          message: "Good morning, Mohamed! The coffee you sent is fantastic.",
        },
        {
          sender_id: 2,
          receiver_id: 3,
          created_at: "2024-09-24T12:02:00Z",
          message:
            "I’m glad to hear that! Let me know when you’re ready to place the next order.",
        },
        {
          sender_id: 3,
          receiver_id: 2,
          created_at: "2024-09-24T12:05:00Z",
          message: "I’ll be ready to order within a few days.",
        },
        {
          sender_id: 2,
          receiver_id: 3,
          created_at: "2024-09-24T12:07:00Z",
          message: "Perfect! I’ll prepare the shipment accordingly.",
        },
      ],
    },
    {
      name: "Kebede Tesfaye",
      image: User,
      messages: [
        {
          sender_id: 0,
          receiver_id: 2,
          created_at: "2024-09-24T14:00:00Z",
          message: "Hey Kebede, are you satisfied with the coffee quality?",
        },
        {
          sender_id: 2,
          receiver_id: 0,
          created_at: "2024-09-24T14:02:00Z",
          message: "Yes, very satisfied. The flavor is rich and consistent.",
        },
        {
          sender_id: 0,
          receiver_id: 2,
          created_at: "2024-09-24T14:05:00Z",
          message: "Glad to hear that! Let me know if you need anything else.",
        },
        {
          sender_id: 2,
          receiver_id: 0,
          created_at: "2024-09-24T14:07:00Z",
          message: "Will do! I’m already planning the next batch.",
        },
      ],
    },
  ];

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";

    // Convert to 12-hour format
    const formattedHours = hours % 12 || 12; // the hour '0' should be '12'
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const handleChatClick = (index: number) => {
    setSelectedChatIndex(index);
    setSelectedChatMessages(chats[index].messages);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-10 h-[100dvh]">
      {/* Chat List */}
      <div
        className={`w-full sm:w-1/3 flex flex-col overflow-y-scroll ${
          selectedChatIndex !== null ? "hidden sm:flex" : "flex"
        }`}
      >
        <div className="flex gap-3 items-center px-4 py-2 mb-4 border-2 rounded-full">
          <TbMessage2Search className="text-lg text-thin" />
          <input
            type="text"
            placeholder="Search shipment..."
            className="w-full focus:outline-none rounded-md focus:border-blue-500"
          />
        </div>

        <div className="flex flex-col gap-5 overflow-y-scroll  border-r-2 flex-grow">
          {chats.map((chat, index) => (
            <div
              key={index}
              onClick={() => handleChatClick(index)}
              className={`flex items-center gap-5 rounded-full cursor-pointer 
                ${
                  selectedChatIndex === index
                    ? "text-white bg-[#A67B5B] "
                    : "text-black"
                }`}
            >
              <Image
                src={chat.image}
                alt="user profile"
                width={65}
                height={65}
                className="rounded-full"
              />
              <div className="flex flex-col">
                <p className="font-semibold text-lg">{chat.name}</p>
                <p>{chat.messages[chat.messages.length - 1].message.slice(0, 20)}...</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div
        className={`w-full sm:w-2/3 flex flex-col h-full ${
          selectedChatIndex === null ? "hidden sm:flex" : "flex"
        }`}
      >
        {selectedChatMessages.length > 0 && (
          <div className="flex flex-col flex-grow">
            <div className="flex justify-between items-center p-5">
              <div className="flex items-center gap-5">
                <button
                  className="sm:hidden p-4 hover:bg-[#69696959] text-gray-800 rounded-full"
                  onClick={() => setSelectedChatIndex(null)}
                >
                  <IoIosArrowBack className="text-2xl" />
                </button>
                <Image
                  src={User}
                  alt="user profile"
                  width={60}
                  height={60}
                  className="rounded-full"
                />
                <p className="text-2xl font-semibold">Abebe Kebede</p>
              </div>
            </div>

            {/* Messages Section */}
            <div className="flex flex-col flex-grow overflow-hidden overflow-y-scroll gap-4 px-5 py-2">
              {selectedChatMessages.map((chat, index) => (
                <div key={index} className="">
                  {chat.sender_id === 2 ? (
                    <div className="flex justify-start items-center">
                      <div className="p-3 rounded-2xl border-2 bg-gray-300 min-w-[40%]">
                        <p>{chat.message}</p>
                        <p className="text-sm font-thin">{formatTime(chat.created_at)}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-end">
                      <div className="p-3 rounded-2xl bg-gray-100 text-end border-2 min-w-[40%]">
                        <p>{chat.message}</p>
                        <p className="text-sm font-thin">{formatTime(chat.created_at)}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Message Input Section */}
            <div className="w-full flex gap-3 items-center px-4 py-2 border-2 rounded-full sticky bottom-0 bg-white">
              <input
                type="text"
                placeholder="Type a message..."
                className="w-full focus:outline-none rounded-md focus:border-blue-500"
              />
              <BiSend className="text-3xl font-bold text-blue-500 cursor-pointer" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
