import mongoose from 'mongoose';
import { UUID } from "mongodb";

const VideoSchema = new mongoose.Schema(
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
    videoUrls: {
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

const Video = mongoose.model('Video', VideoSchema);
export default Video;
