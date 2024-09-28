import React, { useState, useEffect } from "react";
import { FaBoxOpen, FaTrashAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 

const Archieve = () => {
  const [archivedNotes, setArchivedNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.user.user);

  const fetchArchivedNotes = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/all-notes/${user._id}`);
      if (response.ok) {
        const data = await response.json();
        const filteredNotes = data.filter(
          (note) => !note.isDeleted && note.isArchieved
        );
        setArchivedNotes(filteredNotes);
      } else {
        console.error("Error fetching archived notes");
      }
    } catch (error) {
      console.error("Error fetching archived notes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user._id) {
      fetchArchivedNotes();
    }
  }, [user]);

  const handleUnarchiveNote = async (noteId) => {
    try {
      const response = await fetch(`/api/move-arhieve/${noteId}`, {
        method: "PUT",
      });
      if (response.ok) {
        fetchArchivedNotes();
        toast.success("Note unarchived successfully!");
      } else {
        toast.error("Error unarchiving note");
        console.error("Error unarchiving note");
      }
    } catch (error) {
      toast.error("Error unarchiving note");
      console.error("Error:", error);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      const response = await fetch(`/api/delete-note/${noteId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setArchivedNotes((prevNotes) =>
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
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <ClipLoader color="#000" loading={loading} size={50} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {archivedNotes.length > 0 ? (
            archivedNotes.map((note) => (
              <div key={note._id} className="bg-white p-5 rounded-xl shadow-md">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-semibold">{note.title}</h2>
                  <p className="text-sm text-gray-500">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-gray-600 mb-4">{note.content}</p>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleUnarchiveNote(note._id)}
                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition"
                  >
                    <FaBoxOpen />
                    Unarchive
                  </button>
                  <button
                    onClick={() => handleDeleteNote(note._id)}
                    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition"
                  >
                    <FaTrashAlt />
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No archived notes found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Archieve;
