"use client";
import { apiClient } from "@/lib/api-client";
import { IVideo } from "@/model/Video";
import { IKImage, IKVideo } from "imagekitio-next";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";


export default function DashBoard() {
  const [media, setMedia] = useState<IVideo[]>([]);
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false); // ✅ Fixed typo

  
  useEffect(() => {
    if (!session?.user._id || hasFetched.current) return;

    hasFetched.current = true;

    const mediaData = async () => {
      try {
        const data: IVideo[] = await apiClient.getVideo(session.user._id as string);
        console.log("Fetched Data:", data);

        setMedia(data); // ✅ Ensuring it doesn't overwrite previous state
      } catch (error) {
        console.error("Error fetching media:", error);
      } finally {
        setLoading(false);
      }
    };

    mediaData();
  }, [session?.user._id]);
  //here if user continue then only it start because when user cancle then it become false and !become false so false false become true it return
  const handleDelete = async (id: string, type: "image" | "video") => {
    
    if (!confirm("Are you sure you want to delete this media?")) return;

    try {
      const response = await apiClient.deleteMedia(id,type)

     
      if (response) {
        alert("Deleted successfully!");
        setMedia((prev) => prev.filter((item) => item._id !== id)); // ✅ Remove from UI
      } else {
        alert(response);
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };
  // ✅ Loading Indicator (Proper Placement)
  if (loading) return <h1 className="text-xl text-center">Loading...</h1>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {media.length === 0 ? (
        <p>No media uploaded yet</p>
      ) : (
        media.map((item) => (
          
          <div key={item._id} className="card bg-base-100 w-full shadow-lg p-4" >
            <div className="relative " style={{ aspectRatio: "16/9" }}>
              {item.thumbnailUrl.includes("/videos/") ? (
                   <IKVideo
                   path={item.fileUrl}
                   transformation={[{ height: "800", width: "600" }]}
                   className="rounded-lg w-full h-auto object-cover"
                   controls
                 />
               
              ) : (
                <IKImage
                path={item.fileUrl}
                transformation={[{ height: "500", width: "500" }]}
                className="rounded-lg w-full h-auto object-cover"
                alt={item.title}
                width={400} height={400}
              />
              )}
              <h3 className="text-lg font-semibold mt-2">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.description}</p>
           
            </div>
            <button
              className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              onClick={() => handleDelete(item._id as string, item.thumbnailUrl.includes("/videos/") ? "video" : "image")}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}