"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { MdDeleteOutline } from "react-icons/md";
import { ClipLoader } from "react-spinners";
import { BsThreeDots } from "react-icons/bs";
import { FaRegFolder } from "react-icons/fa";
import { toast } from "react-toastify";

const AllNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [foldersDot, setFoldersDot] = useState([]); 
  const userId = useSelector((state) => state.user.user._id);

  const fetchFoldersDot = async (noteId) => {
    setActiveNoteId(noteId === activeNoteId ? null : noteId);
    try {
      const response = await fetch(`/api/all-folders/${userId}`); 
      if (response.ok) {
        const data = await response.json();
        setFoldersDot(data);
      } else {
        console.error("Failed to fetch folders");
      }
    } catch (error) {
      console.error("Error fetching folders:", error);
    }
  };

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
        console.error("Failed to delete note");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleAddToFolder = async (noteId, folderId) => {
    try {
      const res = await fetch("/api/add-note-folder", {
        method: "POST",
        body: JSON.stringify({ noteId, folderId }),
      });

      if (res.status === 400) {
        const message = await res.text();
        toast.error(message);
      } else if (res.status === 200) {
        fetchNotes();
        toast.success("Note added to folder successfully");
      }
    } catch (error) {
      toast.error("An error occurred");
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
                className="bg-white shadow-lg p-6 rounded-xl border border-gray-200 hover:shadow-2xl duration-300 relative"
              >
                <div className="flex items-center mb-2">
                  <p className="text-gray-400 text-xs">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex justify-end w-full gap-2">
                    <MdDeleteOutline
                      className="text-red-600 hover:scale-110 duration-150 cursor-pointer"
                      onClick={() => handleDelete(note._id)}
                    />
                    <BsThreeDots
                      onClick={(e) => {
                        e.stopPropagation();
                        fetchFoldersDot(note._id);
                      }}
                      className="text-red-600 hover:scale-110 duration-150 cursor-pointer"
                    />
                    {activeNoteId === note._id && (
                      <div
                        className={`absolute right-0 z-10 w-64 top-10 mr-8 bg-white border border-gray-300 rounded-md shadow-lg ${
                          foldersDot.length > 3
                            ? "max-h-36 overflow-y-auto scrollbar-hide"
                            : "max-h-fit"
                        }`}
                      >
                        {foldersDot.map((folderDot) => (
                          <div
                            key={folderDot._id}
                            className="flex items-center cursor-pointer w-full"
                          >
                            <div className="font-semibold flex items-center gap-2 p-2">
                              <FaRegFolder className="text-yellow-600" />
                              <span>{folderDot.folderName}</span>
                            </div>
                            <button
                              className="ml-auto rounded-2xl border-black p-1 mr-2 text-sm pl-2 pr-2 text-black hover:bg-black hover:text-white duration-150"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToFolder(note._id, folderDot._id);
                              }}
                            >
                              Add to Folder
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
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
