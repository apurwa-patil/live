import mongoose from "mongoose";

const communitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // which user added it
    },
    title: { type: String, required: true },
    category: { type: String, required: true },
    location: { type: String },
    content: { type: String, required: true },
    images: [String],
  },
  { timestamps: true }
);

export default mongoose.model("Community", communitySchema);
