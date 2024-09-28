import React from "react";
import { FaCircle } from "react-icons/fa";
import { FaRegCircle } from "react-icons/fa";
import { FaNoteSticky } from "react-icons/fa6";
import { IoArchiveOutline } from "react-icons/io5";
import { CiTrash } from "react-icons/ci";

const Sidebar = ({ setSelectedComponent }) => {
  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      } else {
        console.error("Failed to log out");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  return (
    <div className="p-7 sticky top-0 h-[100vh] flex flex-col justify-between">
      {" "}
      <div className="flex ">
        <div className="relative text-blue-800 flex">
          <div className="absolute top-0 left-0">
            <FaCircle size={30} />
          </div>
          <div className="absolute left-4">
            <FaRegCircle size={30} />
          </div>
        </div>
        <div className="ml-14 flex gap-1 ">
          <p className="font-bold text-xl text-blue-800">T</p>
          <p className="font-bold text-xl text-blue-800">U</p>
          <p className="font-bold text-xl text-blue-800">G</p>
          <p className="font-bold text-xl text-blue-800">U</p>
        </div>
      </div>
      <div className="flex gap-9 text-[17px] ml-3 flex-col">
        <div
          onClick={() => setSelectedComponent("notes")}
          className="flex items-center gap-3 cursor-pointer"
        >
          <FaNoteSticky />
          <p className="prompt-semibold">Notes</p>
        </div>
        <div
          onClick={() => setSelectedComponent("archieve")}
          className="flex items-center gap-3 cursor-pointer"
        >
          <IoArchiveOutline />
          <p className="prompt-semibold">Archive</p>
        </div>
        <div
          onClick={() => setSelectedComponent("trash")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <CiTrash className="text-xl" />
          <p className="prompt-semibold">Trash</p>
        </div>
      </div>
      <div className="items-center gap-2 w-fit flex flex-col">
        <div className="w-32">
          <img className="w-full" src="/notesvg.png" alt="Note icon"></img>
        </div>
        <div className="">
          <button
            onClick={handleLogout}
            className="bg-blue-700 mr-4 text-white rounded-lg hover:bg-blue-500 duration-150 font-semibold p-2"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
