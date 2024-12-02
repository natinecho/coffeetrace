"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FaCaretDown } from "react-icons/fa";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react"; // Import signOut from next-auth/react
import { useSession } from "next-auth/react";
const Profile = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleToggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleCloseDropdown = () => {
    setDropdownOpen(false);
  };

  // Redirect to login page if session is not found and it's not loading
  if (status !== "loading" && !session) {
    router.push("/authentication/login"); // Redirect user to login page
    return null; // Return null to prevent further rendering
  }

  return (
    <div className="relative sm:w-52  border  shadow-md rounded-full sm:rounded-lg">
      <div
        onClick={handleToggleDropdown}
        className="flex items-center gap-3 cursor-pointer"
      >
        <img
          src="/images/profile/user-3.svg"
          alt="User"
          className="w-12 h-12 rounded-md "
        />
        <div className="hidden sm:flex gap-4 py-1 items-center">
          <div className="flex-col items-start">
            <div className="text-[#747C8A]  font-medium capitalize">
              {session?.user?.name}
            </div>
            <div className="text-[#B4B4B4] text-sm capitalize">
              {session?.user?.role}
            </div>
          </div>
          <FaCaretDown />
        </div>
      </div>

      {isDropdownOpen && (
        <div className="absolute top-16 right-0 bg-white shadow-lg rounded-lg w-48 sm:w-52 z-10">
          <ul className="list-none p-0 m-0">
            <Link href="/message">
              <li
                className="py-2 px-4 hover:bg-gray-100 cursor-pointer border-b border-gray-200"
                onClick={handleCloseDropdown}
              >
                My Message
              </li>
            </Link>
            <li
              className="py-2 px-4 hover:bg-gray-100 cursor-pointer border-b border-gray-200"
              onClick={handleCloseDropdown}
            >
              My Account
            </li>
            <li
              className="py-2 px-4 hover:bg-gray-100 cursor-pointer border-b border-gray-200"
              onClick={handleCloseDropdown}
            >
              My Tasks
            </li>
            <li className="py-2 px-4 text-center w-full">
              <button
                onClick={() =>
                  signOut({
                    redirect: true,
                    callbackUrl: "/authentication/login",
                  })
                } // Use callbackUrl instead of redirectTo
                className="inline-block w-full py-2 px-4 border border-palette-primary-dark text-palette-primary-main rounded-md hover:bg-palette-primary-main hover:text-white transition"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Profile;
