"use client";
import { useState } from "react";
import Link from "next/link";
import { FaGoogle } from "react-icons/fa";
import { RiFacebookCircleFill } from "react-icons/ri";
import { TbBrandApple } from "react-icons/tb";
import Image from "next/image";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import { useRouter } from "next/navigation";

const SignUp = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Farmer", // default role
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://cofeetracebackend-2.onrender.com/api/v0/user/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Registration successful:", data);
        router.push("/authentication/login");
      } else {
        console.error("Registration failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error during registration request:", error);
    }
  };

  return (
    <PageContainer title="Sign Up" description="this is Sign page">
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-6 md:flex md:space-x-10">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col space-y-4 md:w-1/2 md:mt-16"
          >
            <div className="flex justify-center text-bold">
              <h2 className="text-2xl text-gray-800 font-bold">Sign Up</h2>
            </div>

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              className="bg-gray-200 px-4 py-2 min-w-[330px] max-w-[350px] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="bg-gray-200 px-4 py-2 min-w-[330px] max-w-[350px] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="bg-gray-200 px-4 py-2 rounded-lg min-w-[330px] max-w-[350px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="bg-gray-200 px-4 py-2 min-w-[330px] max-w-[350px] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Farmer">Farmer</option>
              <option value="merchant">Buyer</option>
              <option value="driver">Transporter</option>
            </select>

            <button
              type="submit"
              className="bg-palette-primary-main text-white py-2 px-4 rounded-lg hover:bg-palette-primary-dark transition duration-300 max-w-[350px]"
            >
              Submit
            </button>
            <div>
              <p className="text-center">
                Already have an account?&nbsp; &nbsp;
                <Link
                  href="/authentication/login"
                  className="text-blue-500 hover:underline"
                >
                  Login
                </Link>
              </p>
            </div>

            <div>
              <p className="text-center font-[calibri]">Or login with</p>
              <div className="flex justify-center space-x-4 my-2">
                <div className="bg-red-100 w-[76px] h-[30px] rounded-full flex justify-center items-center">
                  <FaGoogle className="text-red-500" />
                </div>
                <div
                  className="bg-blue-100 w-[76px] h-[30px] rounded-full flex justify-center items-center"
                  style={{ color: "#3b5998" }}
                >
                  <RiFacebookCircleFill className="text-blue-500" />
                </div>
                <div className="bg-[#F3F4F6] w-[76px] h-[30px] rounded-full flex justify-center items-center">
                  <TbBrandApple />
                </div>
              </div>
            </div>
          </form>

          <div className="hidden md:block md:w-1/2">
            <Image
              src="/images/auth/login.svg"
              alt="signup"
              width={400}
              height={400}
              className="rounded-lg"
            />
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default SignUp;
