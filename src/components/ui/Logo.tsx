// src/components/ui/Logo.tsx
import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
    variant?: 'default' | 'light';
    className?: string;
}

export default function Logo({ variant = 'default', className = '' }: LogoProps) {
    return (
        <Link href="/" className={`flex items-center gap-2 md:gap-3 ${className}`}>
            {/* MAIRE лого */}
            <div className={`relative w-[50px] h-[50px] md:w-[60px] md:h-[60px] flex-shrink-0 ${
                variant === 'light' 
                    ? 'bg-[#3A3A3A] p-2 md:p-2.5 rounded-md shadow-sm border border-white/10' 
                    : ''
            }`}>
                <Image
                    src="/maire-logo.png"
                    alt="MAIRE"
                    fill
                    className="object-contain"
                    priority
                />
            </div>

            {/* ATELIER текст */}
            <div className="flex flex-col justify-center">
                <span className={`text-xl md:text-2xl font-light tracking-[0.2em] ${
                    variant === 'light' 
                        ? 'text-[#EAEAEA]' 
                        : 'text-gray-600'
                }`}>
                    ATELIER
                </span>
            </div>
        </Link>
    );
}