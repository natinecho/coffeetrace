"use client";
import { TbMoneybag } from "react-icons/tb";
import { useState, useEffect } from "react";
import { FaLessThan, FaGreaterThan } from "react-icons/fa6";
import { useSession } from "next-auth/react";
import Loader from "../Loder/Loder";

const ApprovedOrder = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session, status } = useSession();
  // const approved = [
  //   {
  //     icon: <TbMoneybag />,
  //     name: "Fikru Mengistu",
  //     location: "Dire Dawa",
  //     type: "Harar",
  //     shipping: "Pending",
  //     quantity: "250 kg",
  //     totalPrice: "3000,000 birr",
  //     bg: "bg-pink-200",
  //   },
  //   {
  //     icon: <TbMoneybag />,
  //     name: "Girma Tesfaye",
  //     location: "Gondar",
  //     type: "Limu",
  //     shipping: "Pending",
  //     quantity: "180 kg",
  //     totalPrice: "3000,000 birr",
  //     bg: "bg-purple-200",
  //   },
  //   {
  //     icon: <TbMoneybag />,
  //     name: "Hana Belete",
  //     location: "Shashamane",
  //     type: "Bale",
  //     shipping: "Pending",
  //     quantity: "220 kg",
  //     bg: "bg-blue-200",
  //     totalPrice: "3000,000 birr",
  //   },
  //   {
  //     icon: <TbMoneybag />,
  //     name: "Ibrahim Mohammed",
  //     location: "Adama",
  //     type: "Aleta Wondo",
  //     shipping: "Pending",
  //     quantity: "160 kg",
  //     bg: "bg-green-200",
  //     totalPrice: "3000,000 birr",
  //   },
  //   {
  //     icon: <TbMoneybag />,
  //     name: "Jemal Ali",
  //     location: "Gambela",
  //     type: "Kaffa",
  //     shipping: "Pending",
  //     quantity: "210 kg",
  //     bg: "bg-yellow-200",
  //     totalPrice: "3000,000 birr",
  //   },
  //   {
  //     icon: <TbMoneybag />,
  //     name: "Kebede Desta",
  //     location: "Harar",
  //     type: "Illubabor",
  //     shipping: "Pending",
  //     quantity: "170 kg",
  //     bg: "bg-red-200",
  //     totalPrice: "3000,000 birr",
  //   },
  // ];

  ///////////////////////////////////////
  const [approved, setPendingOrder] = useState<any>();

  useEffect(() => {
    const fetchPendingOrder = async () => {
      setLoading(true);
      const response = await fetch(
        "https://cofeetracebackend-2.onrender.com/api/v0/order/getmyorders",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );
      let data = await response.json();

      if (session?.user?.role === "merchant") {
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
      } else if (session?.user?.role === "driver") {
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

      console.log("approved", data);
      setPendingOrder(data);
      setLoading(false);
    };
    fetchPendingOrder();
  }, [session]);

  const handlePayFarmer = async (order_id: string) => {
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
    let data = await response.json();
    console.log(data);
  };

  const handlePayDriver = async (order_id: string) => {
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
    let data = await response.json();
    console.log(data);
  };

  const handlePickOrder = async (order_id: string) => {
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
    let data = await response.json();
    console.log(data);
  };

  /////////////////////////////////////////

  const itemsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = approved && Math.ceil(approved.length / itemsPerPage);

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

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const renderPageButtons = () => {
    const pageButtons = [];
    for (let i = 1; i <= totalPages; i++) {
      pageButtons.push(
        <button
          key={i}
          onClick={() => handlePageClick(i)}
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

  return (
    <div>
      <h1 className="text-xl font-semibold my-4 text-[#343C6A]">
        Approved Orders
      </h1>

      {!(loading || status === "loading") ? (
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
                        onClick={() => handlePayDriver(items.id)}
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
          </div>

          <div className="w-full flex justify-center items-center mt-4">
            <div className="flex justify-center items-center p-4">
              <button
                className="cursor-pointer text-sm text-palette-primary-main flex items-center gap-1 px-4 py-1"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                <FaLessThan /> Previous
              </button>
              <div>{renderPageButtons()}</div>
              <button
                className="cursor-pointer text-sm text-palette-primary-main flex items-center gap-1 px-4 py-1"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next <FaGreaterThan />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex item-center justify-center mt-16">
          <Loader />;
        </div>
      )}
    </div>
  );
};

export default ApprovedOrder;
