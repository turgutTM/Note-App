"use client";
import NotesField from "./components/NotesField";
import Sidebar from "@/app/components/Sidebar";
import Navbar from "./components/Navbar";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/app/features/UserSlice";
import { useRouter } from "next/navigation";
export default function Home() {
  const [selectedComponent, setSelectedComponent] = useState("notes");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("No token found. Please log in.");
        }

        const response = await fetch("/api/current-user", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch current user.");
        }

        const data = await response.json();
        console.log(data);

        setUserData(data);
        dispatch(setUser(data));
      } catch (err) {
        console.error(err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [dispatch, router]);

  return (
    <div className="flex  min-h-screen ">
      <div className="">
        <Sidebar setSelectedComponent={setSelectedComponent}></Sidebar>
      </div>
      <div className="flex flex-col w-full">
        <Navbar
          userData={userData}
          selectedComponent={selectedComponent}
        ></Navbar>
        <NotesField
          setSelectedComponent={setSelectedComponent}
          selectedComponent={selectedComponent}
        ></NotesField>
      </div>
    </div>
  );
}
