import React from "react";
import Link from "next/link";
import Profile from "./Profile";
import { IconBellRinging, IconMenu } from "@tabler/icons-react";

interface ItemType {
  toggleMobileSidebar: (event: React.MouseEvent<HTMLElement>) => void;
}

const Header = ({ toggleMobileSidebar }: ItemType) => {
  return (
    <header className="sticky top-0 z-50 bg-white  backdrop-blur-md shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 lg:px-8">
        <button
          className="lg:hidden"
          onClick={toggleMobileSidebar}
          aria-label="Toggle Sidebar"
        >
          <IconMenu size={24} />
        </button>

        {/* <div className="relative"></div> */}

        <div className="ml-auto flex items-center space-x-4">
          <div className="px-4 py-4 ">
            <button className=" relative ">
              <span className="absolute top-0 right-0 h-2 w-2 bg-blue-500 rounded-full" />
              <IconBellRinging size={25} />
            </button>
          </div>
          <Profile />
        </div>
      </div>
    </header>
  );
};

export default Header;
