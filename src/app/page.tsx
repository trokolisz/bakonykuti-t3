import Link from "next/link";

const mockURL= [
  "https://utfs.io/f/26L8Sk7UnuECn1bcfKypuwvx56J1US2AQWgyPYTDO7XGiend",
  "https://utfs.io/f/26L8Sk7UnuECw9AGByheWP5jZyfGnp24M8Jrbm0t9vNAFkaB",
  "https://utfs.io/f/26L8Sk7UnuECIaccBCbF3U6xf5SojbkZpQ2y7DV0lPOWMeCB",
];

const mockImages = mockURL.map((url, index) => ({
  id: index +1,
  url,
}));


export default function HomePage() {
  return (
    <main className="">
      <div className="flex flex-wrap gap-2">
        {[...mockImages,...mockImages,...mockImages].map((image) => (
          <div key={image.id} className="w-48">  
                <img src={image.url} alt="" className="w-full" />


          </div>
        ))}

      </div>
    </main>
  );
}
