'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function BlogPage() {
    const { t } = useLanguage();

    // Placeholder blog posts - in a real app, these would come from an API
    const blogPosts: any[] = [];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero */}
            <section className="bg-gray-900 text-white py-16">
                <div className="container text-center">
                    <h1 className="text-5xl font-light tracking-tight mb-4">
                        {t('blog.hero_title')}
                    </h1>
                    <p className="text-xl font-light text-gray-300">
                        {t('blog.hero_subtitle')}
                    </p>
                </div>
            </section>

            <div className="container py-16">
                {blogPosts.length === 0 ? (
                    /* Empty State */
                    <div className="bg-white border border-gray-200 shadow-sm p-12 text-center">
                        <svg
                            className="mx-auto h-16 w-16 text-gray-400 mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                            />
                        </svg>
                        <h2 className="text-2xl font-light text-gray-900 mb-2 tracking-tight">
                            {t('blog.empty_title')}
                        </h2>
                        <p className="text-gray-600 font-light">
                            {t('blog.empty_description')}
                        </p>
                    </div>
                ) : (
                    /* Blog Posts Grid */
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogPosts.map((post) => (
                            <article
                                key={post.id}
                                className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
                            >
                                {post.image && (
                                    <div className="aspect-video bg-gray-100 overflow-hidden">
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                                <div className="p-6">
                                    <div className="text-sm text-gray-500 mb-2 font-light">
                                        {t('blog.published_on')} {new Date(post.publishedAt).toLocaleDateString()}
                                    </div>
                                    <h2 className="text-xl font-light text-gray-900 mb-3 tracking-tight">
                                        {post.title}
                                    </h2>
                                    <p className="text-gray-600 mb-4 font-light line-clamp-3">
                                        {post.excerpt}
                                    </p>
                                    <a
                                        href={`/blog/${post.slug}`}
                                        className="text-gray-900 font-light hover:text-gray-600 transition-colors underline underline-offset-4"
                                    >
                                        {t('blog.read_more')} →
                                    </a>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

