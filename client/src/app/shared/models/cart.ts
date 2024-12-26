import { nanoid } from 'nanoid';

export type CartType = {
    id: string;
    items: CartItem[];
    deliveryMethodId?: number,
    clientSecret?: string,
    paymentIntentId?: string
}

export type CartItem = {
    productId: number;
    productName: string;
    price: number;
    quantity: number;
    pictureUrl: string;
    brand: string;
    type: string;
}

export class Cart implements CartType {
    id: string = nanoid();
    items: CartItem[] = [];
    deliveryMethodId?: number;
    clientSecret?: string;
    paymentIntentId?: string
}