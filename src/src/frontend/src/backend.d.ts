import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface OrderItem {
    quantity: bigint;
    product: Product;
}
export interface CartItem {
    productId: bigint;
    quantity: bigint;
}
export interface Product {
    id: bigint;
    name: string;
    description: string;
    stock: bigint;
    imageUrl: string;
    category: string;
    price: bigint;
}
export interface OrderData {
    id: bigint;
    status: string;
    total: bigint;
    paymentMethod: string;
    user: Principal;
    timestamp: bigint;
    items: Array<OrderItem>;
}
export interface backendInterface {
    addToCart(productId: bigint, quantity: bigint): Promise<void>;
    createOrder(paymentMethod: string): Promise<bigint>;
    createProduct(name: string, description: string, price: bigint, imageUrl: string, stock: bigint, category: string): Promise<bigint>;
    deleteOrder(orderId: bigint): Promise<void>;
    deleteProduct(id: bigint): Promise<void>;
    getAllProducts(): Promise<Array<Product>>;
    getCart(): Promise<Array<CartItem>>;
    getOrder(id: bigint): Promise<OrderData>;
    getProduct(id: bigint): Promise<Product>;
    getUserOrders(): Promise<Array<OrderData>>;
    initializeAdmin(): Promise<void>;
    removeFromCart(productId: bigint): Promise<void>;
    searchProductsByCategory(category: string): Promise<Array<Product>>;
    searchProductsByName(name: string): Promise<Array<Product>>;
    updateCartItem(productId: bigint, quantity: bigint): Promise<void>;
    updateOrderStatus(orderId: bigint, status: string): Promise<void>;
    updateProduct(id: bigint, name: string, description: string, price: bigint, imageUrl: string, stock: bigint, category: string): Promise<void>;
}
