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
import { useState } from "react";


const RecentTransactions = dynamic(
  () => import("@/app/(DashboardLayout)/components/Transaction/recentTransactions"),
  { ssr: false }
);
const Cards = dynamic(
  () => import("@/app/(DashboardLayout)/components/Transaction/transactionCards"),
  { ssr: false }
);

export default function Transactions() {
  const [  TotalEarnings,setTotalEarnings] = useState(0)
  const [  TotalAmount,setTotalAmount] = useState(0)
  return (
    <>
      <div className="flex flex-col gap-8">
        <Cards earlning = {TotalEarnings} expense = {TotalAmount} />
        <RecentTransactions setTotalEarnings = {setTotalEarnings} setTotalAmount = {setTotalAmount} />
      </div>
    </>
  );
}