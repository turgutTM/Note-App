"use client";
import React, { useState, useEffect } from "react";
import { FaFolder } from "react-icons/fa";
import { CiStickyNote } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { useSelector } from "react-redux";
import { FaBoxArchive } from "react-icons/fa6";
import { BsThreeDots } from "react-icons/bs";
import { FaRegFolder } from "react-icons/fa6";
import { IoCloseSharp } from "react-icons/io5";

import Link from "next/link";
import { useRouter } from "next/navigation";

const NotesPage = ({ setSelectedComponent }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [dotModel, setDotModal] = useState(false);
  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [folderName, setFolderName] = useState("");
  const [folders, setFolders] = useState([]);
  const [foldersDot, setFoldersDot] = useState([]);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const router = useRouter();

  const user = useSelector((state) => state.user.user);

  const fetchNotes = async () => {
    try {
      const response = await fetch(`/api/all-notes/${user._id}`);
      if (response.ok) {
        const data = await response.json();
        const filteredNotes = data.filter(
          (note) => !note.isDeleted && !note.isArchieved
        );
        setNotes(filteredNotes);
      } else {
        console.error("Notları getirme başarısız");
      }
    } catch (error) {
      console.error("Notları çekerken hata oluştu:", error);
    }
  };

  const fetchFolders = async () => {
    try {
      const response = await fetch(`/api/all-folders/${user._id}`);
      if (response.ok) {
        const data = await response.json();
        setFolders(data);
      } else {
        console.error("Klasörleri getirme başarısız");
      }
    } catch (error) {
      console.error("Klasörleri çekerken hata oluştu:", error);
    }
  };

  const fetchFoldersDot = async (noteId) => {
    setActiveNoteId(noteId === activeNoteId ? null : noteId);
    try {
      const response = await fetch(`/api/all-folders/${user._id}`);
      if (response.ok) {
        const data = await response.json();
        setFoldersDot(data);
      } else {
        console.error("Klasörleri getirme başarısız");
      }
    } catch (error) {
      console.error("Klasörleri çekerken hata oluştu:", error);
    }
  };

  useEffect(() => {
    if (user && user._id) {
      fetchNotes();
      fetchFolders();
    }
  }, [user]);

  const handleNoteSubmit = async () => {
    try {
      const response = await fetch("/api/create-note", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: user._id,
          title: noteTitle,
          content: noteContent,
        }),
      });

      if (response.ok) {
        setIsModalOpen(false);
        setNoteTitle("");
        setNoteContent("");
        fetchNotes();
      } else {
        console.error("Not ekleme başarısız");
      }
    } catch (error) {
      console.error("Not eklerken hata oluştu:", error);
    }
  };

  const handleFolderSubmit = async () => {
    try {
      const response = await fetch("/api/create-folder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          folderName,
          userID: user._id,
        }),
      });

      if (response.ok) {
        setFolderModalOpen(false);
        setFolderName("");
        fetchFolders();
      } else {
        console.error("Klasör ekleme başarısız");
      }
    } catch (error) {
      console.error("Klasör eklerken hata oluştu:", error);
    }
  };

  const handleDeleteFolder = async (folderID) => {
    try {
      const response = await fetch(`/api/delete-folder/${folderID}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ folderID }),
      });

      if (response.ok) {
        fetchFolders();
        console.log("Folder deleted successfully");
      } else {
        console.error("Failed to delete folder");
      }
    } catch (error) {
      console.error("Error deleting folder:", error);
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

  const handleSeeAllNotes = () => {
    router.push("/allnotes");
  };

  const handleAddToFolder = async (noteId, folderId) => {
    try {
      const response = await fetch("/api/add-note-folder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ noteId, folderId }),
      });

      if (response.ok) {
        console.log("Note added to folder successfully");
      } else {
        console.error("Failed to add note to folder");
      }
    } catch (error) {
      console.error("Error adding note to folder:", error);
    }
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
        fetchNotes();
        handleCloseNoteView();
      } else {
        console.error("Not güncelleme başarısız");
      }
    } catch (error) {
      console.error("Not güncellerken hata oluştu:", error);
    }
  };

  return (
    <div className="h-full bg-gray-50 p-10 flex flex-col gap-10">
      <div className="flex flex-col gap-5">
        <div>
          <p className="font-semibold text-2xl">Recent Folders</p>
        </div>
        <div className="flex font-semibold text-gray-400 gap-14">
          <p>Today's</p>
          <p>This week</p>
          <p>This Month</p>
        </div>
        <div className="flex gap-8 mt-4 items-center overflow-x-auto scrollbar-hide">
          {folders.map((folder) => (
            <Link href={`/folder/${folder._id}`} key={folder._id}>
              <div className="w-[10rem] h-[10rem] relative flex flex-col items-center justify-center bg-yellow-100 border-2 border-gray-300 rounded-xl hover:shadow-lg cursor-pointer">
                <div
                  className="absolute top-2 right-2 text-xl text-gray-600 hover:text-gray-800"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDeleteFolder(folder._id);
                  }}
                >
                  <IoCloseSharp />
                </div>
                <div className="flex flex-col items-center">
                  <FaFolder className="text-5xl text-yellow-600 mb-3" />
                  <p className="font-semibold text-center">
                    {folder.folderName}
                  </p>
                </div>
              </div>
            </Link>
          ))}

          <div
            className="w-[10rem] h-[10rem] flex flex-col items-center justify-center bg-gray-100 border-2 border-gray-300 rounded-xl hover:shadow-lg cursor-pointer"
            onClick={() => setFolderModalOpen(true)}
          >
            <FaFolder className="text-5xl text-gray-400 mb-3" />
            <p className="font-semibold text-gray-500">New Folder</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <div>
          <p className="font-semibold text-2xl">Recent Notes</p>
        </div>
        <div className="grid grid-cols-3 gap-8 mt-4">
          {notes.slice(0, 3).map((note) => (
            <div
              key={note._id}
              onClick={() => handleViewNote(note)}
              className="bg-white shadow-lg w-full h-full p-6 rounded-xl border border-gray-200 hover:shadow-2xl  duration-300 cursor-pointer relative"
            >
              <div className="flex justify-between items-center mb-2">
                <p className="text-gray-400 text-xs">
                  {new Date(note.createdAt).toLocaleDateString()}
                </p>
                {note.folderName && (
                  <div className="text-white bg-blue-500 pl-2 pr-2 rounded-full text-sm">
                    {note.folderName}
                  </div>
                )}

                <div className="flex items-center gap-2 ">
                  <FaBoxArchive
                    className="text-xs hover:scale-110 duration-150 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleArchiveNote(note._id);
                    }}
                  />

                  <MdDeleteOutline
                    className="text-red-600 hover:scale-110 duration-150 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(note._id);
                    }}
                  />
                  <BsThreeDots
                    onClick={(e) => {
                      e.stopPropagation();
                      fetchFoldersDot(note._id);
                    }}
                    className="text-red-600 hover:scale-110 duration-150 cursor-pointer"
                  />
                  {activeNoteId === note._id && (
                    <div className="absolute right-0 z-10 w-64 top-9 mr-8 bg-white border border-gray-300 rounded-md shadow-lg overflow-hidden">
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
              <h3 className="font-bold text-lg text-gray-800 mb-2">
                {note.title}
              </h3>
              <p className="text-gray-600 truncate">
                {note.content.length > 100
                  ? note.content.substring(0, 100) + "..."
                  : note.content}
              </p>
            </div>
          ))}
          <div
            className="flex flex-col items-center border-2 border-dashed border-gray-400 rounded-xl p-8 transition-transform transform hover:scale-105 cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            <CiStickyNote className="text-4xl text-gray-500" />
            <p className="font-semibold text-gray-500 mt-4">New Note</p>
          </div>
        </div>
        {notes.length > 3 && (
          <div className="flex justify-center mt-6">
            <button
              onClick={handleSeeAllNotes}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              See All Notes
            </button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg w-[35rem] shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Create New Note</h2>
            <input
              type="text"
              placeholder="Title"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              maxLength={35}
              className="w-full mb-4 p-2 border border-gray-400 rounded-2xl focus:outline-none"
            />
            <textarea
              placeholder="Note content"
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              className="w-full mb-4 p-2 border border-gray-400 focus:outline-none rounded-xl"
              rows={8}
            ></textarea>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border-[1px] border-black rounded-full hover:text-white hover:bg-red-500 duration-200 "
              >
                Cancel
              </button>
              <button
                onClick={handleNoteSubmit}
                className="px-4 py-2 bg-blue-600  text-white rounded-full duration-300 hover:bg-blue-700"
              >
                Create Note
              </button>
            </div>
          </div>
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

      {folderModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg w-[25rem] shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Create New Folder</h2>
            <input
              type="text"
              placeholder="Folder Name"
              value={folderName}
              onChange={(e) => {
                if (e.target.value.length <= 20) {
                  setFolderName(e.target.value);
                }
              }}
              maxLength={20}
              className="w-full justify-center items-center  mb-4 p-2 border rounded focus:outline-none"
            />

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setFolderModalOpen(false)}
                className="px-4 py-2 bg-white  text-black  rounded-full  hover:bg-red-500 hover:text-white duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleFolderSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-full  hover:bg-blue-700"
              >
                Create Folder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesPage;
