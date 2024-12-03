// "use client";
// import Image from "next/image";
// import React from "react";
// import { MdMyLocation } from "react-icons/md";
// import { IoLocationSharp } from "react-icons/io5";

// import { FiPhone } from "react-icons/fi";
// import { MdMessage } from "react-icons/md";
// import Link from "next/link";
// import { Phone } from "@mui/icons-material";
// import RecentTransactions from "../../components/dashboard/RecentTransactions";
// import DashboardCard from "../../components/shared/DashboardCard";
// import { RecentTransactionsProps, Destination } from "@/utils/types/types";
// import { useState, useEffect } from "react";
// import { useSession } from "next-auth/react";
// import uuid4 from "uuid4";

// const destinations: Destination[] = [
//   {
//     time: "09:30 am",
//     content: "Payment received from John Doe of $385.90",
//     color: "primary",
//     latitude: 9.0204,
//     longitude: 38.7465,
//   },
//   {
//     time: "10:00 am",
//     content: "New sale recorded #ML-3467",
//     color: "secondary",
//     latitude: 9.0204,
//     longitude: 38.7465,
//   },
//   {
//     time: "12:00 am",
//     content: "Payment was made of $64.95 to Michael",
//     color: "success",
//     latitude: 9.0204,
//     longitude: 38.7465,
//   },
//   {
//     time: "09:30 am",
//     content: "New sale recorded #ML-3467",
//     color: "warning",
//     latitude: 9.0204,
//     longitude: 38.7465,
//   },
//   {
//     time: "09:30 am",
//     content: "New arrival recorded",
//     color: "error",
//     latitude: 9.0204,
//     longitude: 38.7465,
//   },
//   {
//     time: "12:00 am",
//     content: "Payment Received",
//     color: "success",
//     latitude: 9.0204,
//     longitude: 38.7465,
//   },
// ];
// const OnGoingDelivery = [
//   {
//     id: 1,
//     shipmentNumber: "EV-Teklu",
//     from: "Harer",
//     fromRegion: "Har 1",
//     to: "Adama",
//     toRegion: "Ada 1",
//     client: "Abebe Kebede",
//     company: "Marain, LTD",
//     type: "Coffee",
//     image: "/images/profile/user-1.jpg",
//     Phone: "0900423958",

//     price: "10000ETB",
//     quantity: "10 packages",
//     weight: "1000kg",

//     driver: "Teklu Moges",
//     truckNumber: "B-1234",
//     truckType: "Trailer Truck",
//     curDestinations: destinations,
//   },
//   {
//     id: 2,
//     shipmentNumber: "EV-120253",
//     from: "Harer",
//     fromRegion: "Har 1",
//     to: "Adama",
//     toRegion: "Ada 1",
//     client: "Kebede Abebe",
//     company: "Marain, LTD",
//     type: "Coffee",
//     image: "/images/profile/user-1.jpg",
//     Phone: "0900423958",

//     price: "10000ETB",
//     quantity: "10 packages",
//     weight: "1000kg",

//     driver: "Teklu Moges",
//     truckNumber: "B-1234",
//     truckType: "Trailer Truck",
//     curDestinations: destinations,
//   },
// ];

// const Page = () => {
//   const { data: session } = useSession();
//   const [open, setOpen] = useState<boolean>(true);

//   /////////////////////////////////////////////
//   const [approved, setPendingOrder] = useState<any>();
//   const [drivers, setDrivers] = useState<any>();
//   const [selected, setSelected] = useState<any>(0);

//   const [OnGoingDeliveryDB, setOnGoingDeliveryDB] = useState<any>();

//   useEffect(() => {
//     const fetchPendingOrder = async () => {
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
//       // "https://cofeetracebackend-2.onrender.com/api/v0/user/:id",
//       //
//       const users = await fetch(
//         "https://cofeetracebackend-2.onrender.com/api/v0/user/get-all",
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${session?.accessToken}`,
//           },
//         }
//       );
//       let drivers = await users.json();

//       // console.log("drivers  top", drivers);

//       if (session?.user?.role === "merchant") {
//         data = data?.data?.filter(
//           (order: any) =>
//             order.order_status.toLowerCase() === "pending" &&
//             order.order_status_farmer.toLowerCase() === "accepted" &&
//             order.driver_status.toLowerCase() === "accepted" &&
//             order.shipping_status.toLowerCase() === "picked" &&
//             order.driver_payment_status.toLowerCase() === "pending"
//         );
//       } else if (session?.user?.role === "driver") {
//         data = data?.data?.filter(
//           (order: any) =>
//             order.order_status.toLowerCase() === "pending" &&
//             order.driver_status.toLowerCase() === "accepted" &&
//             order.shipping_status.toLowerCase() === "picked" &&
//             order.driver_payment_status.toLowerCase() === "pending"
//         );
//       } else {
//         data = data?.data?.filter(
//           (order: any) =>
//             order.order_status.toLowerCase() === "pending" &&
//             order.order_status_farmer.toLowerCase() === "accepted" &&
//             order.driver_status.toLowerCase() === "accepted" &&
//             order.shipping_status.toLowerCase() === "picked" &&
//             order.driver_payment_status.toLowerCase() === "pending"
//         );
//       }

//       let OnGoingDeliveryDB2 = data?.map((item: any, i: number) => {
//         const curDriver = drivers?.result?.find(
//           (driver: any) => driver.id === item.driver_id
//         );

//         // console.log("curDriver", curDriver, item.driver_id, "di", drivers);

//         return {
//           id: item.id,
//           shipmentNumber: "DR-" + uuid4().substring(0, 5),
//           from: item.start_location || "Unknown", // Default to "Unknown" if undefined
//           fromRegion: "Ethiopia", // Assuming no region data available
//           to: item.end_location || "Unknown", // Default to "Unknown" if undefined
//           toRegion: "Ethiopia", // Assuming no region data available
//           client: curDriver?.name || "Unknown", // Default to "Unknown" if undefined
//           company: curDriver?.name?.substring(0, 5) + ",LTD" || "Unknown", // Default to "Unknown" if undefined
//           type: item.order_type || "Unknown", // Default to "Unknown" if undefined
//           image: curDriver?.image || "/images/profile/user-1.jpg", // Default image if undefined
//           Phone: curDriver?.phone || "Unknown", // Default to "Unknown" if undefined
//           price: `${item.total_price || 0} ETB`, // Default to 0 if undefined
//           quantity: `${item.quantity || 0} packages`, // Default to 0 if undefined
//           weight: (item.quantity || 0) * 1000, // Default to 0 if undefined
//           driver: curDriver?.name || item.farmer_name || "Unknown", // Default to "Unknown" if undefined
//           truckNumber: curDriver?.truck_number || "Unknown", // Default to "Unknown" if undefined
//           truckType: curDriver?.truck_type || "Unknown", // Default to "Unknown" if undefined
//           curDestinations: item.destinations_location || [], // Default to empty array if undefined
//           trailer_number: curDriver?.trailer_number || "Unknown", // Default to "Unknown" if undefined
//         };
//       });

//       setOnGoingDeliveryDB(OnGoingDeliveryDB2);

//       // console.log("approved", data);
//       // console.log("drivers", drivers);
//       // console.log("OnGoingDeliveryDB", OnGoingDeliveryDB2);
//       setPendingOrder(data);
//     };
//     fetchPendingOrder();
//   }, [session]);

//   /////////////////////////////////////////////

//   return (
//     <section>
//       {" "}
//       {OnGoingDeliveryDB ? (
//         <div className="">
//           <div className="hidden md:flex gap-16">
//             <div className="overflow-hidden overflow-y-scroll  max-h-[100dvh]">
//               <input
//                 type="text"
//                 placeholder="Search shipment..."
//                 className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:border-blue-500"
//               />
//               <h1 className="text-xl font-semibold mb-6 text-gray-700">
//                 Ongoing Delivery
//               </h1>
//               {OnGoingDeliveryDB &&
//                 OnGoingDeliveryDB?.map((delivery: any, i: number) => (
//                   <div key={i}>
//                     <div className="w-[370px] h-[374px] mb-10 ">
//                       <div className="bg-white shadow-lg border-2 border-palette-primary-main  rounded-lg p-6 w-full max-w-lg">
//                         <div className="border-b pb-4 mb-4">
//                           <div className="flex justify-between items-center mb-4">
//                             <div
//                               className="cursor-pointer"
//                               onClick={() => {
//                                 setSelected(i);
//                                 setOpen(true);
//                               }}
//                             >
//                               <p className="text-sm text-gray-500">
//                                 Shipment number
//                               </p>
//                               <p className="text-lg font-bold text-gray-700">
//                                 {delivery.shipmentNumber}
//                               </p>
//                               <p className="text-sm text-gray-600">
//                                 {delivery.type}
//                               </p>
//                             </div>
//                             <div>
//                               <Image
//                                 src="/images/icons/buss.svg"
//                                 alt="qr-code"
//                                 width={100}
//                                 height={100}
//                                 className="cursor-pointer"
//                                 onClick={() => {
//                                   setSelected(i);
//                                   setOpen(true);
//                                 }}
//                               />
//                             </div>
//                           </div>
//                         </div>

//                         <div className="mb-6">
//                           <div className="flex items-center mb-4">
//                             <MdMyLocation className="text-blue-600 text-xl" />
//                             <div className="ml-3">
//                               <p className="text-lg font-semibold text-gray-700">
//                                 {delivery.from}
//                               </p>
//                               <p className="text-xs text-gray-500">
//                                 {delivery.fromRegion}
//                               </p>
//                             </div>
//                           </div>

//                           <div className="flex items-center">
//                             <IoLocationSharp className="text-red-500 text-xl" />
//                             <div className="ml-3">
//                               <p className="text-lg font-semibold text-gray-700">
//                                 {delivery.to}
//                               </p>
//                               <p className="text-xs text-gray-500">
//                                 {delivery.toRegion}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                         <div
//                           className="flex items-center justify-between cursor-pointer"
//                           onClick={() => {
//                             setSelected(i);
//                             setOpen(true);
//                           }}
//                         >
//                           <div className="flex items-center gap-4">
//                             <Image
//                               src="/images/profile/user-1.jpg"
//                               alt="profile"
//                               width={60}
//                               height={60}
//                               className="rounded-full"
//                             />
//                             <div>
//                               <p className="text-sm text-gray-500">Client</p>
//                               <p className="text-lg font-semibold text-gray-700">
//                                 {delivery.client}
//                               </p>
//                               <p className="text-sm text-gray-600">
//                                 {delivery.company}
//                               </p>
//                             </div>
//                           </div>
//                           <div className="flex gap-2">
//                             <Link
//                               href={`tel:+${delivery.Phone}`}
//                               className="bg-palette-secondary-light cursor-pointer text-white rounded-md p-2"
//                             >
//                               <FiPhone className="text-palette-primary-main    text-xl" />
//                             </Link>
//                             <Link
//                               href="http://localhost:3000/message"
//                               className="bg-palette-secondary-light cursor-pointer text-white rounded-md p-2"
//                             >
//                               <MdMessage className="text-palette-primary-main  text-xl" />
//                             </Link>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//             </div>
//             <div className="flex flex-col gap-6 overflow-hidden overflow-y-scroll  max-h-[100dvh]">
//               <div className="p-6  bg-white border max-h-[200px]  rounded-md shadow-md">
//                 <div className="md:w-[500px] w-[380px] flex flex-col gap-4 ">
//                   <h1 className="font-semibold text-lg ">Shipping Info</h1>
//                   <div className="flex justify-between ">
//                     <div className="w-1/3">
//                       <p className="text-gray-400">Shipment Number</p>
//                       <p className="text-gray-800 font-semibold">
//                         {OnGoingDeliveryDB &&
//                           OnGoingDeliveryDB[selected].shipmentNumber}
//                       </p>
//                     </div>
//                     <div className="w-1/3 ml-5">
//                       <p className="text-gray-400">campany</p>
//                       <p className="text-gray-800 font-semibold">
//                         {OnGoingDeliveryDB &&
//                           OnGoingDeliveryDB[selected].company}
//                       </p>
//                     </div>
//                     <div className="w-1/3 ml-5">
//                       <p className="text-gray-400">Type</p>
//                       <p
//                         className="text-gray-800 font-semibold"
//                         // style={{ textTransform: "capitalize" }}
//                       >
//                         {OnGoingDeliveryDB && OnGoingDeliveryDB[selected].type}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex justify-between">
//                     <div className="w-1/3">
//                       <p
//                         className="text-gray-400"
//                         // style={{ textTransform: "capitalize" }}
//                       >
//                         Quantity
//                       </p>
//                       <p
//                         className="text-gray-800 font-semibold"
//                         // style={{ textTransform: "capitalize" }}
//                       >
//                         {OnGoingDeliveryDB &&
//                           OnGoingDeliveryDB[selected].quantity}
//                       </p>
//                     </div>
//                     <div className="w-1/3 ml-5">
//                       <p
//                         className="text-gray-400"
//                         // style={{ textTransform: "capitalize" }}
//                       >
//                         Weight
//                       </p>
//                       <p
//                         className="text-gray-800 font-semibold"
//                         // style={{ textTransform: "capitalize" }}
//                       >
//                         {OnGoingDeliveryDB &&
//                           OnGoingDeliveryDB[selected].weight}
//                       </p>
//                     </div>
//                     <div className="w-1/3 ml-5">
//                       <p
//                         className="text-gray-400"
//                         // style={{ textTransform: "capitalize" }}
//                       >
//                         Price
//                       </p>
//                       <p
//                         className="text-gray-800 font-semibold"
//                         // style={{ textTransform: "capitalize" }}
//                       >
//                         {OnGoingDeliveryDB && OnGoingDeliveryDB[selected].price}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="p-6  bg-white border max-h-[200px]  rounded-md shadow-md">
//                 <div className="md:w-[500px] w-[380px] flex flex-col gap-4 ">
//                   <h1 className="font-semibold text-lg ">Driver Info</h1>
//                   {/* <DashboardCard title="Driver Info" /> */}
//                   <div className="flex justify-between">
//                     <div className="flex gap-2 items-center">
//                       <Image
//                         src="/images/profile/user-1.jpg"
//                         width={60}
//                         height={60}
//                         alt="new"
//                         className="rounded-full"
//                       />
//                       <div>
//                         <p className="text-gray-800 font-semibold">
//                           {OnGoingDeliveryDB &&
//                             OnGoingDeliveryDB[selected].driver}
//                         </p>
//                         <p className="text-gray-400">Online</p>
//                       </div>
//                     </div>
//                     <div>
//                       <div className="flex gap-2">
//                         <Link
//                           href={`tel:+${
//                             OnGoingDeliveryDB &&
//                             OnGoingDeliveryDB[selected].Phone
//                           }`}
//                           className="bg-palette-secondary-light cursor-pointer text-white rounded-md p-2"
//                         >
//                           <FiPhone className="text-palette-primary-main    text-xl" />
//                         </Link>
//                         <Link
//                           href="http://localhost:3000/message"
//                           className="bg-palette-secondary-light cursor-pointer text-white rounded-md p-2"
//                         >
//                           <MdMessage className="text-palette-primary-main  text-xl" />
//                         </Link>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="flex justify-between">
//                     <div className="w-1/3">
//                       <p
//                         className="text-gray-400"
//                         // style={{ textTransform: "capitalize" }}
//                       >
//                         Truck number
//                       </p>
//                       <p
//                         className="text-gray-800 font-semibold"
//                         // style={{ textTransform: "capitalize" }}
//                       >
//                         {OnGoingDeliveryDB &&
//                           OnGoingDeliveryDB[selected].truckNumber}
//                       </p>
//                     </div>
//                     <div className="w-1/3 ml-5">
//                       <p
//                         className="text-gray-400"
//                         // style={{ textTransform: "capitalize" }}
//                       >
//                         Truck type
//                       </p>
//                       <p
//                         className="text-gray-800 font-semibold"
//                         // style={{ textTransform: "capitalize" }}
//                       >
//                         {OnGoingDeliveryDB &&
//                           OnGoingDeliveryDB[selected].truckType}
//                       </p>
//                     </div>
//                     <div className="w-1/3 ml-5">
//                       <p
//                         className="text-gray-400"
//                         // style={{ textTransform: "capitalize" }}
//                       >
//                         Trailer number
//                       </p>
//                       <p
//                         className="text-gray-800 font-semibold"
//                         // style={{ textTransform: "capitalize" }}
//                       >
//                         {OnGoingDeliveryDB &&
//                           OnGoingDeliveryDB[selected].truckNumber}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div>
//                 {OnGoingDeliveryDB && (
//                   <RecentTransactions id={OnGoingDeliveryDB[selected].id} />
//                 )}
//               </div>
//             </div>
//           </div>
//           <div className=" md:hidden items-center justify-center flex gap-16">
//             {!open && (
//               <div>
//                 <input
//                   type="text"
//                   placeholder="Search shipment..."
//                   className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:border-blue-500"
//                 />
//                 <h1 className="text-xl font-semibold mb-6 text-gray-700">
//                   Ongoing Delivery
//                 </h1>
//                 {OnGoingDelivery.map((delivery, i) => (
//                   <div key={i}>
//                     <div className="w-[380px] h-[374px] mb-10 ">
//                       <div className="bg-white shadow-lg border-2 border-palette-primary-main  rounded-lg p-6 w-full max-w-lg">
//                         <div className="border-b pb-4 mb-4">
//                           <div className="flex justify-between items-center mb-4">
//                             <div
//                               className="cursor-pointer"
//                               onClick={() => {
//                                 setSelected(i);
//                                 setOpen(true);
//                               }}
//                             >
//                               <p className="text-sm text-gray-500">
//                                 Shipment number
//                               </p>
//                               <p className="text-lg font-bold text-gray-700">
//                                 {delivery.shipmentNumber}
//                               </p>
//                               <p className="text-sm text-gray-600">
//                                 {delivery.type}
//                               </p>
//                             </div>
//                             <div>
//                               <Image
//                                 src="/images/icons/buss.svg"
//                                 alt="qr-code"
//                                 width={100}
//                                 height={100}
//                                 className="cursor-pointer"
//                                 onClick={() => {
//                                   setSelected(i);
//                                   setOpen(true);
//                                 }}
//                               />
//                             </div>
//                           </div>
//                         </div>

//                         <div className="mb-6">
//                           <div className="flex items-center mb-4">
//                             <MdMyLocation className="text-blue-600 text-xl" />
//                             <div className="ml-3">
//                               <p className="text-lg font-semibold text-gray-700">
//                                 {delivery.from}
//                               </p>
//                               <p className="text-xs text-gray-500">
//                                 {delivery.fromRegion}
//                               </p>
//                             </div>
//                           </div>

//                           <div className="flex items-center">
//                             <IoLocationSharp className="text-red-500 text-xl" />
//                             <div className="ml-3">
//                               <p className="text-lg font-semibold text-gray-700">
//                                 {delivery.to}
//                               </p>
//                               <p className="text-xs text-gray-500">
//                                 {delivery.toRegion}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                         <div
//                           className="flex items-center justify-between cursor-pointer"
//                           onClick={() => {
//                             setSelected(i);
//                             setOpen(true);
//                           }}
//                         >
//                           <div className="flex items-center gap-4">
//                             <Image
//                               src="/images/profile/user-1.jpg"
//                               alt="profile"
//                               width={60}
//                               height={60}
//                               className="rounded-full"
//                             />
//                             <div>
//                               <p className="text-sm text-gray-500">Client</p>
//                               <p className="text-lg font-semibold text-gray-700">
//                                 {delivery.client}
//                               </p>
//                               <p className="text-sm text-gray-600">
//                                 {delivery.company}
//                               </p>
//                             </div>
//                           </div>
//                           <div className="flex gap-2">
//                             <Link
//                               href={`tel:+${delivery.Phone}`}
//                               className="bg-palette-secondary-light cursor-pointer text-white rounded-md p-2"
//                             >
//                               <FiPhone className="text-palette-primary-main    text-xl" />
//                             </Link>
//                             <Link
//                               href="http://localhost:3000/message"
//                               className="bg-palette-secondary-light cursor-pointer text-white rounded-md p-2"
//                             >
//                               <MdMessage className="text-palette-primary-main  text-xl" />
//                             </Link>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//             {open && (
//               <div>
//                 <div
//                   onClick={() => setOpen(false)}
//                   className="cursor-pointer text-right"
//                 >
//                   <p className="text-palette-primary-main text-xl p-2 courser-pointer">
//                     close
//                   </p>
//                 </div>
//                 <div className="flex flex-col  gap-6 ">
//                   <div className="md:p-6 p-2  bg-white border max-h-[200px]  rounded-md shadow-md">
//                     <div className="md:w-[500px] w-[370px] flex flex-col gap-4 ">
//                       <h1 className="font-semibold text-lg ">Shipping Info</h1>
//                       <div className="flex justify-between ">
//                         <div className="w-1/3">
//                           <p className="text-gray-400">Shipment Number</p>
//                           <p className="text-gray-800 font-semibold">
//                             {OnGoingDeliveryDB &&
//                               OnGoingDeliveryDB[selected].shipmentNumber}
//                           </p>
//                         </div>
//                         <div className="w-1/3 ml-5">
//                           <p className="text-gray-400">campany</p>
//                           <p className="text-gray-800 font-semibold">
//                             {OnGoingDeliveryDB &&
//                               OnGoingDeliveryDB[selected].company}
//                           </p>
//                         </div>
//                         <div className="w-1/3 ml-5">
//                           <p className="text-gray-400">Type</p>
//                           <p
//                             className="text-gray-800 font-semibold"
//                             // style={{ textTransform: "capitalize" }}
//                           >
//                             {OnGoingDeliveryDB &&
//                               OnGoingDeliveryDB[selected].type}
//                           </p>
//                         </div>
//                       </div>
//                       <div className="flex justify-between">
//                         <div className="w-1/3">
//                           <p
//                             className="text-gray-400"
//                             // style={{ textTransform: "capitalize" }}
//                           >
//                             Quantity
//                           </p>
//                           <p
//                             className="text-gray-800 font-semibold"
//                             // style={{ textTransform: "capitalize" }}
//                           >
//                             {OnGoingDeliveryDB &&
//                               OnGoingDeliveryDB[selected].quantity}
//                           </p>
//                         </div>
//                         <div className="w-1/3 ml-5">
//                           <p
//                             className="text-gray-400"
//                             // style={{ textTransform: "capitalize" }}
//                           >
//                             Weight
//                           </p>
//                           <p
//                             className="text-gray-800 font-semibold"
//                             // style={{ textTransform: "capitalize" }}
//                           >
//                             {OnGoingDeliveryDB &&
//                               OnGoingDeliveryDB[selected].weight}
//                           </p>
//                         </div>
//                         <div className="w-1/3 ml-5">
//                           <p
//                             className="text-gray-400"
//                             // style={{ textTransform: "capitalize" }}
//                           >
//                             Price
//                           </p>
//                           <p
//                             className="text-gray-800 font-semibold"
//                             // style={{ textTransform: "capitalize" }}
//                           >
//                             {OnGoingDeliveryDB &&
//                               OnGoingDeliveryDB[selected].price}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="p-6  bg-white border max-h-[200px]  rounded-md shadow-md">
//                     <div className="md:w-[500px] w-[380px] flex flex-col gap-4 ">
//                       <h1 className="font-semibold text-lg ">Driver Info</h1>
//                       {/* <DashboardCard title="Driver Info" /> */}
//                       <div className="flex justify-between">
//                         <div className="flex gap-2 items-center">
//                           <Image
//                             src="/images/profile/user-1.jpg"
//                             width={60}
//                             height={60}
//                             alt="new"
//                             className="rounded-full"
//                           />
//                           <div>
//                             <p className="text-gray-800 font-semibold">
//                               {OnGoingDeliveryDB &&
//                                 OnGoingDeliveryDB[selected].driver}
//                             </p>
//                             <p className="text-gray-400">Online</p>
//                           </div>
//                         </div>
//                         <div>
//                           <div className="flex gap-2">
//                             <Link
//                               href={`tel:+${
//                                 OnGoingDeliveryDB &&
//                                 OnGoingDeliveryDB[selected].Phone
//                               }`}
//                               className="bg-palette-secondary-light cursor-pointer text-white rounded-md p-2"
//                             >
//                               <FiPhone className="text-palette-primary-main    text-xl" />
//                             </Link>
//                             <Link
//                               href="http://localhost:3000/message"
//                               className="bg-palette-secondary-light cursor-pointer text-white rounded-md p-2"
//                             >
//                               <MdMessage className="text-palette-primary-main  text-xl" />
//                             </Link>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="flex justify-between">
//                         <div className="w-1/3">
//                           <p
//                             className="text-gray-400"
//                             // style={{ textTransform: "capitalize" }}
//                           >
//                             Truck number
//                           </p>
//                           <p
//                             className="text-gray-800 font-semibold"
//                             // style={{ textTransform: "capitalize" }}
//                           >
//                             {OnGoingDeliveryDB &&
//                               OnGoingDeliveryDB[selected].truckNumber}
//                           </p>
//                         </div>
//                         <div className="w-1/3 ml-5">
//                           <p
//                             className="text-gray-400"
//                             // style={{ textTransform: "capitalize" }}
//                           >
//                             Truck type
//                           </p>
//                           <p
//                             className="text-gray-800 font-semibold"
//                             // style={{ textTransform: "capitalize" }}
//                           >
//                             {OnGoingDeliveryDB &&
//                               OnGoingDeliveryDB[selected].truckType}
//                           </p>
//                         </div>
//                         <div className="w-1/3 ml-5">
//                           <p
//                             className="text-gray-400"
//                             // style={{ textTransform: "capitalize" }}
//                           >
//                             Trailer number
//                           </p>
//                           <p
//                             className="text-gray-800 font-semibold"
//                             // style={{ textTransform: "capitalize" }}
//                           >
//                             {OnGoingDeliveryDB &&
//                               OnGoingDeliveryDB[selected].truckNumber}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div>
//                     {OnGoingDeliveryDB && (
//                       <RecentTransactions id={OnGoingDeliveryDB[selected].id} />
//                     )}
//                   </div>
//                 </div>{" "}
//               </div>
//             )}
//           </div>
//         </div>
//       ) : (
//         <h1
//           className="text-center text-2xl font-semibold text-gray-500"
//           style={{ marginTop: "10rem" }}
//         >
//           No Ongoing Delivery
//         </h1>
//       )}
//     </section>
//   );
// };

// export default Page;


"use client";
// import RecentTransactions from "../../components/Transaction/recentTransactions";
// import Cards from "../../components/Transaction/transactionCards";
// import { useState } from "react";

// const Transactions = () => {

//   const [  TotalEarnings,setTotalEarnings] = useState(0)
//   const [  TotalAmount,setTotalAmount] = useState(0)
//   return (
//     <>
//       <div className="flex flex-col gap-8">
//         <Cards earlning = {TotalEarnings} expense = {TotalAmount} />
//         <RecentTransactions setTotalEarnings = {setTotalEarnings} setTotalAmount = {setTotalAmount} />
//       </div>
//     </>
//   );
// };

// export default Transactions;


import dynamic from "next/dynamic";


export default function Transactions() {
  return (
    <>
      <div className="flex flex-col gap-8">
        comming soon
      </div>
    </>
  );
}
