"use client";
import Form from "next/form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RegisterPage() {
  const router = useRouter();
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const registerUser = async (e) => {
    e.preventDefault();

    if (!data.name || !data.email || !data.password) {
      toast.warn("Please fill in all fields.");
      return;
    }

    try {
      const url = "/api/register";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (responseData.status === "success") {
        toast.success("User created successfully!");
        setData({ name: "", email: "", password: "" });
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("An error occurred while creating the user.");
    }
  };
  return (
    <div className="p-10 h-screen">
      <h1 className="text-3xl font-black text-gray-600 text-center">
        Register Now
      </h1>
      <div className="mt-10 w-11/12 md:w-3/4 mx-auto">
        <Form onSubmit={registerUser} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium leading-6 text-gray-600"
            >
              Name
            </label>
            <div className="mt-1">
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter Name"
                required
                value={data.name}
                onChange={(e) => {
                  setData({ ...data, name: e.target.value });
                }}
                className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-slate-800 px-3"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-600"
            >
              Email
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter Email"
                required
                value={data.email}
                onChange={(e) => {
                  setData({ ...data, email: e.target.value });
                }}
                className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-slate-800 px-3"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium leading-6 text-gray-600"
            >
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter Password"
                required
                value={data.password}
                onChange={(e) => {
                  setData({ ...data, password: e.target.value });
                }}
                className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-slate-800 px-3"
              />
            </div>
          </div>

          <div className="">
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 py-2 text-sm font-bold text-white"
            >
              Register
            </button>
          </div>
        </Form>
        <div className="mt-4">
          <p className="font-semibold text-lg text-center">
            Existing User?{" "}
            <Link
              href={"/login"}
              className="font-black text-blue-700 hover:text-blue-500 duration-200"
            >
              Login Now!
            </Link>
          </p>
        </div>
      </div>

      <ToastContainer autoClose={1500} />
    </div>
  );
}
