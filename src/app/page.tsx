import Link from "next/link";
import { db } from "~/server/db";

const mockUrls= [
  "https://utfs.io/f/26L8Sk7UnuECn1bcfKypuwvx56J1US2AQWgyPYTDO7XGiend",
  "https://utfs.io/f/26L8Sk7UnuECw9AGByheWP5jZyfGnp24M8Jrbm0t9vNAFkaB",
  "https://utfs.io/f/26L8Sk7UnuECIaccBCbF3U6xf5SojbkZpQ2y7DV0lPOWMeCB",
];

const mockImages = mockUrls.map((url, index) => ({
  id: index + 1,
  url,
}));

export default async function HomePage() {
  const posts = await db.query.posts.findMany();

  console.log(posts);

  return (
    <main className="">
      <div className="flex flex-wrap gap-4">
        {posts.map((post) => (
          <div key={post.id}>{post.name}</div>
        ))}
        {[...mockImages, ...mockImages, ...mockImages].map((image, index) => (
          <div key={image.id + "-" + index} className="w-48">
            <img src={image.url} />
          </div>
        ))}
      </div>
    </main>
  );
}
