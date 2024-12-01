"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FaGoogle } from "react-icons/fa";
import { RiFacebookCircleFill } from "react-icons/ri";
import { TbBrandApple } from "react-icons/tb";
import Image from "next/image";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const Login2 = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "Farmer", // default role
  });
  const [errorMessage, setErrorMessage] = useState("");

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission
    const result = await signIn("credentials", {
      redirect: false, // Prevent automatic redirect to handle it manually
      email: formData.email,
      password: formData.password,
      role: formData.role,
    });

    if (result?.error) {
      setErrorMessage(result.error); // Display error message if login fails
    } else {
      setErrorMessage(""); // Clear error on successful login
    }
  };

  // Role-based redirect after successful login
  useEffect(() => {
    if (session) {
      const role = session.user?.role;
      switch (role) {
        case "farmer":
          router.push("/farmer/Dashboard");
          break;
        case "merchant":
          router.push("/Buyer/Dashboard");
          break;
        case "driver":
          router.push("/Transporter/Dashboard");
          break;
        case "admin":
          router.push("/Admin/Dashboard");
          break;
        default:
          router.push("/Dashboard");
          break;
      }
    }
  }, [session, router]);

  return (
    <PageContainer title="Login" description="this is Login page">
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-6 md:flex md:space-x-10">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col space-y-4 md:w-1/2 md:mt-16"
          >
            <div className="flex justify-center text-bold">
              <h2 className="text-2xl text-gray-800 font-bold">Login</h2>
            </div>
            {errorMessage && (
              <div className="text-red-500 text-center">{errorMessage}</div>
            )}
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
              className="bg-gray-200 px-4 py-2 min-w-[330px] max-w-[350px] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

            <div className="flex items-center min-w-[330px] max-w-[350px] justify-between">
              <div>
                <input type="checkbox" className="mr-2" />
                <span>Remember me</span>
              </div>
              <Link
                href="/auth/forgot-password"
                className="text-palette-primary-dark hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="bg-palette-primary-main text-white py-2 px-4 rounded-lg hover:bg-palette-primary-dark transition duration-300 max-w-[350px]"
            >
              Submit
            </button>

            <div>
              <p className="text-center">
                Don&apos;t have an account?&nbsp;&nbsp;
                <Link
                  href="/authentication/register"
                  className="text-blue-500 hover:underline"
                >
                  Register
                </Link>
              </p>
            </div>

            <div>
              <p className="text-center font-[calibri]">Or login with</p>
              <div className="flex justify-center space-x-4 my-2">
                <div
                  className="bg-red-100 w-[76px] h-[30px] rounded-full flex justify-center items-center cursor-pointer"
                  onClick={() => signIn("google")}
                >
                  <FaGoogle className="text-red-500" />
                </div>
                <div
                  className="bg-blue-100 w-[76px] h-[30px] rounded-full flex justify-center items-center cursor-pointer"
                  onClick={() => signIn("facebook")}
                >
                  <RiFacebookCircleFill className="text-blue-500" />
                </div>
                <div
                  className="bg-[#F3F4F6] w-[76px] h-[30px] rounded-full flex justify-center items-center cursor-pointer"
                  onClick={() => signIn("apple")}
                >
                  <TbBrandApple />
                </div>
              </div>
            </div>
          </form>

          <div className="hidden md:block md:w-1/2">
            <Image
              src="/images/auth/login.svg"
              alt="login"
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

export default Login2;
