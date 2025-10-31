// src/components/ui/Logo.tsx
import Link from 'next/link';
import Image from 'next/image';

export default function Logo() {
    return (
        <Link href="/" className="flex items-center gap-2 md:gap-3">
            {/* MAIRE лого */}
            <div className="relative w-[50px] h-[50px] md:w-[60px] md:h-[60px] flex-shrink-0">
                <Image
                    src="/maire-logo.png"
                    alt="MAIRE"
                    fill
                    className="object-contain"
                    priority
                />
            </div>

            {/* ATELIER текст - винаги видим */}
            <div className="flex flex-col justify-center">
                <span className="text-xl md:text-2xl font-light tracking-[0.2em] text-gray-600">
                    ATELIER
                </span>
            </div>
        </Link>
    );
}