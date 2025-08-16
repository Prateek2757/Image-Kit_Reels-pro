import mongoose, { Schema } from "mongoose";

export const Video_dimension = {
  height: 1920,
  width: 1080,
};

export interface IVideo {
  _id?: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  fileUrl?: string;
  controls?:boolean;
  createdAt?: Date;
  updatedAt?: Date;
  transformation?: {
    height: number;
    width: number;
    quality?: number;
  };
  userId: mongoose.Schema.Types.ObjectId | string;
}

const VideoSchema: Schema<IVideo> = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    thumbnailUrl: { type: String, required: true },
    fileUrl:{type:String , required:true},
    controls: { type: Boolean, default: true },
    transformation: {
      height: {
        type: Number,
        default: Video_dimension.height,
      },
      width: {
        type: Number,
        default: Video_dimension.width,
      },
      quality:{
        type:Number ,min:1, max:100
      }
    },
    userId:{type:mongoose.Schema.Types.ObjectId , ref:'User', required:true}
  },
  {
    timestamps: true,
  }
);

const Video = mongoose.models?.Video || mongoose.model<IVideo>("Video",VideoSchema)

export default Video;