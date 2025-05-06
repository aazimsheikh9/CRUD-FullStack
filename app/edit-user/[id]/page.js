"use client";
import React, { useState, useEffect } from "react";
import Form from "next/form";
import Link from "next/link";
import { ArrowBigLeft } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams, useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();
  const { id } = useParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  const [initialData, setInitialData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/get-user?id=${id}`);
        const data = await response.json();

        if (data.status === "success") {
          setName(data.data.NAME);
          setEmail(data.data.EMAIL);
          setInitialData({
            name: data.data.NAME,
            email: data.data.EMAIL,
          });
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Error fetching user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email) {
      toast.warn("Please fill in all fields.");
      return;
    }

    try {
      const url = "/api/edit-user";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, userId: id }),
      });

      const data = await response.json();

      if (data.status === "success") {
        toast.success("User updated successfully!");
        setTimeout(() => {
          router.push("/");
        }, 1500);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("An error occurred while updating the user.");
    }
  };

  const isChanged = name !== initialData.name || email !== initialData.email;

  if (loading)
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-md"></span>
      </div>
    );

  return (
    <div className="p-10">
      <h1 className="text-center font-black text-3xl text-black/70">
        Edit User
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
        <button className="btn" type="submit" disabled={!isChanged}>
          Update
        </button>
      </Form>

      <ToastContainer autoClose={1500} />
    </div>
  );
};

export default page;
