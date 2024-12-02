"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FieldError, FieldErrorsImpl, Merge, useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

interface Product {
  id: string;
  farmer_id: string;
  farmer_name: string;
  product_name: string;
  description: string;
  price: string;
  quantity: string;
  origin: string;
  image_url: string;
  created_at: Date;
  updated_at: Date;
  rating: number;
}

interface Driver {
  id: string;
  name: string;
  start_location: string;
  end_location: string;
}

const OrderProduct = ({ product }: { product: Product }) => {
  const { data: session } = useSession();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();
  const [allDrivers, setAllDrivers] = useState<Driver[]>([]);
  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [error, setError] = useState<string>("");
  const [uploading, setUploading] = useState(false); // Initialize uploading state


  const selectedDestination = watch("destination");
  const drivingCoverage = watch("coverage");

  const notifySuccess = () => {
    toast.success("user Added successfully!", {
      position: "top-right",
      autoClose: 1000,
    });
  
    setTimeout(() => {
      setUploading(false)
    }, 1000); 
  };
  const notifyError = () => {
    toast.error("Failed to add the user.", {
      position: "top-right",
      autoClose: 1000,
    });
  
    setTimeout(() => {
      setUploading(false)
    }, 1000); 
  };

  // Fetch all drivers when the component mounts
  useEffect(() => {
    const fetchDrivers = async () => {
      if (!session?.accessToken) return;

      try {
        const response = await fetch(
          "https://cofeetracebackend-2.onrender.com/api/v0/user/get-all",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );
        const data = await response.json();
        const drivers = data.result.filter(
          (user: any) => user.role === "driver"
        );
        setAllDrivers(drivers);
      } catch (error) {
        console.error("Error fetching drivers:", error);
      }
    };

    fetchDrivers();
  }, [session]);

  // Filter drivers based on destination and product origin
  useEffect(() => {
    if (!selectedDestination || !product.origin) return;

    const filtered = allDrivers.filter(
      (driver) =>
        (driver.start_location.toLowerCase() ===
          selectedDestination.toLowerCase() &&
          driver.end_location.toLowerCase() === product.origin.toLowerCase()) ||
        (driver.end_location.toLowerCase() ===
          selectedDestination.toLowerCase() &&
          driver.start_location.toLowerCase() === product.origin.toLowerCase())
    );
    setFilteredDrivers(filtered);
  }, [selectedDestination, product.origin, allDrivers]);

  // Handle order submission
  const onSubmit = (data: any) => {
    if (drivingCoverage === "covered" && !selectedDriver) {
      setError("Please select a driver if the coverage is 'Covered'.");
      return;
    }
    setError("");
    const orderData = {
      product_id: product.id,
      quantity: parseInt(data.quantity, 10),
      end_location: data.destination,
      start_location: product.origin,
      // coverage: data.coverage,
      driver_id: data.driver,

      farmer_id: product.farmer_id,
      farmer_name: product.farmer_name,
      product_name: product.product_name,
      // price: product.price,
      total_price: parseInt(product.price, 10) * parseInt(data.quantity, 10),
      shipping_coverage: data.coverage,
      order_type: product.origin,
    };

    const createOrder = async () => {
      try {
        const response = await fetch(
          "https://cofeetracebackend-2.onrender.com/api/v0/order/create",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.accessToken}`,
            },
            body: JSON.stringify(orderData),
          }
        );
        const data = await response.json();
        if (response.ok) {
          console.log(response)
          notifySuccess();
        } else {
          notifyError();
        }
      } catch (error) {
        console.error("Error adding the product:", error);
        notifyError();
      }
    };

    createOrder();

    // console.log("Order data:", orderData);
  };

  return (
    <div className="flex flex-col gap-4 bg-white p-2 w-4/5 sm:w-1/3 border-2 rounded-xl">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2">
          <label htmlFor="destination">Destination</label>
          <input
            id="destination"
            type="text"
            className="p-2 border-2 border-gray-200 rounded-md outline-none"
            {...register("destination", {
              required: "Destination is required",
            })}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="quantity">Quantity</label>
          <input
            id="quantity"
            type="number"
            className="p-2 border-2 border-gray-200 rounded-md outline-none"
            max={parseInt(product.quantity, 10)}
            min={1}
            {...register("quantity", {
              required: "Quantity is required",
              min: 1,
            })}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="coverage">Driving Coverage</label>
          <select
            id="coverage"
            className="p-2 border-2 border-gray-200 rounded-md outline-none"
            {...register("coverage", { required: "Please select coverage" })}
          >
            <option value="covered">Covered</option>
            <option value="uncovered">Uncovered</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="driver">Driver Selection</label>
          <select
            id="driver"
            className="p-2 border-2 border-gray-200 rounded-md outline-none"
            disabled={drivingCoverage !== "covered"}
            {...register("driver")}
            onChange={(e) => {
              const driver = filteredDrivers.find(
                (d) => d.id === e.target.value
              );
              setSelectedDriver(driver || null);
              setValue("driver", driver?.id || "");
            }}
          >
            <option value="">Select Driver</option>
            {filteredDrivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.name}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <p className="text-red-500 text-center font-semibold">{error}</p>
        )}

        <div className="flex gap-2 mt-4 cursor-pointer">
          <input
            type="submit"
            value="Order Now"
            className="w-full p-2 border-2 cursor-pointer bg-[#A67B5B] text-white border-gray-200 rounded-md outline-none text-center"
          />
        </div>
      </form>
      <ToastContainer/>
    </div>
  );
};

export default OrderProduct;
