import mongoose, { Schema } from "mongoose";

export const image_dimension = {
  height: 1500,
  width: 1080,
};

export interface Iimage {
  _id?: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  fileUrl?: string;
  controls?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  transformation?: {
    height: number;
    width: number;
    quality?: number;
  };
  userId: mongoose.Schema.Types.ObjectId | string; 
}

const ImageSchema: Schema<Iimage> = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    thumbnailUrl: { type: String, required: true },
    fileUrl: { type: String, required: true },
    transformation: {
      height: {
        type: Number,
        default: image_dimension.height,
      },
      width: {
        type: Number,
        default: image_dimension.width,
      },
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Image =
  mongoose.models?.Image || mongoose.model<Iimage>("Image", ImageSchema);
export default Image;
