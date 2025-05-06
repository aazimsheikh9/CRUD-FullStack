"use client";
import React, { useState } from "react";
import Form from "next/form";
import Link from "next/link";
import { ArrowBigLeft, Eye, EyeOff } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.warn("Please fill in all fields.");
      return;
    }

    try {
      const url = "/api/create-user";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (data.status === "success") {
        toast.success("User created successfully!");
        setName("");
        setEmail("");
        setPassword("");

        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("An error occurred while creating the user.");
    }
  };
  return (
    <div className="p-10">
      <h1 className="text-center font-black text-3xl text-black/70">
        Create User
      </h1>
      <Link href={"/"} className="btn flex w-max ml-auto">
        <ArrowBigLeft className="bg-transparent" />
        Go Back
      </Link>
      <Form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-10">
        <div className="flex gap-5">
          <input
            type="text"
            placeholder="Enter Name"
            className="input input-bordered w-full"
            autoComplete="off"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Enter Email"
            className="input input-bordered w-full"
            autoComplete="off"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter Password"
            className="input input-bordered w-full"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {showPassword == false ? (
            <Eye
              onClick={() => setShowPassword(!showPassword)}
              className="absolute z-10 cursor-pointer right-5 top-0 bottom-0 my-auto"
            />
          ) : (
            <EyeOff
              onClick={() => setShowPassword(!showPassword)}
              className="absolute z-10 cursor-pointer right-5 top-0 bottom-0 my-auto"
            />
          )}
        </div>
        <button className="btn" type="submit">
          Submit
        </button>
      </Form>

      <ToastContainer autoClose={1500} />
    </div>
  );
};

export default page;
