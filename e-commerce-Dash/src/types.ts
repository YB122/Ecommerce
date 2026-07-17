export type ThemeName = 'light' | 'dark' | 'soft';

export interface Category {
    id: string;
    en_name: string;
    ar_name?: string;
    fr_name?: string;
    imageURL?: string;
    addedByEmail: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Product {
    id: string;
    en_name: string;
    ar_name?: string;
    fr_name?: string;
    en_description: string;
    ar_description?: string;
    fr_description?: string;
    price: number;
    discount: number;
    imageURLs?: string;
    colorImages?: string;
    variants?: string;
    subcategoryId: string;
    addedByEmail: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Order {
    id: string;
    userId: string;
    items: string;
    totalAmount: number;
    shippingCost: number;
    paymentMethod: 'cod' | 'card';
    paymentStatus: 'pending' | 'paid' | 'failed';
    orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    shippingAddress: string;
    createdAt: string;
    updatedAt: string;
}

export interface Subcategory {
    id: string;
    en_name: string;
    ar_name?: string;
    fr_name?: string;
    categoryId: string;
    addedByEmail: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'user' | 'superAdmin';
    isActive: boolean;
    isBlocked: boolean;
    imageURL?: string;
    phone?: string;
    googleId?: string;
    createdAt: string;
    updatedAt: string;
}
