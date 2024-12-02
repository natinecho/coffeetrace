// import React from "react";
// import PendingOrder from "../../components/Orders/pendingOrder";
// import ApporedOrder from "../../components/Orders/aprovedOrder";

// const page = () => {
//   return (
//     <div className="flex flex-col gap-8">
//       <PendingOrder />
//       {/* <ApporedOrder />
//        */}
//     </div>
//   );
// };

// export default page;

import dynamic from "next/dynamic";

const PendingOrder = dynamic(
  () => import("@/app/(DashboardLayout)/components/Orders/pendingOrder"),
  { ssr: false }
);
const ApporedOrder = dynamic(
  () => import("@/app/(DashboardLayout)/components/Orders/aprovedOrder"),
  { ssr: false }
);

export default function OrdersPage() {
  return (
    <>
      <PendingOrder />
      <ApporedOrder />
    </>
  );
}
