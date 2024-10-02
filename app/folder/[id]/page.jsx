"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { FaBoxArchive } from "react-icons/fa6";
import { MdDeleteOutline } from "react-icons/md";
import { IoMdClose } from "react-icons/io";

const Folder = () => {
  const { id } = useParams();
  const [notes, setNotes] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [folderName, setFolderName] = useState("");

  const fetchFolderNotes = async () => {
    try {
      const response = await axios.get(`/api/folder-notes/${id}`);

      if (response.data && response.data.length > 0) {
        setNotes(response.data);
      } else {
        setNotes([]);
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching notes:", err);
      setError("An error occurred while fetching the notes.");
      setLoading(false);
    }
  };
  const handleViewNote = (note) => {
    setSelectedNote(note);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setEditModalOpen(true);
  };
  const handleCloseNoteView = () => {
    setSelectedNote(null);
    setEditModalOpen(false);
  };
  const handleNoteUpdate = async () => {
    try {
      const response = await fetch(`/api/update-note/${selectedNote._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: noteContent,
          title: noteTitle,
        }),
      });

      if (response.ok) {  
        fetchFolderNotes();
        handleCloseNoteView();
      } else {
        console.error("Not güncelleme başarısız");
      }
    } catch (error) {
      console.error("Not güncellerken hata oluştu:", error);
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
        fetchFolderNotes();
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
        fetchFolderNotes();
      } else {
        console.error("Error adding note to trashbin");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCloseNote = async (noteId) => {
    try {
      const response = await fetch(`/api/delete-note-folder`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ folderId: id, noteId }),
      });

      if (response.ok) {
        fetchFolderNotes();
      } else {
        console.error("Error deleting note from folder");
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
    <div className="min-h-screen p-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center tracking-wide">
          Notes in <span className="text-indigo-600">{folderName}</span>
        </h1>
        {notes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {notes.map((note) => (
              <div
                key={note._id}
                onClick={() => handleViewNote(note)}
                className="bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition duration-300 transform hover:scale-105"
              >
                <div className="flex justify-between">
                  <h3 className="font-semibold text-xl text-gray-900 mb-3">
                    {note.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <FaBoxArchive
                      className="text-indigo-600 text-lg hover:scale-110 duration-150 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleArchiveNote(note._id);
                      }}
                    />

                    <MdDeleteOutline
                      className="text-red-600 text-lg hover:scale-110 duration-150 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(note._id);
                      }}
                    />
                    <IoMdClose
                      className="text-black text-lg hover:scale-110 duration-150 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCloseNote(note._id);
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
                  <button className="text-indigo-600 hover:text-indigo-800 font-semibold underline">
                    Read More
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-center mt-16 text-xl">
            Folder is empty :(
          </div>
        )}
        {editModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8  rounded-lg w-[35rem] shadow-xl">
              <h2 className="text-xl font-semibold mb-4">Edit Note</h2>
              <input
                type="text"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                maxLength={35}
                className="w-full mb-4 p-2  border border-gray-400 rounded-2xl focus:outline-none"
              />
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="w-full mb-4 border border-gray-400 p-2  focus:outline-none rounded-2xl"
                rows={8}
              ></textarea>
              <div className="flex justify-end gap-4 h-[38px]">
                <button
                  onClick={handleCloseNoteView}
                  className="px-4 py-2 flex justify-center items-center bg-white border-[1px]  hover:border-none border-black text-black font-medium rounded-full hover:bg-red-500 hover:text-white duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleNoteUpdate}
                  className="px-4 py-2 bg-blue-600 text-white  rounded-full hover:bg-blue-800 duration-200"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Folder;
