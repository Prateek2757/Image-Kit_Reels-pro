"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { Loader2 } from "lucide-react";
import { useNotification } from "./Notification";
import { apiClient } from "@/lib/api-client";
import FileUpload from "./FileUpload";

interface MediaFormData {
  title: string;
  description: string;
  fileUrl: string;
  thumbnailUrl: string;
  fileType: "video" | "image";
  userId: string;
  
   // Add fileType to the interface
}

export default function MediaUploadForm() {
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { showNotification } = useNotification();

  // State to store selected fileType
  const [fileType, setFileType] = useState<"video" | "image">("image");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<MediaFormData>({
    defaultValues: {
      title: "",
      description: "",
      fileUrl: "",
      thumbnailUrl: "",
    },
  });

  const handleUploadSuccess = (response: IKUploadResponse) => {
    setValue("fileUrl", response.filePath);
    setValue("thumbnailUrl", response.thumbnailUrl || response.filePath);
    showNotification(`${fileType === "video" ? "Video" : "Image"} uploaded successfully!`, "success");
  };

  const handleUploadProgress = (progress: number) => {
    setUploadProgress(progress);
  };

  const onSubmit = async (data: MediaFormData) => {
    if (!data.fileUrl) {
      showNotification(`Please upload a ${fileType} first`, "error");
      return;
    }

    setLoading(true);
    try {
      if (fileType === "video") {
        await apiClient.createVideo(data);
      } else {
       await apiClient.createImage(data);
      }

      showNotification(`${fileType === "video" ? "Video" : "Image"} published successfully!`, "success");

      // Reset form after successful submission
      setValue("title", "");
      setValue("description", "");
      setValue("fileUrl", "");
      setValue("thumbnailUrl", "");
      setUploadProgress(0);
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : `Failed to publish ${fileType}`,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="form-control">
        <label className="label">Title</label>
        <input
          type="text"
          className={`input input-bordered ${errors.title ? "input-error" : ""}`}
          {...register("title", { required: "Title is required" })}
        />
        {errors.title && <span className="text-error text-sm mt-1">{errors.title.message}</span>}
      </div>

      <div className="form-control">
        <label className="label">Description</label>
        <textarea
          className={`textarea textarea-bordered h-24 ${errors.description ? "textarea-error" : ""}`}
          {...register("description", { required: "Description is required" })}
        />
        {errors.description && <span className="text-error text-sm mt-1">{errors.description.message}</span>}
      </div>

      {/* Dropdown to select file type (image or video) */}
      <div className="form-control">
        <label className="label">Choose Media Type</label>
        <select
          {...register("fileType", { required: "Please select file type" })}
          className="select select-bordered"
          onChange={(e) => setFileType(e.target.value as "video" | "image")}
          value={fileType}
        >
          <option value="image">Image</option>
          <option value="video">Video</option>
        </select>
        {errors.fileType && <span className="text-error text-sm mt-1">{errors.fileType.message}</span>}
      </div>

      <div className="form-control">
        <label className="label">Upload {fileType === "video" ? "Video" : "Image"}</label>
        <FileUpload fileType={fileType} onSuccess={handleUploadSuccess} onProgress={handleUploadProgress} />
        {uploadProgress > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div className="bg-primary h-2.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
          </div>
        )}
      </div>

      <button type="submit" className="btn btn-primary btn-block" disabled={loading || !uploadProgress}>
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Publishing {fileType === "video" ? "Video" : "Image"}...
          </>
        ) : (
          `Publish ${fileType === "video" ? "Video" : "Image"}`
        )}
      </button>
    </form>
  );
}
