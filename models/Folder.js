import mongoose from "mongoose";

const FolderSchema = new mongoose.Schema({
  folderName: {
    type: String,
    required: true,
  },
  userID: {
    type: String,
    required: true,
  },
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Folder = mongoose.models.Folder || mongoose.model("Folder", FolderSchema);
export default Folder;
