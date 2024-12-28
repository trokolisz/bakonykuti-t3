import { CardTitle, CardHeader, Card } from "~/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { type Card as CardType} from "~/types";



export default function CardGrid({cards}: { cards : CardType[]}) {

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
            {cards.map(card => (
                <Link key={card.id} href={card.href}>
                    <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white dark:bg-gray-800">
                        <div className="relative aspect-[4/3] overflow-hidden">
                            <Image
                                src={card.image}
                                alt={card.title}
                                fill
                                className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                                priority={card.id <= 3}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        </div>
                        <CardHeader className="p-4">
                            <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 text-center">
                                {card.title}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                </Link>
            ))}
        </div>
    );
}