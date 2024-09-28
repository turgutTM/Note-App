import React from "react";
import NotesPage from "../(pages)/notespage/page";
import Archieve from "../(pages)/archieve/page";
import Trash from "../(pages)/trash/page";
import AllNotes from "../(pages)/allnotes/page";

const NotesField = ({ selectedComponent, setSelectedComponent }) => {
  console.log(selectedComponent);

  return (
    <div className="h-full">
      {selectedComponent === "notes" && (
        <NotesPage setSelectedComponent={setSelectedComponent}></NotesPage>
      )}
      {selectedComponent === "archieve" && <Archieve />}
      {selectedComponent === "trash" && <Trash />}
      {selectedComponent === "allnotes" && <AllNotes />}
    </div>
  );
};

export default NotesField;
