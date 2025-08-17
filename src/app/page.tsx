import VideoFeedClient from "./components/VideoFeed";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">ImageKit ReelsPro</h1>
      <VideoFeedClient />
    </main>
  );
}