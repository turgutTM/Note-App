"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { FaBoxArchive } from "react-icons/fa6";
import { MdDeleteOutline } from "react-icons/md";

const Folder = () => {
  const { id } = useParams();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [folderName, setFolderName] = useState("");

  const fetchFolderNotes = async () => {
    try {
      const response = await axios.get(`/api/folder-notes/${id}`);
      setNotes(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching notes:", err);
      setError("An error occurred while fetching the notes.");
      setLoading(false);
    }
  };

  const fetchFolder = async () => {
    try {
      const response = await axios.get(`/api/single-folder/${id}`);
      const folder = response.data;
      setFolderName(folder.folderName);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching folder:", err);
      setError("An error occurred while fetching the folder.");
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
        console.error("Error adding note to trashbin");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleArchiveNote = async (noteId) => {
    try {
      const response = await fetch(`/api/move-arhieve/${noteId}`, {
        method: "PUT",
      });

      if (response.ok) {
        fetchNotes();
      } else {
        console.error("Error adding note to trashbin");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchFolderNotes();
      fetchFolder();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center text-2xl text-gray-700">
          Loading notes...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-indigo-100 p-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Notes in {folderName}
        </h1>
        {notes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {notes.map((note) => (
              <div
                key={note._id}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 transform hover:scale-105"
              >
                <div className="flex justify-between">
                  <h3 className="font-semibold text-xl text-gray-900 mb-3">
                    {note.title}
                  </h3>
                  <div className="flex items-center gap-2 ">
                    <FaBoxArchive
                      className="text-xs hover:scale-110 mb-2 duration-150 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleArchiveNote(note._id);
                      }}
                    />

                    <MdDeleteOutline
                      className="text-red-600 mb-2 hover:scale-110 duration-150 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(note._id);
                      }}
                    />
                  </div>
                </div>
                <p className="text-gray-600 text-sm line-clamp-3">
                  {note.content.length > 100
                    ? note.content.substring(0, 100) + "..."
                    : note.content}
                </p>
                <div className="mt-4">
                  <button className="text-indigo-600 hover:text-indigo-800 font-semibold">
                    Read More
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-center mt-16">
            No notes found in this folder.
          </div>
        )}
      </div>
    </div>
  );
};

export default Folder;
