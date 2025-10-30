import { v4 as uuidv4 } from 'uuid';

export function getOrCreateCartToken(): string {
    if (typeof window === 'undefined') return '';

    let token = localStorage.getItem('cart_token');
    if (!token) {
        token = uuidv4();
        localStorage.setItem('cart_token', token);
    }

    return token;
}
