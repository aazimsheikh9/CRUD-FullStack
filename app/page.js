"use client";
import { useState, useEffect } from "react";
import { KeySquare, Pencil, Trash2, User } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function Home() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const { data: session, status } = useSession();
  const authorizedName = session?.user?.name;

  async function getUser() {
    try {
      const url = "/api/get-user";
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const res = await response.json();
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }
  useEffect(() => {
    getUser();
  }, []);

  const handleDelete = async (id) => {
    try {
      const url = "/api/delete-user";
      const body = { userId: id };

      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const res = await response.json();

      if (res.status === "success") {
        toast.success("User deleted successfully!");
        setUsers(users.filter((user) => user.ID !== id));
        setSelectedUser(null);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("An error occurred while deleting the user.");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.NAME.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
      user.EMAIL.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  function logOut() {
    toast.success("Logout successfully!");
    setTimeout(() => signOut(), 2000);
  }

  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-2">
        <p className="text-2xl font-black text-gray-700">
          Hi, {authorizedName}
        </p>
        <button
          className="btn btn-error w-max text-white font-black"
          onClick={logOut}
        >
          Log Out
        </button>
      </div>
      <h1 className="text-center font-black text-3xl text-black/70">
        CRUD APPLICATION
      </h1>
      <div className="flex justify-between items-center my-5">
        <input
          type="text"
          placeholder="Search.."
          className="input input-bordered w-1/4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Link href={"/create-user"} className="btn flex w-max ml-auto">
          <User className="bg-transparent" />
          Create User
        </Link>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>S.No.</th>
            <th>Name</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">
                No Data Available
              </td>
            </tr>
          ) : (
            filteredUsers.map((item, index) => (
              <tr key={index}>
                <td className="">{index + 1}</td>
                <td className="">{item.NAME}</td>
                <td className="">{item.EMAIL}</td>
                <td className="flex gap-5">
                  <Link
                    href={`/edit-user/${item.ID}`}
                    className="text-blue-300 cursor-pointer"
                  >
                    <Pencil />
                  </Link>
                  {session?.user?.role == "admin" && (
                    <Link
                      href={`/reset-password/${item.ID}`}
                      className="text-black/80 cursor-pointer"
                    >
                      <KeySquare />
                    </Link>
                  )}
                  <label
                    htmlFor="deleteModal"
                    className="text-red-600 cursor-pointer"
                    onClick={() => setSelectedUser(item)}
                  >
                    <Trash2 />
                  </label>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {selectedUser && (
        <div className="modal modal-open" role="dialog">
          <div className="modal-box">
            <p className="py-4 text-center text-base font-medium">
              Are you sure you want to delete user:{" "}
              <span className="font-black text-gray-700">
                {selectedUser.NAME}
              </span>
              ?
            </p>
            <div className="modal-action flex gap-2 justify-center">
              <button
                onClick={() => handleDelete(selectedUser.ID)}
                className="btn btn-error text-white"
              >
                Delete
              </button>
              <button onClick={() => setSelectedUser(null)} className="btn">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer autoClose={1500} />
    </div>
  );
}
