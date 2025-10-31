// src/app/(shop)/about/page.tsx
import AboutClient from './AboutClient';

export const metadata = {
    title: 'За нас | MAIRE ATELIER',
    description: 'Научете повече за MAIRE ATELIER - нашата история, мисия и ценности',
};

export default function AboutPage() {
    return <AboutClient />;
}