export type ApiReview = {
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
    reviewerEmail: string;
};

export type ApiAvailabilityStatus = "In Stock" | "Low Stock" | "Out of Stock";

export type ApiProduct = {
    id: number;
    title: string;
    description: string;
    category: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    tags: string[];
    brand?: string;
    sku: string;
    weight: number;
    dimensions: { width: number; height: number; depth: number };
    warrantyInformation: string;
    shippingInformation: string;
    availabilityStatus: ApiAvailabilityStatus;
    reviews: ApiReview[];
    returnPolicy: string;
    minimumOrderQuantity: number;
    meta: { createdAt: string; updatedAt: string; barcode: string; qrCode: string };
    images: string[];
    thumbnail: string;
};

export type ApiProductList = {
    products: ApiProduct[];
    total: number;
    skip: number;
    limit: number;
};
