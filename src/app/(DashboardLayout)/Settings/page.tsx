"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import UserProfileForm from "@/app/(DashboardLayout)/components/setting/userProfleForm";

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

const UserSettingsPage = () => {
  const { data: session, status } = useSession(); 
  const [user, setUser] = useState<SettingInputType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.accessToken) { // Ensure accessToken is available
        try {
          const response = await fetch("https://cofeetracebackend-2.onrender.com/api/v0/user/me", {
            headers: {
              Authorization: `Bearer ${session.accessToken}`, // Use accessToken correctly
            },
            method: "GET",
          });
          
          // Check if the response is OK (status code 200)
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const data = await response.json(); // Parse the response data
          console.log("herrrrrrrrrrrrrrrrrrrrr",data.user)
          setUser(data.user); // Set the user state
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(null); // Set user to null if there's an error
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false); // Stop loading if session is not valid
      }
    };

    fetchUserData();
  }, [session]);

  if (loading) {
    return <div>Loading...</div>; // Show loading state
  }

  if (!user) {
    return <div>User not found.</div>;
  }

  return (
    <div>
      <h1 className="font-semibold text-2xl py-4">User Settings</h1>
      <UserProfileForm user={user} />
    </div>
  );
};

export default UserSettingsPage;
