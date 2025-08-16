'use client'
import { IKVideo, IKImage } from "imagekitio-next";
import Link from "next/link";
import { notFound } from "next/navigation"; // To handle 404 error
import { useSearchParams } from "next/navigation"; // This is for accessing query parameters

export default  function MediaPage() {
  // Use Next.js searchParams to get the query string (i.e., 'src')
  const searchParams = useSearchParams();
  const src = searchParams.get("src"); // Get the 'src' query parameter

  if (!src) {
    return notFound(); // If 'src' is not found, show a 404 page
  }

  // You could fetch your data based on the ID (optional)
  // const videoData = await fetchDataForMedia(params.id);
  console.log(src);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      {/* Back Button */}
      <Link
        href="/"
        className="absolute top-4 left-4 bg-gray-800 px-4 py-2 rounded-md hover:bg-gray-700"
      >
        ← Back
      </Link>

      {/* Media Display */}
      <div className="relative w-full h-auto flex justify-center" style={{ width:'100%', height:'100vh', position:'relative' }}>
        {src.includes("/videos/") ? (
          <IKVideo
            path={src}
            transformation={[{ height: "1920", width: "1080" }]}
            controls
            className="rounded-lg shadow-lg max-w-full h-auto"
          />
        ) : (
          <IKImage
            path={src}
            transformation={[{ height: "", width: "" }]}
            className="rounded-lg object-cover shadow-lg w-full h-auto"
            alt="media"
          
          />
        )}
        
        
      </div>
    </div>
  );
}