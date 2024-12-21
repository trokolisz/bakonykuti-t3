import { CardTitle, CardHeader, Card } from "~/components/ui/card";
import Image from "next/image";
import Link from "next/link";

type Card = {
    id: number;
    image: string;
    title: string;
    text: string;
    href: string;
}

export default function CardGrid() {
    const cards: Card[] = [
        { id: 1, image: "https://utfs.io/f/26L8Sk7UnuECfSFxOau3aru6LDUb0V8oGMOFt5cR72B1Qkqh", title: 'Köszöntő', text: 'Card description goes here.', href: '/' },
        { id: 2, image: "https://utfs.io/f/26L8Sk7UnuECfSFxOau3aru6LDUb0V8oGMOFt5cR72B1Qkqh", title: 'Bakonykúti', text: 'Card description goes here.', href: '/bakonykuti' },
        { id: 3, image: "https://utfs.io/f/26L8Sk7UnuECfSFxOau3aru6LDUb0V8oGMOFt5cR72B1Qkqh", title: 'Hírek', text: 'Card description goes here.', href: '/hirek' },
        { id: 4, image: "https://utfs.io/f/26L8Sk7UnuECfSFxOau3aru6LDUb0V8oGMOFt5cR72B1Qkqh", title: 'Önkormányzat', text: 'Card description goes here.', href: '/onkormanyzat' },
        { id: 5, image: "https://utfs.io/f/26L8Sk7UnuECfSFxOau3aru6LDUb0V8oGMOFt5cR72B1Qkqh", title: 'Intézmények, egézségügy', text: 'Card description goes here.', href: '/intezmenyek' },
        { id: 6, image: "https://utfs.io/f/26L8Sk7UnuECfSFxOau3aru6LDUb0V8oGMOFt5cR72B1Qkqh", title: 'Turisztika', text: 'Card description goes here.', href: '/turisztika' },
        { id: 7, image: "https://utfs.io/f/26L8Sk7UnuECfSFxOau3aru6LDUb0V8oGMOFt5cR72B1Qkqh", title: 'Galária', text: 'Card description goes here.', href: '/galeria' },
        { id: 8, image: "https://utfs.io/f/26L8Sk7UnuECfSFxOau3aru6LDUb0V8oGMOFt5cR72B1Qkqh", title: 'Közérdekü', text: 'Card description goes here.', href: '/kozerdeku' },
        { id: 9, image: "https://utfs.io/f/26L8Sk7UnuECfSFxOau3aru6LDUb0V8oGMOFt5cR72B1Qkqh", title: 'Ügyintézés', text: 'Card description goes here.', href: '/ugyintezes' },
    ];

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