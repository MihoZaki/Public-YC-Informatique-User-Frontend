const mockProducts = [
  {
    id: "1",
    name: "Intel Core i9-13900K", // Changed from 'title' to 'name'
    description:
      "High-performance desktop processor with integrated graphics capabilities. Features 24 cores and 32 threads for exceptional multitasking. Ideal for gaming, content creation, and demanding professional applications. Comes with a free burger (not really).",
    short_description: "High-performance desktop processor", // Added short description
    price_cents: 7999900, // Changed from 'price' to 'price_cents'
    discounted_price_cents: 7199910, // Discounted price in cents
    has_active_discount: true, // Indicates if discount is active
    effective_discount_percentage: 10, // Effective discount percentage
    total_calculated_fixed_discount_cents: 0, // Added for completeness
    calculated_combined_percentage_factor: 1, // Added for completeness
    image_urls: [ // Define the image_urls array directly in mock data
      "https://www.cnet.com/a/img/resize/0d1705ffe2225c545380a8c3d0958df139e07e6e/hub/2025/08/14/fcc6d8d8-3860-4a0e-9de5-38b0e8cd5bd4/velocity-micro-raptor-z95a-gaming-pc-1095667-edit.jpg?auto=webp&fit=crop&height=1200&width=1200  ", // Main/First image
      "https://placehold.co/300x300?text=i9-13900K+Back  ",
      "https://placehold.co/300x300?text=i9-13900K+Top  ",
      "https://placehold.co/300x300?text=i9-13900K+Box  ",
    ],
    category_id: "cpus", // Added category_id
    category: "CPUs", // Kept category name for display
    brand: "Intel",
    stock_quantity: 15, // Changed from 'stock' to 'stock_quantity'
    avg_rating: 4.8, // Added average rating
    num_ratings: 128, // Added number of ratings
    status: "active",
    spec_highlights: { // Added spec highlights
      cores: 24,
      threads: 32,
      base_clock_ghz: 3.0,
      boost_clock_ghz: 5.8,
      tdp_watts: 125,
    },
  },
  {
    id: "2",
    name: "AMD Ryzen 9 7950X",
    description:
      "16-core desktop processor designed for enthusiasts and professionals. Offers excellent performance for multi-threaded tasks, video editing, and high-end gaming. Features advanced architecture for improved efficiency.",
    short_description: "16-core desktop processor",
    price_cents: 6999900, // Changed from 'price' to 'price_cents'
    // No discount fields - this product has no active discount
    image_urls: [ // Define the image_urls array directly in mock data
      "https://www.cnet.com/a/img/resize/0d1705ffe2225c545380a8c3d0958df139e07e6e/hub/2025/08/14/fcc6d8d8-3860-4a0e-9de5-38b0e8cd5bd4/velocity-micro-raptor-z95a-gaming-pc-1095667-edit.jpg?auto=webp&fit=crop&height=1200&width=1200  ", // Main/First image
      "https://placehold.co/300x300?text=Ryzen+9+7950X+Back  ",
      "https://placehold.co/300x300?text=Ryzen+9+7950X+Top  ",
      "https://placehold.co/300x300?text=Ryzen+9+7950X+Box  ",
    ],
    category_id: "cpus",
    category: "CPUs",
    brand: "AMD",
    stock_quantity: 8, // Changed from 'stock' to 'stock_quantity'
    avg_rating: 4.7,
    num_ratings: 95,
    status: "active",
    spec_highlights: {
      cores: 16,
      threads: 32,
      base_clock_ghz: 4.5,
      boost_clock_ghz: 5.7,
      tdp_watts: 170,
    },
  },
  {
    id: "3",
    name: "NVIDIA GeForce RTX 4090",
    description:
      "High-end gaming graphics card delivering exceptional performance for 4K and 8K gaming. Features advanced ray tracing and AI-powered technologies for the ultimate visual experience.",
    short_description: "High-end gaming graphics card",
    price_cents: 15999900, // Changed from 'price' to 'price_cents'
    discounted_price_cents: 14399910, // Discounted price in cents
    has_active_discount: true, // Indicates if discount is active
    effective_discount_percentage: 10, // Effective discount percentage
    image_urls: [ // Define the image_urls array directly in mock data
      "https://www.cnet.com/a/img/resize/0d1705ffe2225c545380a8c3d0958df139e07e6e/hub/2025/08/14/fcc6d8d8-3860-4a0e-9de5-38b0e8cd5bd4/velocity-micro-raptor-z95a-gaming-pc-1095667-edit.jpg?auto=webp&fit=crop&height=1200&width=1200  ", // Main/First image
      "https://placehold.co/300x300?text=RTX+4090+Back  ",
      "https://placehold.co/300x300?text=RTX+4090+Side  ",
      "https://placehold.co/300x300?text=RTX+4090+Box  ",
    ],
    category_id: "gpus",
    category: "GPUs",
    brand: "NVIDIA",
    stock_quantity: 5, // Changed from 'stock' to 'stock_quantity'
    avg_rating: 4.9,
    num_ratings: 203,
    status: "active",
    spec_highlights: {
      vram_gb: 24,
      cuda_cores: 16384,
      boost_clock_mhz: 2520,
      tdp_watts: 450,
    },
  },
  {
    id: "4",
    name: "Corsair Vengeance LPX 32GB",
    description:
      "High-quality DDR4 RAM kit offering reliable performance and stability. Perfect for gaming and productivity. Compatible with Intel and AMD platforms.",
    short_description: "DDR4 RAM kit",
    price_cents: 1499900, // Changed from 'price' to 'price_cents'
    // No discount fields - this product has no active discount
    image_urls: [ // Define the image_urls array directly in mock data
      "https://www.cnet.com/a/img/resize/0d1705ffe2225c545380a8c3d0958df139e07e6e/hub/2025/08/14/fcc6d8d8-3860-4a0e-9de5-38b0e8cd5bd4/velocity-micro-raptor-z95a-gaming-pc-1095667-edit.jpg?auto=webp&fit=crop&height=1200&width=1200  ", // Main/First image
      "https://placehold.co/300x300?text=Vengeance+32GB+Back  ",
      "https://placehold.co/300x300?text=Vengeance+32GB+Specs  ",
      "https://placehold.co/300x300?text=Vengeance+32GB+Box  ",
    ],
    category_id: "ram",
    category: "RAM",
    brand: "Corsair",
    stock_quantity: 50, // Changed from 'stock' to 'stock_quantity'
    avg_rating: 4.5,
    num_ratings: 450,
    status: "active",
    spec_highlights: {
      size_gb: 32,
      speed_mhz: 3200,
      type: "DDR4",
      voltage_v: 1.35,
    },
  },
  {
    id: "5",
    name: "Samsung 980 PRO 1TB",
    description:
      "High-speed NVMe M.2 SSD for lightning-fast storage. Ideal for gaming, creative work, and reducing system boot times. Backed by Samsung's reliability.",
    short_description: "NVMe M.2 SSD",
    price_cents: 1299900, // Changed from 'price' to 'price_cents'
    discounted_price_cents: 1039920, // Discounted price in cents
    has_active_discount: true, // Indicates if discount is active
    effective_discount_percentage: 20, // Effective discount percentage
    image_urls: [ // Define the image_urls array directly in mock data
      "https://www.cnet.com/a/img/resize/0d1705ffe2225c545380a8c3d0958df139e07e6e/hub/2025/08/14/fcc6d8d8-3860-4a0e-9de5-38b0e8cd5bd4/velocity-micro-raptor-z95a-gaming-pc-1095667-edit.jpg?auto=webp&fit=crop&height=1200&width=1200  ", // Main/First image
      "https://placehold.co/300x300?text=980+PRO+1TB+Back  ",
      "https://placehold.co/300x300?text=980+PRO+1TB+Specs  ",
      "https://placehold.co/300x300?text=980+PRO+1TB+Box  ",
    ],
    category_id: "storage",
    category: "Storage",
    brand: "Samsung",
    stock_quantity: 30, // Changed from 'stock' to 'stock_quantity'
    avg_rating: 4.6,
    num_ratings: 320,
    status: "active",
    spec_highlights: {
      capacity_tb: 1,
      interface: "NVMe M.2 2280",
      sequential_read_mbs: 7000,
      sequential_write_mbs: 5000,
      type: "SSD",
    },
  },
  {
    id: "6",
    name: "ASUS ROG Strix Z790-E",
    description:
      "Premium ATX motherboard for Intel CPUs. Features excellent VRM cooling, multiple M.2 slots, and support for high-speed RAM. Perfect for high-end builds.",
    short_description: "ATX motherboard for Intel CPUs",
    price_cents: 3499900, // Changed from 'price' to 'price_cents'
    // No discount fields - this product has no active discount
    image_urls: [ // Define the image_urls array directly in mock data
      "https://www.cnet.com/a/img/resize/0d1705ffe2225c545380a8c3d0958df139e07e6e/hub/2025/08/14/fcc6d8d8-3860-4a0e-9de5-38b0e8cd5bd4/velocity-micro-raptor-z95a-gaming-pc-1095667-edit.jpg?auto=webp&fit=crop&height=1200&width=1200  ", // Main/First image
      "https://placehold.co/300x300?text=ROG+Strix+Z790-E+Back  ",
      "https://placehold.co/300x300?text=ROG+Strix+Z790-E+Top  ",
      "https://placehold.co/300x300?text=ROG+Strix+Z790-E+Box  ",
    ],
    category_id: "motherboards",
    category: "Motherboards",
    brand: "ASUS",
    stock_quantity: 12, // Changed from 'stock' to 'stock_quantity'
    avg_rating: 4.7,
    num_ratings: 180,
    status: "active",
    spec_highlights: {
      socket: "LGA1700",
      form_factor: "ATX",
      memory_slots: 4,
      max_memory_speed_mhz: 5600,
      max_memory_capacity_gb: 128,
      pcie_slots: ["x16", "x4"],
      m2_slots: 4,
      sata_ports: 6,
      chipset: "Intel Z790",
    },
  },
  {
    id: "7",
    name: "Fractal Design Torrent",
    description:
      "Well-ventilated mid-tower ATX case designed for optimal airflow and cable management. Features tempered glass panels and a sleek design.",
    short_description: "Mid-tower ATX case",
    price_cents: 1999900, // Changed from 'price' to 'price_cents'
    // No discount fields - this product has no active discount
    image_urls: [ // Define the image_urls array directly in mock data
      "https://www.cnet.com/a/img/resize/0d1705ffe2225c545380a8c3d0958df139e07e6e/hub/2025/08/14/fcc6d8d8-3860-4a0e-9de5-38b0e8cd5bd4/velocity-micro-raptor-z95a-gaming-pc-1095667-edit.jpg?auto=webp&fit=crop&height=1200&width=1200  ", // Main/First image
      "https://placehold.co/300x300?text=Torrent+Back  ",
      "https://placehold.co/300x300?text=Torrent+Interior  ",
      "https://placehold.co/300x300?text=Torrent+Box  ",
    ],
    category_id: "cases",
    category: "Cases",
    brand: "Fractal Design",
    stock_quantity: 20, // Changed from 'stock' to 'stock_quantity'
    avg_rating: 4.8,
    num_ratings: 155,
    status: "active",
    spec_highlights: {
      form_factor: "ATX",
      supported_form_factors: ["ATX", "Micro-ATX", "Mini-ITX"],
      max_gpu_length_mm: 360,
      max_cpu_cooler_height_mm: 165,
      drive_bays_internal_35: 2,
      drive_bays_internal_25: 2,
    },
  },
  {
    id: "8",
    name: "Corsair RM850x (2021)",
    description:
      "80+ Gold certified power supply offering reliable and efficient power delivery. Fully modular design for easy cable management. Suitable for high-end systems.",
    short_description: "80+ Gold certified power supply",
    price_cents: 1299900, // Changed from 'price' to 'price_cents'
    discounted_price_cents: 1169910, // Discounted price in cents
    has_active_discount: true, // Indicates if discount is active
    effective_discount_percentage: 10, // Effective discount percentage
    image_urls: [ // Define the image_urls array directly in mock data
      "https://www.cnet.com/a/img/resize/0d1705ffe2225c545380a8c3d0958df139e07e6e/hub/2025/08/14/fcc6d8d8-3860-4a0e-9de5-38b0e8cd5bd4/velocity-micro-raptor-z95a-gaming-pc-1095667-edit.jpg?auto=webp&fit=crop&height=1200&width=1200  ", // Main/First image
      "https://placehold.co/300x300?text=RM850x+Back  ",
      "https://placehold.co/300x300?text=RM850x+Specs  ",
      "https://placehold.co/300x300?text=RM850x+Box  ",
    ],
    category_id: "psus",
    category: "PSUs",
    brand: "Corsair",
    stock_quantity: 25, // Changed from 'stock' to 'stock_quantity'
    avg_rating: 4.6,
    num_ratings: 280,
    status: "active",
    spec_highlights: {
      wattage_w: 850,
      efficiency_rating: "80+ Gold",
      modularity: "Fully Modular",
      fan_size_mm: 135,
      protections: ["OCP", "OVP", "UVP", "OTP", "SCP"],
    },
  },
  {
    id: "9",
    name: "Logitech MX Master 3S",
    description:
      "Advanced wireless mouse with exceptional precision and comfort. Features a silent click wheel and long battery life. Perfect for productivity.",
    short_description: "Wireless mouse",
    price_cents: 1199900, // Changed from 'price' to 'price_cents'
    // No discount fields - this product has no active discount
    image_urls: [ // Define the image_urls array directly in mock data
      "https://www.cnet.com/a/img/resize/0d1705ffe2225c545380a8c3d0958df139e07e6e/hub/2025/08/14/fcc6d8d8-3860-4a0e-9de5-38b0e8cd5bd4/velocity-micro-raptor-z95a-gaming-pc-1095667-edit.jpg?auto=webp&fit=crop&height=1200&width=1200  ", // Main/First image
      "https://placehold.co/300x300?text=MX+Master+3S+Back  ",
      "https://placehold.co/300x300?text=MX+Master+3S+Side  ",
      "https://placehold.co/300x300?text=MX+Master+3S+Box  ",
    ],
    category_id: "peripherals",
    category: "Peripherals",
    brand: "Logitech",
    stock_quantity: 22, // Changed from 'stock' to 'stock_quantity'
    avg_rating: 4.7,
    num_ratings: 310,
    status: "active",
    spec_highlights: {
      sensor_dpi: 8000,
      scroll_type: "MagSpeed",
      battery_life_months: 4,
      connectivity: ["USB Receiver", "Bluetooth"],
      platform_compatibility: ["Windows", "macOS", "Linux"],
    },
  },
  {
    id: "10",
    name: "ASRock Phantom Gaming D",
    description:
      "Budget-friendly AM4 motherboard offering solid performance for AMD Ryzen processors. Includes decent VRM cooling and sufficient expansion slots.",
    short_description: "AMD AM4 motherboard",
    price_cents: 1199900, // Changed from 'price' to 'price_cents'
    // No discount fields - this product has no active discount
    image_urls: [ // Define the image_urls array directly in mock data
      "https://www.cnet.com/a/img/resize/0d1705ffe2225c545380a8c3d0958df139e07e6e/hub/2025/08/14/fcc6d8d8-3860-4a0e-9de5-38b0e8cd5bd4/velocity-micro-raptor-z95a-gaming-pc-1095667-edit.jpg?auto=webp&fit=crop&height=1200&width=1200  ", // Main/First image
      "https://placehold.co/300x300?text=Phantom+Gaming+D+Back  ",
      "https://placehold.co/300x300?text=Phantom+Gaming+D+Top  ",
      "https://placehold.co/300x300?text=Phantom+Gaming+D+Box  ",
    ],
    category_id: "motherboards",
    category: "Motherboards",
    brand: "ASRock",
    stock_quantity: 18, // Changed from 'stock' to 'stock_quantity'
    avg_rating: 4.3,
    num_ratings: 92,
    status: "active",
    spec_highlights: {
      socket: "AM4",
      form_factor: "ATX",
      memory_slots: 4,
      max_memory_speed_mhz: 4400,
      max_memory_capacity_gb: 128,
      pcie_slots: ["x16", "x1"],
      m2_slots: 1,
      sata_ports: 6,
      chipset: "AMD B550",
    },
  },
  {
    id: "11",
    name: "G.SKILL Trident Z5 RGB 64GB",
    description:
      "High-performance DDR5 RAM kit with RGB lighting. Optimized for AMD and Intel platforms. Delivers blazing speeds and stunning aesthetics.",
    short_description: "DDR5 RAM kit",
    price_cents: 3999900, // Changed from 'price' to 'price_cents'
    discounted_price_cents: 3199920, // Discounted price in cents
    has_active_discount: true, // Indicates if discount is active
    effective_discount_percentage: 20, // Effective discount percentage
    image_urls: [ // Define the image_urls array directly in mock data
      "https://www.cnet.com/a/img/resize/0d1705ffe2225c545380a8c3d0958df139e07e6e/hub/2025/08/14/fcc6d8d8-3860-4a0e-9de5-38b0e8cd5bd4/velocity-micro-raptor-z95a-gaming-pc-1095667-edit.jpg?auto=webp&fit=crop&height=1200&width=1200  ", // Main/First image
      "https://placehold.co/300x300?text=Trident+Z5+RGB+64GB+Back  ",
      "https://placehold.co/300x300?text=Trident+Z5+RGB+64GB+Specs  ",
      "https://placehold.co/300x300?text=Trident+Z5+RGB+64GB+Box  ",
    ],
    category_id: "ram",
    category: "RAM",
    brand: "G.SKILL",
    stock_quantity: 7, // Changed from 'stock' to 'stock_quantity'
    avg_rating: 4.8,
    num_ratings: 87,
    status: "active",
    spec_highlights: {
      size_gb: 64,
      speed_mhz: 6000,
      type: "DDR5",
      voltage_v: 1.4,
      rgb: true,
    },
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
        image_urls: ["https://placehold.co/100x100?text=i9-13900K"],
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
// src/services/api.js (Check this part)
export const fetchProductById = async (id) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  const product = mockProducts.find((p) => p.id === id); // This should find the product object from the array
  if (!product) {
    throw new Error(`Product with id ${id} not found.`);
  }
  // Return the product object as it exists in the mock data (containing description, spec_highlights, etc.)
  return product; // This should return the full product object
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
