"use client";

import { TbMoneybag } from "react-icons/tb";
import { useState, useEffect } from "react";
import { FaLessThan, FaGreaterThan } from "react-icons/fa6";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Loader from "../Loder/Loder";

const ApprovedOrder = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [approved, setApprovedOrders] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchApprovedOrders = async () => {
      if (!session || !session.accessToken) return;

      setLoading(true);
      try {
        const response = await fetch(
          "https://cofeetracebackend-2.onrender.com/api/v0/order/getmyorders",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );
        let data = await response.json();

        if (session.user.role === "merchant") {
          data = data?.data?.filter(
            (order: any) =>
              order.order_status.toLowerCase() === "pending" &&
              order.order_status_farmer.toLowerCase() === "accepted" &&
              order.driver_status.toLowerCase() === "accepted" &&
              (order.shipping_status.toLowerCase() === "picked" ||
                order.shipping_status.toLowerCase() === "pending") &&
              (order.driver_payment_status.toLowerCase() === "pending" ||
                order.farmer_payment_status.toLowerCase() === "pending")
          );
        } else if (session.user.role === "driver") {
          data = data?.data?.filter(
            (order: any) =>
              order.order_status.toLowerCase() === "pending" &&
              order.driver_status.toLowerCase() === "accepted" &&
              order.shipping_status.toLowerCase() === "pending"
          );
        } else {
          data = data?.data?.filter(
            (order: any) =>
              order.order_status.toLowerCase() === "pending" &&
              order.order_status_farmer.toLowerCase() === "accepted" &&
              order.driver_status.toLowerCase() === "accepted" &&
              (order.shipping_status.toLowerCase() === "picked" ||
                order.shipping_status.toLowerCase() === "pending") &&
              (order.driver_payment_status.toLowerCase() === "pending" ||
                order.farmer_payment_status.toLowerCase() === "pending")
          );
        }

        setApprovedOrders(data);
      } catch (error) {
        console.error("Error fetching approved orders:", error);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") fetchApprovedOrders();
  }, [session, status]);

  const handlePayFarmer = async (order_id: string) => {
    try {
      const response = await fetch(
        `https://cofeetracebackend-2.onrender.com/api/v0/order/buyer/${order_id}/payFarmer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );
      const data = await response.json();
      console.log("Pay Farmer Response:", data);
    } catch (error) {
      console.error("Error paying farmer:", error);
    }
  };

  const handlePayDriver = async (order_id: string) => {
    try {
      const response = await fetch(
        `https://cofeetracebackend-2.onrender.com/api/v0/order/buyer/${order_id}/paydriver`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );
      const data = await response.json();
      console.log("Pay Driver Response:", data);
    } catch (error) {
      console.error("Error paying driver:", error);
    }
  };

  const handlePickOrder = async (order_id: string) => {
    try {
      const response = await fetch(
        `https://cofeetracebackend-2.onrender.com/api/v0/order/driver/${order_id}/pickup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );
      const data = await response.json();
      console.log("Pick Order Response:", data);
    } catch (error) {
      console.error("Error picking order:", error);
    }
  };

  const totalPages = approved ? Math.ceil(approved.length / itemsPerPage) : 0;

  const getPagedData = () => {
    if (!approved) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    return approved.slice(startIndex, startIndex + itemsPerPage);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const renderPageButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`py-2 px-3 sm:px-4 rounded-xl mx-1 ${
            i === currentPage
              ? "bg-palette-primary-main text-white"
              : "bg-white text-palette-primary-main border border-primary.main"
          }`}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  if (loading || status === "loading") {
    return (
      <div className="flex item-center justify-center mt-16">
        <Loader />
      </div>
    );
  }

  function handleRjectFarmer(id: any): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div>
      <h1 className="text-xl font-semibold my-4 text-[#343C6A]">
        Approved Orders
      </h1>
      {approved && approved.length > 0 ? (
        <div className="flex flex-col gap-5 w-full">
          <div className="flex flex-col gap-6 w-full">
            {getPagedData().map((items: any, index: number) => (
               <div
               key={index}
               className="flex flex-col gap-7 md:flex-row md:gap-4  py-4 px-5 border border-gray-200 rounded-xl shadow-md"
             >
               <div className="flex items-center gap-4 w-full md:w-1/4">
                 <div
                   className={`text-3xl ${
                     items?.bg || "bg-lime-200"
                   } rounded-2xl p-3 md:p-4`}
                 >
                   {items?.icon || <TbMoneybag />}
                 </div>
                 <div className="flex flex-col capitalize text-lg">
                   <p>{items.farmer_name}</p>
                   <p className="text-sm text-[#718EBF]">{items.order_type}</p>
                 </div>
               </div>

               <div className="flex gap-4 md:w-3/5">
                 {session?.user?.role !== "driver" ? (
                   <div className="flex items-center gap-4 w-full md:w-1/3">
                     <div className="flex flex-col text-lg font-semibold">
                       <p>Type</p>
                       <p className="text-sm text-[#718EBF]">
                         {items.order_type}
                       </p>
                     </div>
                   </div>
                 ) : (
                   <div className="flex items-center gap-4 w-full md:w-1/3">
                     <div className="flex flex-col text-lg font-semibold">
                       <p>Start</p>
                       <p className="text-sm text-[#718EBF]">
                         {items.start_location}
                       </p>
                     </div>
                   </div>
                 )}
                 {session?.user?.role === "driver" && (
                   <div className="flex items-center gap-4 w-full md:w-1/3">
                     <div className="flex flex-col text-lg font-semibold">
                       <p>Destination</p>
                       <p className="text-sm text-[#718EBF]">
                         {items.end_location}
                       </p>
                     </div>
                   </div>
                 )}
                 <div className="flex items-center gap-4 w-full md:w-1/3">
                   <div className="flex flex-col text-lg font-semibold">
                     <p>Quantity</p>
                     <p className="text-sm text-[#718EBF]">{items.quantity}</p>
                   </div>
                 </div>
                 {session?.user?.role !== "driver" && (
                   <div className="flex items-center gap-4 w-full md:w-1/3">
                     <div className="flex flex-col text-lg font-semibold">
                       <p>Shipping Coverage</p>
                       <p className="text-sm text-[#718EBF]">
                         {items.shipping_coverage}
                       </p>
                     </div>
                   </div>
                 )}
               </div>
               {session?.user?.role != "merchant" ? (
                 <div className="flex items-center justify-center gap-4 w-full md:w-1/5">
                   <button
                     className="py-2 px-5 border border-b-gray-200 rounded-full text-green-600"
                     onClick={
                       session?.user?.role === "farmer"
                         ? () => handlePayFarmer(items.id)
                         : () => handlePayDriver(items.id)
                     }
                   >
                     Approve
                   </button>
                   <button
                     className="py-2 px-5 border border-b-gray-200 rounded-full text-red-600"
                     onClick={
                       session?.user?.role === "farmer"
                         ? () => handleRjectFarmer(items.id)
                         : () => handleRjectFarmer(items.id)
                     }
                   >
                     Reject
                   </button>
                 </div>
               ) : (
                 <div className="flex items-center justify-center gap-4 w-full md:w-1/5">
                   <button className="py-2 px-5 border border-b-gray-200 rounded-full text-[#FFBB38]">
                     Pending
                   </button>
                 </div>
               )}
             </div>
            ))}
          </div>
          <div className="w-full flex justify-center items-center mt-4">
            <div className="flex justify-center items-center p-4">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="cursor-pointer text-sm text-palette-primary-main flex items-center gap-1 px-4 py-1"
              >
                <FaLessThan /> Previous
              </button>
              <div>{renderPageButtons()}</div>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="cursor-pointer text-sm text-palette-primary-main flex items-center gap-1 px-4 py-1"
              >
                Next <FaGreaterThan />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p>No approved orders found.</p>
      )}
    </div>
  );
};

export default dynamic(() => Promise.resolve(ApprovedOrder), { ssr: false });
