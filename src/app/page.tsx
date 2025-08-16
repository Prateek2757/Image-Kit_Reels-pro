"use client";

import React, { useEffect, useState } from "react";
import VideoFeed from "./components/VideoFeed";
import { IVideo } from "@/model/Video";
import { apiClient } from "@/lib/api-client";
import { Iimage } from "@/model/Image";

export default function Home() {
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [images, setImages] = useState<Iimage[]>([]);

  useEffect(() => {

    const fetchImage = async ()=>{
      try {
        const dataImage = await apiClient.getImage();
          setImages(dataImage)
      } catch (error) {
        console.log(error,"fetching video");
        
      }
    }
    fetchImage()

    const fetchVideos = async () => {
      try {
        const data = await apiClient.getVideos();
        
        setVideos(data);
       console.log(data);
       

      } catch (error) {
        console.log("Error fetching videos:", error);
      }
    };
      
      
    fetchVideos();
  }, []);
console.log("hii");

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">ImageKit ReelsPro</h1>
      <VideoFeed videos={videos} />
      <VideoFeed videos={images} />
    </main>
  );
}