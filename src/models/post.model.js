import mongoose from 'mongoose';
import { UUID } from "mongodb";

const PostSchema = new mongoose.Schema(
  {
    id: {
      type: UUID,
      default: () => new UUID(),
      unique: true
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrls: {
      type: [String],
      default: [],
    },
    createdBy: {
      type: UUID,
      ref: 'User',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model('Post', PostSchema);
export default Post;
