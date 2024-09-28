import React, { useState, useEffect } from "react";
import { FaTrashRestoreAlt, FaTrashAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Trash = () => {
  const [deletedNotes, setDeletedNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.user.user);

  const fetchDeletedNotes = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/all-notes/${user._id}`);
      if (response.ok) {
        const data = await response.json();
        const filteredNotes = data.filter((note) => note.isDeleted);
        setDeletedNotes(filteredNotes);
      } else {
        console.error("Error fetching notes");
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user._id) {
      fetchDeletedNotes();
    }
  }, [user]);

  const handleRestoreNote = async (noteId) => {
    try {
      const response = await fetch(`/api/move-trash/${noteId}`, {
        method: "PUT",
      });

      if (response.ok) {
        fetchDeletedNotes();
        toast.success("Note restored successfully!");
      } else {
        toast.error("Error restoring note");
        console.error("Error restoring note");
      }
    } catch (error) {
      toast.error("Error restoring note");
      console.error("Error:", error);
    }
  };

  const handleDeleteForever = async (noteId) => {
    try {
      const response = await fetch(`/api/delete-note/${noteId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setDeletedNotes((prevNotes) =>
          prevNotes.filter((note) => note._id !== noteId)
        );
        toast.success("Note deleted successfully!");
      } else {
        toast.error("Error deleting note");
        console.error("Error deleting note");
      }
    } catch (error) {
      toast.error("Error deleting note");
      console.error("Error deleting note:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <ToastContainer /> {/* ToastContainer burada */}
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <ClipLoader color="#000" loading={loading} size={50} />
        </div>
      ) : (
        <>
          {deletedNotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {deletedNotes.map((note) => (
                <div
                  key={note._id}
                  className="bg-white p-5 rounded-xl shadow-md"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-xl font-semibold">{note.title}</h2>
                    <p className="text-sm text-gray-500">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-gray-600 truncate">
                    {note.content.length > 100
                      ? note.content.substring(0, 100) + "..."
                      : note.content}
                  </p>
                  <div className="flex gap-4 mt-3">
                    <button
                      onClick={() => handleRestoreNote(note._id)}
                      className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition"
                    >
                      <FaTrashRestoreAlt />
                      Restore
                    </button>
                    <button
                      onClick={() => handleDeleteForever(note._id)}
                      className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition"
                    >
                      <FaTrashAlt />
                      Delete Forever
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No deleted notes, sorry...</p>
          )}
        </>
      )}
    </div>
  );
};

export default Trash;
