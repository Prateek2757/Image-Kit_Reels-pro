import { IKVideo, IKImage } from "imagekitio-next";
import Link from "next/link";
import { IVideo } from "@/model/Video";

export default function VideoComponent({ videos }: { videos: IVideo }) {
  const isVideo = videos.thumbnailUrl.includes("/videos/");

  return (
    <div className="card bg-base-100 mb-4 shadow hover:shadow-lg transition-all duration-300">
      <figure className="relative  pb-4">
        <Link 
          href={isVideo 
            ? `/video/${videos._id}?src=${encodeURIComponent(videos.thumbnailUrl)}` 
            : `/video/${videos._id}?src=${encodeURIComponent(videos.fileUrl as string)}`
          } 
          className="relative group w-full"
        >
          <div className="  rounded-xl object-cover overflow-hidden relative w-full cursor-pointer" style={{ width:'100%', height:'400px' }}>
            {isVideo ? (
              <IKVideo
                path={videos.thumbnailUrl}
                transformation={[{ height: "800", width: "600" }]}
                controls
                className="w-full h-full object-cover"
              />
            ) : (
              <IKImage
                path={videos.fileUrl}
                transformation={[{ height: "700", width: "1200" }]}
                className="  w-full h-full object-contain"
                alt={videos.title}
              
              />
            )}
          </div>
        </Link>
      </figure>

      <div className="card-body p-4">
        <h2 className="card-title text-lg">{videos.title}</h2>
        <p className="text-sm text-base-content/70 line-clamp-2">{videos.description}</p>
      </div>
    </div>
  );
}