// "use client";
// import React, { useState, useEffect } from "react";
// import {
//   FaHandHoldingUsd,
//   FaSortAmountUpAlt,
//   FaCheck,
//   FaTimes,
//   FaLessThan,
//   FaGreaterThan,
// } from "react-icons/fa"; // Added check and times icons
// import { TbMoneybag } from "react-icons/tb";
// import { useSession } from "next-auth/react";
// import Loader from "@/app/(DashboardLayout)/components/Loder/Loder";

// const PendingOrder = () => {
//   const { data: session, status } = useSession();
//   const [loading, setLoading] = useState<boolean>(true);
//   // const pending = [
//   //   {
//   //     icon: <TbMoneybag />,
//   //     name: "Abebe Kebede",
//   //     location: "Mekele",
//   //     type: "Yirgachefe",
//   //     shipping: "covered",
//   //     quantity: "200 kg",
//   //     bg: "bg-lime-200",
//   //   },
//   //   {
//   //     icon: <TbMoneybag />,
//   //     name: "Bekele Alemu",
//   //     location: "Addis Ababa",
//   //     type: "Sidamo",
//   //     shipping: "not covered",
//   //     quantity: "150 kg",
//   //     bg: "bg-amber-200",
//   //   },
//   //   {
//   //     icon: <TbMoneybag />,
//   //     name: "Chala Tadesse",
//   //     location: "Hawassa",
//   //     type: "Guji",
//   //     shipping: "covered",
//   //     quantity: "300 kg",
//   //     bg: "bg-orange-200",
//   //   },
//   //   {
//   //     icon: <TbMoneybag />,
//   //     name: "Desta Getachew",
//   //     location: "Bahir Dar",
//   //     type: "Jimma",
//   //     shipping: "not covered",
//   //     quantity: "100 kg",
//   //     bg: "bg-teal-200",
//   //   },
//   // ];
//   ///////////////////////////////////////////////////////////////////
//   const [pending, setPendingOrder] = useState<any>();

//   useEffect(() => {
//     const fetchPendingOrder = async () => {
//       setLoading(true);
//       const response = await fetch(
//         "https://cofeetracebackend-2.onrender.com/api/v0/order/getmyorders",
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${session?.accessToken}`,
//           },
//         }
//       );
//       let data = await response.json();
//       console.log("data", data);
//       if (session?.user?.role === "farmer") {
//         data = data?.data?.filter(
//           (order: any) =>
//             order.order_status.toLowerCase() === "pending" &&
//             order.order_status_farmer.toLowerCase() === "pending" &&
//             order.driver_status.toLowerCase() === "accepted"
//         );
//       } else if (session?.user?.role === "driver") {
//         data = data?.data?.filter(
//           (order: any) =>
//             order.order_status.toLowerCase() === "pending" &&
//             order.driver_status.toLowerCase() === "pending"
//         );
//       } else {
//         data = data?.data?.filter(
//           (order: any) =>
//             order.order_status.toLowerCase() === "pending" &&
//             (order.order_status_farmer.toLowerCase() === "pending" ||
//               order.driver_status.toLowerCase() === "pending")
//         );
//       }

//       console.log("teklu", data);
//       setPendingOrder(data);
//       setLoading(false);
//     };
//     fetchPendingOrder();
//   }, [session]);

//   const handleAcceptFarmer = async (order_id: string) => {
//     const response = await fetch(
//       `https://cofeetracebackend-2.onrender.com/api/v0/order/farmer/${order_id}/accept`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${session?.accessToken}`,
//         },
//       }
//     );
//     let data = await response.json();
//     console.log(data);
//   };

//   const handleAcceptDriver = async (order_id: string) => {
//     const response = await fetch(
//       `https://cofeetracebackend-2.onrender.com/api/v0/order/driver/${order_id}/accept`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${session?.accessToken}`,
//         },
//       }
//     );
//     let data = await response.json();
//     console.log(data);
//   };

//   const handleRjectFarmer = async (order_id: string) => {
//     const response = await fetch(
//       `https://cofeetracebackend-2.onrender.com/api/v0/order/farmer/${order_id}/reject`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${session?.accessToken}`,
//         },
//       }
//     );
//     let data = await response.json();
//     console.log(data);
//   };

//   const handleRjectDriver = async (order_id: string) => {
//     const response = await fetch(
//       `https://cofeetracebackend-2.onrender.com/api/v0/order/driver/${order_id}/reject`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${session?.accessToken}`,
//         },
//       }
//     );
//     let data = await response.json();
//     console.log(data);
//   };

//   ///////////////////////////////////////////////////////////////////

//   const itemsPerPage = 3;
//   const [currentPage, setCurrentPage] = useState<number>(1);

//   const totalPages = pending && Math.ceil(pending.length / itemsPerPage);

//   const getPagedData = () => {
//     if (!pending) return [];
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     return pending.slice(startIndex, startIndex + itemsPerPage);
//   };

//   const handlePrevPage = () => {
//     if (currentPage > 1) setCurrentPage(currentPage - 1);
//   };

//   const handleNextPage = () => {
//     if (currentPage < totalPages) setCurrentPage(currentPage + 1);
//   };

//   const handlePageClick = (pageNumber: number) => {
//     setCurrentPage(pageNumber);
//   };

//   const renderPageButtons = () => {
//     const pageButtons = [];
//     for (let i = 1; i <= totalPages; i++) {
//       pageButtons.push(
//         <button
//           key={i}
//           onClick={() => handlePageClick(i)}
//           className={`py-2 px-3 sm:px-4 md:py-2 rounded-xl mx-1 ${
//             i === currentPage
//               ? "bg-palette-primary-main text-white"
//               : "bg-white text-palette-primary-main border border-primary.main"
//           }`}
//         >
//           {i}
//         </button>
//       );
//     }
//     return pageButtons;
//   };

//   return (
//     <div>
//       <h1 className="text-xl font-semibold my-4 text-[#343C6A]">
//         Pending Orders
//       </h1>

//       {!(loading || status === "loading") ? (
//         <div className="flex flex-col gap-5 w-full">
//           <div className=" flex flex-col gap-6 w-full">
//             {getPagedData().map((items: any, index: number) => (
//               <div
//                 key={index}
//                 className="flex flex-col gap-7 md:flex-row md:gap-4  py-4 px-5 border border-gray-200 rounded-xl shadow-md"
//               >
//                 <div className="flex items-center gap-4 w-full md:w-1/4">
//                   <div
//                     className={`text-3xl ${
//                       items?.bg || "bg-lime-200"
//                     } rounded-2xl p-3 md:p-4`}
//                   >
//                     {items?.icon || <TbMoneybag />}
//                   </div>
//                   <div className="flex flex-col capitalize text-lg">
//                     <p>{items.farmer_name}</p>
//                     <p className="text-sm text-[#718EBF]">{items.order_type}</p>
//                   </div>
//                 </div>

//                 <div className="flex gap-4 md:w-3/5">
//                   {session?.user?.role !== "driver" ? (
//                     <div className="flex items-center gap-4 w-full md:w-1/3">
//                       <div className="flex flex-col text-lg font-semibold">
//                         <p>Type</p>
//                         <p className="text-sm text-[#718EBF]">
//                           {items.order_type}
//                         </p>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="flex items-center gap-4 w-full md:w-1/3">
//                       <div className="flex flex-col text-lg font-semibold">
//                         <p>Start</p>
//                         <p className="text-sm text-[#718EBF]">
//                           {items.start_location}
//                         </p>
//                       </div>
//                     </div>
//                   )}
//                   {session?.user?.role === "driver" && (
//                     <div className="flex items-center gap-4 w-full md:w-1/3">
//                       <div className="flex flex-col text-lg font-semibold">
//                         <p>Destination</p>
//                         <p className="text-sm text-[#718EBF]">
//                           {items.end_location}
//                         </p>
//                       </div>
//                     </div>
//                   )}
//                   <div className="flex items-center gap-4 w-full md:w-1/3">
//                     <div className="flex flex-col text-lg font-semibold">
//                       <p>Quantity</p>
//                       <p className="text-sm text-[#718EBF]">{items.quantity}</p>
//                     </div>
//                   </div>
//                   {session?.user?.role !== "driver" && (
//                     <div className="flex items-center gap-4 w-full md:w-1/3">
//                       <div className="flex flex-col text-lg font-semibold">
//                         <p>Shipping Coverage</p>
//                         <p className="text-sm text-[#718EBF]">
//                           {items.shipping_coverage}
//                         </p>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//                 {session?.user?.role != "merchant" ? (
//                   <div className="flex items-center justify-center gap-4 w-full md:w-1/5">
//                     <button
//                       className="py-2 px-5 border border-b-gray-200 rounded-full text-green-600"
//                       onClick={
//                         session?.user?.role === "farmer"
//                           ? () => handleAcceptFarmer(items.id)
//                           : () => handleAcceptDriver(items.id)
//                       }
//                     >
//                       Approve
//                     </button>
//                     <button
//                       className="py-2 px-5 border border-b-gray-200 rounded-full text-red-600"
//                       onClick={
//                         session?.user?.role === "farmer"
//                           ? () => handleRjectFarmer(items.id)
//                           : () => handleRjectDriver(items.id)
//                       }
//                     >
//                       Reject
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="flex items-center justify-center gap-4 w-full md:w-1/5">
//                     <button className="py-2 px-5 border border-b-gray-200 rounded-full text-[#FFBB38]">
//                       Pending
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       ) : (
//         <div className="flex item-center justify-center mt-10">
//           <Loader />;
//         </div>
//       )}
//       <div className="w-full flex justify-center items-center mt-4">
//         <div className="flex justify-center items-center p-4">
//           <button
//             className="cursor-pointer text-sm text-palette-primary-main flex items-center gap-1 px-4 py-1"
//             onClick={handlePrevPage}
//             disabled={currentPage === 1}
//           >
//             <FaLessThan /> Previous
//           </button>
//           <div>{renderPageButtons()}</div>
//           <button
//             className="cursor-pointer text-sm text-palette-primary-main flex items-center gap-1 px-4 py-1"
//             onClick={handleNextPage}
//             disabled={currentPage === totalPages}
//           >
//             Next <FaGreaterThan />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PendingOrder;
"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  FaHandHoldingUsd,
  FaSortAmountUpAlt,
  FaCheck,
  FaTimes,
  FaLessThan,
  FaGreaterThan,
} from "react-icons/fa";
import { TbMoneybag } from "react-icons/tb";
import { useSession } from "next-auth/react";
import Loader from "@/app/(DashboardLayout)/components/Loder/Loder";

const PendingOrder = () => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState<boolean>(true);
  const [pending, setPendingOrder] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 3;

  useEffect(() => {
    const fetchPendingOrder = async () => {
      if (!session) return; // Wait for session to be available
      setLoading(true);
      try {
        const response = await fetch(
          `https://cofeetracebackend-2.onrender.com/api/v0/order/getmyorders`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );

        let data = await response.json();
        if (session?.user?.role === "farmer") {
          data = data?.data?.filter(
            (order: any) =>
              order.order_status.toLowerCase() === "pending" &&
              order.order_status_farmer.toLowerCase() === "pending" &&
              order.driver_status.toLowerCase() === "accepted"
          );
        } else if (session?.user?.role === "driver") {
          data = data?.data?.filter(
            (order: any) =>
              order.order_status.toLowerCase() === "pending" &&
              order.driver_status.toLowerCase() === "pending"
          );
        } else {
          data = data?.data?.filter(
            (order: any) =>
              order.order_status.toLowerCase() === "pending" &&
              (order.order_status_farmer.toLowerCase() === "pending" ||
                order.driver_status.toLowerCase() === "pending")
          );
        }

        setPendingOrder(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingOrder();
  }, [session]);

  const handleAcceptFarmer = async (order_id: string) => {
    try {
      const response = await fetch(
        `https://cofeetracebackend-2.onrender.com/api/v0/order/farmer/${order_id}/accept`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error accepting order as farmer:", error);
    }
  };

  const handleAcceptDriver = async (order_id: string) => {
    try {
      const response = await fetch(
        `https://cofeetracebackend-2.onrender.com/api/v0/order/driver/${order_id}/accept`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error accepting order as driver:", error);
    }
  };

  const handleRejectFarmer = async (order_id: string) => {
    try {
      const response = await fetch(
        `https://cofeetracebackend-2.onrender.com/api/v0/order/farmer/${order_id}/reject`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error rejecting order as farmer:", error);
    }
  };

  const handleRejectDriver = async (order_id: string) => {
    try {
      const response = await fetch(
        `https://cofeetracebackend-2.onrender.com/api/v0/order/driver/${order_id}/reject`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error rejecting order as driver:", error);
    }
  };

  const totalPages = Math.ceil(pending.length / itemsPerPage);
  const getPagedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return pending.slice(startIndex, startIndex + itemsPerPage);
  };

  const renderPageButtons = () => {
    const pageButtons = [];
    for (let i = 1; i <= totalPages; i++) {
      pageButtons.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`py-2 px-3 sm:px-4 md:py-2 rounded-xl mx-1 ${
            i === currentPage
              ? "bg-palette-primary-main text-white"
              : "bg-white text-palette-primary-main border border-primary.main"
          }`}
        >
          {i}
        </button>
      );
    }
    return pageButtons;
  };

  if (loading || status === "loading") return <Loader />;

  function handlePickOrder(id: any): void {
    throw new Error("Function not implemented.");
  }

  function handlePayFarmer(id: any): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div>
      <h1 className="text-xl font-semibold my-4 text-[#343C6A]">
        Pending Orders
      </h1>
      {pending.length > 0 ? (
        <div className="flex flex-col gap-5 w-full">
          {getPagedData().map((items, index) => (
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
                  <p className="text-sm text-[#718EBF]">
                    {" "}
                    {items.order_type}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 md:w-3/5">
                <div className="flex items-center gap-4 w-full md:w-1/3">
                  <div className="flex flex-col text-lg font-semibold">
                    <p>{items.order_type}</p>
                    <p className="text-sm text-[#718EBF]">{items.quantity}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 w-full md:w-1/4">
                  <div className="flex flex-col text-lg font-semibold">
                    <p>Total Price</p>
                    <p className="text-sm text-[#718EBF]">
                      {items.total_price}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 w-full md:w-1/3">
                  <div className="flex flex-col text-lg font-semibold">
                    <p>Shipping Status</p>
                    <p
                      className={`text-sm ${
                        items.shipping_status.toLowerCase() === "picked"
                          ? "text-green-500"
                          : "text-yellow-500"
                      }`}
                    >
                      {items.shipping_status}
                    </p>
                  </div>
                </div>
              </div>
              {session?.user.role == "merchant" ? (
                <div className="flex items-center justify-center gap-4 w-full md:w-1/4">
                  {items.farmer_payment_status.toLowerCase() ===
                    "pending" && (
                    <button
                      className="py-2 px-5 border hover:border-palette-primary-main border-b-gray-200 rounded-full text-palette-primary-main"
                      onClick={() => handlePayFarmer(items.id)}
                    >
                      Pay Farmer
                    </button>
                  )}

                  {items.driver_payment_status.toLowerCase() ===
                    "pending" && (
                    <button
                      className="py-2 px-5 border hover:border-palette-primary-main border-b-gray-200 rounded-full text-palette-primary-main"
                      onClick={() => handlePayFarmer(items.id)}
                    >
                      Pay Driver
                    </button>
                  )}
                </div>
              ) : (
                <>
                  {session?.user?.role == "driver" ? (
                    <div className="flex items-center justify-center gap-4 w-full md:w-1/5">
                      <button
                        className="py-2 px-5 border hover:border-palette-primary-main border-b-gray-200 rounded-full text-palette-primary-main"
                        onClick={() => handlePickOrder(items.id)}
                        disabled={
                          items?.order_status_farmer?.toLowerCase() !==
                          "accepted"
                        }
                      >
                        Pick Order
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-4 w-full md:w-1/5">
                      <button className="py-2 px-5 border border-b-gray-200 rounded-full text-[#FFBB38]">
                        Pending
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
          <div className="w-full flex justify-center items-center mt-4">
            {renderPageButtons()}
          </div>
        </div>
      ) : (
        <p>No pending orders found.</p>
      )}
    </div>
  );
};

export default dynamic(() => Promise.resolve(PendingOrder), { ssr: false });
