// src/components/ui/Logo.tsx

import Link from 'next/link';

export default function Logo() {
    return (
        <Link href="/" className="flex items-center space-x-2">
      <span className="text-2xl font-bold text-gray-900 tracking-tight">
        MAIRE
      </span>
            <span className="text-2xl font-light text-gray-500">
        ATELIER
      </span>
        </Link>
    );
}