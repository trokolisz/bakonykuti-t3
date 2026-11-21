import { CardTitle, CardHeader, Card } from "~/components/ui/card";
import Link from "next/link";
import { type Card as CardType } from "~/types";
import RobustImage from "~/components/ui/robust-image";

export default function CardGrid({ cards }: { cards: CardType[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 p-4 md:grid-cols-3">
      {cards.map((card) => (
        <Link key={card.id} href={card.href} className="group">
          <Card className="h-full overflow-hidden bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:bg-gray-800">
            <div className="relative aspect-[4/3] overflow-hidden">
              <RobustImage
                src={card.image}
                alt={card.title}
                fill
                fallbackSrc="/szechenyi_terv.jpg"
                className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
            <CardHeader className="p-4">
              <CardTitle className="text-center text-xl font-bold text-gray-900 dark:text-gray-100">
                {card.title}
              </CardTitle>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  );
}
