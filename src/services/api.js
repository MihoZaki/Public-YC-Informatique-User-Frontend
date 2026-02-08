// src/services/api.js
// Mock data
const mockProducts = [
  {
    id: "1",
    title: "Intel Core i9-13900K BRAND NEW OVERCLOCKED WITH A FREE BURGER",
    description: "High-performance desktop processor",
    price: 79999,
    image_urls: [ // Define the image_urls array directly in mock data
      "https://www.cnet.com/a/img/resize/0d1705ffe2225c545380a8c3d0958df139e07e6e/hub/2025/08/14/fcc6d8d8-3860-4a0e-9de5-38b0e8cd5bd4/velocity-micro-raptor-z95a-gaming-pc-1095667-edit.jpg?auto=webp&fit=crop&height=1200&width=1200", // Main/First image
      "https://placehold.co/300x300?text=i9-13900K+Back",
      "https://placehold.co/300x300?text=i9-13900K+Top",
      "https://placehold.co/300x300?text=i9-13900K+Box",
    ],
    category: "CPUs",
    brand: "Intel",
    stock: 15,
    status: "active",
  },
  {
    id: "2",
    title: "AMD Ryzen 9 7950X",
    description: "16-core desktop processor",
    price: 699.99,
    image_urls: [ // Define the image_urls array directly in mock data
      "https://www.cnet.com/a/img/resize/0d1705ffe2225c545380a8c3d0958df139e07e6e/hub/2025/08/14/fcc6d8d8-3860-4a0e-9de5-38b0e8cd5bd4/velocity-micro-raptor-z95a-gaming-pc-1095667-edit.jpg?auto=webp&fit=crop&height=1200&width=1200", // Main/First image
      "https://placehold.co/300x300?text=Ryzen+9+7950X+Back",
      "https://placehold.co/300x300?text=Ryzen+9+7950X+Top",
      "https://placehold.co/300x300?text=Ryzen+9+7950X+Box",
    ],
    category: "CPUs",
    brand: "AMD",
    stock: 8,
    status: "active",
  },
  {
    id: "3",
    title: "NVIDIA GeForce RTX 4090",
    description: "High-end gaming graphics card",
    price: 1599.99,
    image_urls: [ // Define the image_urls array directly in mock data
      "https://www.cnet.com/a/img/resize/0d1705ffe2225c545380a8c3d0958df139e07e6e/hub/2025/08/14/fcc6d8d8-3860-4a0e-9de5-38b0e8cd5bd4/velocity-micro-raptor-z95a-gaming-pc-1095667-edit.jpg?auto=webp&fit=crop&height=1200&width=1200", // Main/First image
      "https://placehold.co/300x300?text=RTX+4090+Back",
      "https://placehold.co/300x300?text=RTX+4090+Side",
      "https://placehold.co/300x300?text=RTX+4090+Box",
    ],
    category: "GPUs",
    brand: "NVIDIA",
    stock: 5,
    status: "active",
  },
  {
    id: "4",
    title: "Corsair Vengeance LPX 32GB",
    description: "DDR4 RAM kit",
    price: 149.99,
    image_urls: [ // Define the image_urls array directly in mock data
      "https://www.cnet.com/a/img/resize/0d1705ffe2225c545380a8c3d0958df139e07e6e/hub/2025/08/14/fcc6d8d8-3860-4a0e-9de5-38b0e8cd5bd4/velocity-micro-raptor-z95a-gaming-pc-1095667-edit.jpg?auto=webp&fit=crop&height=1200&width=1200", // Main/First image
      "https://placehold.co/300x300?text=Vengeance+32GB+Back",
      "https://placehold.co/300x300?text=Vengeance+32GB+Specs",
      "https://placehold.co/300x300?text=Vengeance+32GB+Box",
    ],
    category: "RAM",
    brand: "Corsair",
    stock: 50,
    status: "active",
  },
  {
    id: "5",
    title: "Samsung 980 PRO 1TB",
    description: "NVMe M.2 SSD",
    price: 129.99,
    image_urls: [ // Define the image_urls array directly in mock data
      "https://www.cnet.com/a/img/resize/0d1705ffe2225c545380a8c3d0958df139e07e6e/hub/2025/08/14/fcc6d8d8-3860-4a0e-9de5-38b0e8cd5bd4/velocity-micro-raptor-z95a-gaming-pc-1095667-edit.jpg?auto=webp&fit=crop&height=1200&width=1200", // Main/First image
      "https://placehold.co/300x300?text=980+PRO+1TB+Back",
      "https://placehold.co/300x300?text=980+PRO+1TB+Specs",
      "https://placehold.co/300x300?text=980+PRO+1TB+Box",
    ],
    category: "Storage",
    brand: "Samsung",
    stock: 30,
    status: "active",
  },
  {
    id: "6",
    title: "ASUS ROG Strix Z790-E",
    description: "ATX motherboard for Intel CPUs",
    price: 349.99,
    image_urls: [ // Define the image_urls array directly in mock data
      "https://www.cnet.com/a/img/resize/0d1705ffe2225c545380a8c3d0958df139e07e6e/hub/2025/08/14/fcc6d8d8-3860-4a0e-9de5-38b0e8cd5bd4/velocity-micro-raptor-z95a-gaming-pc-1095667-edit.jpg?auto=webp&fit=crop&height=1200&width=1200", // Main/First image
      "https://placehold.co/300x300?text=ROG+Strix+Z790-E+Back",
      "https://placehold.co/300x300?text=ROG+Strix+Z790-E+Top",
      "https://placehold.co/300x300?text=ROG+Strix+Z790-E+Box",
    ],
    category: "Motherboards",
    brand: "ASUS",
    stock: 12,
    status: "active",
  },
  {
    id: "7",
    title: "Fractal Design Torrent",
    description: "Mid-tower ATX case",
    price: 199.99,
    image_urls: [ // Define the image_urls array directly in mock data
      "https://www.cnet.com/a/img/resize/0d1705ffe2225c545380a8c3d0958df139e07e6e/hub/2025/08/14/fcc6d8d8-3860-4a0e-9de5-38b0e8cd5bd4/velocity-micro-raptor-z95a-gaming-pc-1095667-edit.jpg?auto=webp&fit=crop&height=1200&width=1200", // Main/First image
      "https://placehold.co/300x300?text=Torrent+Back",
      "https://placehold.co/300x300?text=Torrent+Interior",
      "https://placehold.co/300x300?text=Torrent+Box",
    ],
    category: "Cases",
    brand: "Fractal Design",
    stock: 20,
    status: "active",
  },
  {
    id: "8",
    title: "Corsair RM850x (2021)",
    description: "80+ Gold certified power supply",
    price: 129.99,
    image_urls: [ // Define the image_urls array directly in mock data
      "https://www.cnet.com/a/img/resize/0d1705ffe2225c545380a8c3d0958df139e07e6e/hub/2025/08/14/fcc6d8d8-3860-4a0e-9de5-38b0e8cd5bd4/velocity-micro-raptor-z95a-gaming-pc-1095667-edit.jpg?auto=webp&fit=crop&height=1200&width=1200", // Main/First image
      "https://placehold.co/300x300?text=RM850x+Back",
      "https://placehold.co/300x300?text=RM850x+Specs",
      "https://placehold.co/300x300?text=RM850x+Box",
    ],
    category: "PSUs",
    brand: "Corsair",
    stock: 25,
    status: "active",
  },
  {
    id: "9",
    title: "Logitech MX Master 3S",
    description: "Wireless mouse",
    price: 119.99,
    image_urls: [ // Define the image_urls array directly in mock data
      "https://www.cnet.com/a/img/resize/0d1705ffe2225c545380a8c3d0958df139e07e6e/hub/2025/08/14/fcc6d8d8-3860-4a0e-9de5-38b0e8cd5bd4/velocity-micro-raptor-z95a-gaming-pc-1095667-edit.jpg?auto=webp&fit=crop&height=1200&width=1200", // Main/First image
      "https://placehold.co/300x300?text=MX+Master+3S+Back",
      "https://placehold.co/300x300?text=MX+Master+3S+Side",
      "https://placehold.co/300x300?text=MX+Master+3S+Box",
    ],
    category: "Peripherals",
    brand: "Logitech",
    stock: 22,
    status: "active",
  },
  {
    id: "10",
    title: "ASRock Phantom Gaming D",
    description: "AMD AM4 motherboard",
    price: 119.99,
    image_urls: [ // Define the image_urls array directly in mock data
      "https://www.cnet.com/a/img/resize/0d1705ffe2225c545380a8c3d0958df139e07e6e/hub/2025/08/14/fcc6d8d8-3860-4a0e-9de5-38b0e8cd5bd4/velocity-micro-raptor-z95a-gaming-pc-1095667-edit.jpg?auto=webp&fit=crop&height=1200&width=1200", // Main/First image
      "https://placehold.co/300x300?text=Phantom+Gaming+D+Back",
      "https://placehold.co/300x300?text=Phantom+Gaming+D+Top",
      "https://placehold.co/300x300?text=Phantom+Gaming+D+Box",
    ],
    category: "Motherboards",
    brand: "ASRock",
    stock: 18,
    status: "active",
  },
  {
    id: "11",
    title: "G.SKILL Trident Z5 RGB 64GB",
    description: "DDR5 RAM kit",
    price: 399.99,
    image_urls: [ // Define the image_urls array directly in mock data
      "https://www.cnet.com/a/img/resize/0d1705ffe2225c545380a8c3d0958df139e07e6e/hub/2025/08/14/fcc6d8d8-3860-4a0e-9de5-38b0e8cd5bd4/velocity-micro-raptor-z95a-gaming-pc-1095667-edit.jpg?auto=webp&fit=crop&height=1200&width=1200", // Main/First image
      "https://placehold.co/300x300?text=Trident+Z5+RGB+64GB+Back",
      "https://placehold.co/300x300?text=Trident+Z5+RGB+64GB+Specs",
      "https://placehold.co/300x300?text=Trident+Z5+RGB+64GB+Box",
    ],
    category: "RAM",
    brand: "G.SKILL",
    stock: 7,
    status: "active",
  },
];

const mockCategories = [
  { id: "cpus", name: "CPUs", slug: "cpus", type: "component" },
  { id: "gpus", name: "GPUs", slug: "gpus", type: "component" },
  { id: "ram", name: "RAM", slug: "ram", type: "component" },
  { id: "storage", name: "Storage", slug: "storage", type: "component" },
  {
    id: "motherboards",
    name: "Motherboards",
    slug: "motherboards",
    type: "component",
  },
  { id: "cases", name: "Cases", slug: "cases", type: "component" },
  { id: "psus", name: "PSUs", slug: "psus", type: "component" },
  {
    id: "peripherals",
    name: "Peripherals",
    slug: "peripherals",
    type: "accessory",
  },
];

// Mock user orders data
const mockUserOrders = [
  {
    id: "12345",
    createdAt: "2026-02-01T10:00:00Z",
    status: "completed",
    totalAmount: 2499.97,
    subtotal: 2300.00,
    taxAmount: 149.97,
    shippingCost: 50.00,
    items: [
      {
        productId: "1",
        name: "Intel Core i9-13900K",
        price: 799.99,
        quantity: 1,
        image_urls: ["https://placehold.co/100x100?text=i9-13900K"], // Example for order item
      },
      {
        productId: "3",
        name: "NVIDIA GeForce RTX 4090",
        price: 599.99,
        quantity: 1,
        image_urls: ["https://placehold.co/100x100?text=RTX+4090"],
      },
      {
        productId: "4",
        name: "Corsair Vengeance LPX 32GB",
        price: 149.99,
        quantity: 1,
        image_urls: ["https://placehold.co/100x100?text=Vengeance+32GB"],
      },
    ],
    shippingAddress: {
      firstName: "John",
      lastName: "Doe",
      address: "123 Main St",
      city: "Algiers",
      state: "Algeria",
      zipCode: "16000",
      country: "Algeria",
    },
    billingAddress: {
      firstName: "John",
      lastName: "Doe",
      address: "123 Main St",
      city: "Algiers",
      state: "Algeria",
      zipCode: "16000",
      country: "Algeria",
    },
  },
  {
    id: "12344",
    createdAt: "2026-01-28T15:30:00Z",
    status: "shipped",
    totalAmount: 89.99,
    subtotal: 79.99,
    taxAmount: 5.00,
    shippingCost: 5.00,
    items: [
      {
        productId: "9",
        name: "Logitech MX Master 3S",
        price: 119.99,
        quantity: 1,
        image_urls: ["https://placehold.co/100x100?text=MX+Master+3S"],
      },
    ],
    shippingAddress: {
      firstName: "John",
      lastName: "Doe",
      address: "123 Main St",
      city: "Algiers",
      state: "Algeria",
      zipCode: "16000",
      country: "Algeria",
    },
    billingAddress: {
      firstName: "John",
      lastName: "Doe",
      address: "123 Main St",
      city: "Algiers",
      state: "Algeria",
      zipCode: "16000",
      country: "Algeria",
    },
  },
  {
    id: "12343",
    createdAt: "2026-01-25T09:15:00Z",
    status: "processing",
    totalAmount: 1200.00,
    subtotal: 1100.00,
    taxAmount: 70.00,
    shippingCost: 30.00,
    items: [
      {
        productId: "2",
        name: "AMD Ryzen 9 7950X",
        price: 699.99,
        quantity: 1,
        image_urls: ["https://placehold.co/100x100?text=Ryzen+9+7950X"],
      },
      {
        productId: "6",
        name: "ASUS ROG Strix Z790-E",
        price: 349.99,
        quantity: 1,
        image_urls: ["https://placehold.co/100x100?text=ROG+Strix+Z790-E"],
      },
    ],
    shippingAddress: {
      firstName: "John",
      lastName: "Doe",
      address: "123 Main St",
      city: "Algiers",
      state: "Algeria",
      zipCode: "16000",
      country: "Algeria",
    },
    billingAddress: {
      firstName: "John",
      lastName: "Doe",
      address: "123 Main St",
      city: "Algiers",
      state: "Algeria",
      zipCode: "16000",
      country: "Algeria",
    },
  },
];

// Fetch categories from mock data
export const fetchCategories = async () => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 200));
  return mockCategories;
};

// Fetch products from mock data
export const fetchProducts = async () => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockProducts;
};

// Fetch a single product by ID from mock data
export const fetchProductById = async (id) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  const product = mockProducts.find((p) => p.id === id);
  if (!product) {
    throw new Error(`Product with id ${id} not found.`);
  }
  // Return the product object as it exists in the mock data (containing image_urls)
  return product;
};

// --- Mock functions for user-specific data ---

// Fetch orders for the current user (mock)
export const fetchUserOrders = async (userId) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 400));
  // In a real app, you'd filter by userId here if multiple users existed
  return mockUserOrders;
};

// Fetch a specific order by its ID (mock)
export const fetchOrderById = async (orderId) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  const order = mockUserOrders.find((o) => o.id === orderId);
  if (!order) {
    throw new Error(`Order with id ${orderId} not found.`);
  }
  return order;
};

// --- End of mock functions ---
