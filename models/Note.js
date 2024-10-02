import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema(
  {
    userID: {
      type: String,
      required: true,
    },
    folderId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Folder",
        default: [],
      },
    ],
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    isDeleted: { type: Boolean, default: false },
    isArchieved: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Note = mongoose.models.Note || mongoose.model("Note", NoteSchema);

export default Note;
