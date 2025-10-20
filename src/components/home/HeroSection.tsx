// src/components/home/HeroSection.tsx
import Link from 'next/link';
import Image from 'next/image';

export default function HeroSection() {
    return (
        <section className="relative h-[600px] md:h-[700px] bg-gray-900 overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-black/40 z-10" />
                <Image
                    src="/hero-placeholder.jpg"
                    alt="Hero"
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            {/* Content */}
            <div className="relative z-20 h-full flex items-center">
                <div className="container">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6">
                            Нова Колекция
                            <br />
                            <span className="text-gray-200">Есен/Зима 2025</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-200 mb-8">
                            Открийте елегантността в детайлите с нашата най-нова колекция от модни дрехи
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link
                                href="/products"
                                className="px-8 py-4 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                Разгледай Колекцията
                            </Link>
                            <Link
                                href="/collections"
                                className="px-8 py-4 bg-transparent text-white font-medium rounded-lg border-2 border-white hover:bg-white hover:text-gray-900 transition-colors"
                            >
                                Виж Всички
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}