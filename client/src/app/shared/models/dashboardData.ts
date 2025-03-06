export type OrderStatus = "Pending" | "PaymentReceived" | "PaymentFailed" | "PaymentMismatch" | "Refunded";

export type RecentOrder = {
    id: number;
    buyerEmail: string;
    totalAmount: number;
    status: OrderStatus;
};

export type RecentProduct = {
    id: number;
    name: string;
    price: number;
    brand: string;
    type: string;
};

export type RecentPayment = {
    id: number;
    buyerEmail: string;
    amountPaid: number;
};

export type TopCustomer = {
    customer: string;
    totalSpent: number;
};

export type DashboardData = {
    totalUsers: number;
    totalProducts: number;
    totalOrders: number;
    totalSales: number;
    recentOrders: RecentOrder[];
    recentProducts: RecentProduct[];
    recentPayments: RecentPayment[];
    topCustomers: TopCustomer[];
};
