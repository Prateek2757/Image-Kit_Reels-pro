"use client";

import { useEffect, useState } from "react";
import VideoComponent from "./VideoComponent";
import { IVideo } from "@/model/Video";
import { Iimage } from "@/model/Image";
import { apiClient } from "@/lib/api-client";

export default function VideoFeedClient() {
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [images, setImages] = useState<Iimage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vids = await apiClient.getVideos();
        const imgs = await apiClient.getImage();
        setVideos(vids);
        setImages(imgs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;

  const combined = [...videos, ...images];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {combined.map((item) => (
        <VideoComponent key={item._id?.toString()} videos={item} />
      ))}

      {combined.length === 0 && (
        <div className="col-span-full text-center py-12">
          <p className="text-base-content/70">No media found</p>
        </div>
      )}
    </div>
  );
}