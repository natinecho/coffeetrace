"use client";
import React, { FC } from "react";

interface SidebarItemsProps {
  toggleMobileSidebar: () => void;
}
import Menuitems from "./MenuItems";
import { usePathname, useRouter } from "next/navigation"; // Import useRouter for redirect
import { Box, List } from "@mui/material";
import NavItem from "./NavItem";
import { useSession } from "next-auth/react";

const SidebarItems = () => {
  const pathname = usePathname();
  const router = useRouter(); // Initialize router for redirect
  const pathDirect = pathname;

  const { data: session, status } = useSession();

  // Redirect to login page if session is not found and it's not loading
  if (status !== "loading" && !session) {
    router.push("/authentication/login"); // Redirect user to login page
    return null; // Return null to prevent further rendering
  }

  return (
    <Box sx={{ px: 3 }}>
      <List sx={{ pt: 0, marginTop: 5 }} className="sidebarNav" component="div">
        {Menuitems.map((item) => {
          if (
            item.role &&
            session &&
            (item.role === session?.user?.role || item.role === "all")
          ) {
            return (
              <NavItem
                item={item}
                key={item.id}
                pathDirect={pathDirect}
                // onClick={toggleMobileSidebar}
              />
            );
          }
        })}
      </List>
    </Box>
  );
};

export default SidebarItems;
