// src/types/navigation.ts
export interface DropdownItem {
    name: string;
    href: string;
}

export interface NavItem {
    name: string;
    href: string;
    dropdown?: DropdownItem[];
}