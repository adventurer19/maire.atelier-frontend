// src/app/(shop)/about/page.tsx
import Image from 'next/image';

import { siteData } from '@/data/siteData'

export const metadata = {
    title: 'За нас | MAIRE ATELIER',
    description: 'Научете повече за MAIRE ATELIER - нашата история, мисия и ценности',
};

export default function AboutPage() {
    const { about } = siteData;

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[400px] bg-gray-900 text-white">
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30" />
                <div className="relative container h-full flex flex-col justify-center items-center text-center">
                    <h1 className="text-5xl font-serif font-bold mb-4">
                        {about.hero.title}
                    </h1>
                    <p className="text-xl mb-2">{about.hero.subtitle}</p>
                    <p className="text-lg text-gray-300 max-w-2xl">
                        {about.hero.description}
                    </p>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-16 bg-white">
                <div className="container max-w-4xl">
                    <h2 className="text-4xl font-serif font-bold text-center mb-8">
                        {about.story.title}
                    </h2>
                    <p className="text-lg text-gray-700 leading-relaxed mb-12 text-center">
                        {about.story.content}
                    </p>

                    {/* Sections Grid */}
                    <div className="grid md:grid-cols-3 gap-8 mt-12">
                        {about.story.sections.map((section, index) => (
                            <div key={index} className="text-center">
                                <h3 className="text-xl font-bold mb-4">{section.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{section.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-gray-50">
                <div className="container">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {about.stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-4xl font-bold text-gray-900 mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-gray-600">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-white">
                <div className="container max-w-3xl text-center">
                    <h2 className="text-3xl font-serif font-bold mb-6">
                        Готови да откриете вашия стил?
                    </h2>
                    <p className="text-gray-600 mb-8 text-lg">
                        Разгледайте нашата колекция и намерете перфектното парче за вас
                    </p>
                    <a
                        href="/products"
                        className="inline-block px-8 py-3 bg-gray-900 text-white font-medium rounded-md hover:bg-gray-800 transition-colors"
                    >
                        Разгледай Продуктите
                    </a>
                </div>
            </section>
        </div>
    );
}