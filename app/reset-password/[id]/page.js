"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ArrowBigLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function ResetPasswordPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  if (!session || session.user.role !== "admin") {
    setTimeout(() => {
      router.push("/");
    }, 3000);
    return (
      <>
        <div className="font-black text-2xl text-center mt-32">
          You are not allowed on this page!! Redirecting you to home page..
        </div>
      </>
    );
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/get-user?id=${id}`);
        const data = await response.json();

        if (data.status === "success") {
          setFormData((prevData) => ({
            ...prevData,
            email: data.data.EMAIL,
          }));
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

  const resetPassword = async (e) => {
    e.preventDefault();

    if (
      !formData.currentPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      toast.warn("Please fill in all fields.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New password and confirmation password do not match.");
      return;
    }

    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || "Password reset successful.");
        setFormData({
          email: formData.email,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        toast.error(result.message || "Failed to reset password.");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-black text-gray-600 text-center">
        Reset Password
      </h1>
      <Link href={"/"} className="btn flex w-max ml-auto">
        <ArrowBigLeft className="bg-transparent" />
        Go Back
      </Link>
      <div className="mt-10 w-11/12 md:w-3/4 lg:w-1/2 mx-auto">
        <form onSubmit={resetPassword} className="space-y-5">
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
                value={formData.email}
                disabled
                className="block w-full rounded-md border-0 py-2 text-gray-500 shadow-sm bg-gray-200 px-3"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="currentPassword"
              className="block text-sm font-medium leading-6 text-gray-600"
            >
              Current Password
            </label>
            <div className="relative mt-1">
              <input
                id="currentPassword"
                name="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                placeholder="Enter Current Password"
                value={formData.currentPassword}
                onChange={(e) =>
                  setFormData({ ...formData, currentPassword: e.target.value })
                }
                required
                className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-500 px-3"
              />
              {showCurrentPassword ? (
                <EyeOff
                  onClick={() => setShowCurrentPassword(false)}
                  className="absolute z-10 cursor-pointer right-3 top-1/2 transform -translate-y-1/2"
                />
              ) : (
                <Eye
                  onClick={() => setShowCurrentPassword(true)}
                  className="absolute z-10 cursor-pointer right-3 top-1/2 transform -translate-y-1/2"
                />
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium leading-6 text-gray-600"
            >
              New Password
            </label>
            <div className="relative mt-1">
              <input
                id="newPassword"
                name="newPassword"
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter New Password"
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData({ ...formData, newPassword: e.target.value })
                }
                required
                className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-500 px-3"
              />
              {showNewPassword ? (
                <EyeOff
                  onClick={() => setShowNewPassword(false)}
                  className="absolute z-10 cursor-pointer right-3 top-1/2 transform -translate-y-1/2"
                />
              ) : (
                <Eye
                  onClick={() => setShowNewPassword(true)}
                  className="absolute z-10 cursor-pointer right-3 top-1/2 transform -translate-y-1/2"
                />
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium leading-6 text-gray-600"
            >
              Confirm Password
            </label>
            <div className="relative mt-1">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm New Password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirmPassword: e.target.value,
                  })
                }
                required
                className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-500 px-3"
              />
              {showConfirmPassword ? (
                <EyeOff
                  onClick={() => setShowConfirmPassword(false)}
                  className="absolute z-10 cursor-pointer right-3 top-1/2 transform -translate-y-1/2"
                />
              ) : (
                <Eye
                  onClick={() => setShowConfirmPassword(true)}
                  className="absolute z-10 cursor-pointer right-3 top-1/2 transform -translate-y-1/2"
                />
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 py-2 text-sm font-bold text-white hover:bg-indigo-700"
            >
              Reset Password
            </button>
          </div>
        </form>
      </div>
      <ToastContainer autoClose={1500} />
    </div>
  );
}
