import { db } from "~/server/db";

export default async function HomePage() {

  const images = await db.query.images.findMany({
    orderBy: (images, { desc }) => [desc(images.createdAt)]
  });
  return (
    <main className="">
      <div className="flex flex-wrap gap-2">
        {[...images, ...images, ...images].map((image, index) => (
          <div key={index} className="w-48">  
              <img src={image.url} alt="" className="w-full" />
              <p>{image.title}</p>
          </div>
        ))}

      </div>
    </main>
  );
}
