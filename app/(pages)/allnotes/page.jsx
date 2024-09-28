"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { MdDeleteOutline } from "react-icons/md";
import { ClipLoader } from "react-spinners";

const AllNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state) => state.user.user._id);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/all-notes/${userId}`);
      if (response.ok) {
        const data = await response.json();
        const filteredNotes = data.filter((note) => !note.isDeleted);
        setNotes(filteredNotes);
      } else {
        console.error("Failed to fetch notes");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (noteId) => {
    try {
      const response = await fetch(`/api/move-trash/${noteId}`, {
        method: "PUT",
      });

      if (response.ok) {
        fetchNotes();
      } else {
        console.error("Not silme işlemi başarısız");
      }
    } catch (error) {
      console.error("Hata:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchNotes();
    }
  }, [userId]);

  return (
    <div className="h-full bg-gray-50 p-10 flex flex-col gap-10">
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <ClipLoader color="#000" loading={loading} size={50} />
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-8">
          {notes.length > 0 ? (
            notes.map((note) => (
              <div
                key={note._id}
                className="bg-white shadow-lg p-6 rounded-xl border border-gray-200 hover:shadow-2xl duration-300"
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="text-gray-400 text-xs">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                  <MdDeleteOutline
                    className="text-red-600 hover:scale-110 duration-150 cursor-pointer"
                    onClick={() => handleDelete(note._id)}
                  />
                </div>

                {note.folderName && (
                  <div className="text-gray-500 text-sm italic mb-2">
                    Folder: {note.folderName}
                  </div>
                )}

                <h3 className="font-bold text-lg text-gray-800 mb-2">
                  {note.title}
                </h3>
                <p className="text-gray-600 truncate">
                  {note.content.length > 100
                    ? note.content.substring(0, 100) + "..."
                    : note.content}
                </p>
              </div>
            ))
          ) : (
            <p>No notes available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AllNotes;
