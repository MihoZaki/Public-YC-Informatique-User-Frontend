// src/pages/Products.jsx
import React, { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "../components/ProductCard";
import FilterPanel from "../components/FilterPanel";
import { fetchCategories, fetchProducts } from "../services/api"; // Import the new API functions
import { toast } from "sonner";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  // State for filters (managed locally or could be derived from URL params)
  // For now, let's initialize from URL params if they exist, otherwise empty
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    brand: searchParams.get("brand") || "",
  });

  // Fetch products using useQuery - Initial fetch without filters
  // We'll fetch page 1, limit 50 for now as an example
  const {
    data: productsData = {
      data: [],
      page: 1,
      limit: 20,
      total: 0,
      total_pages: 1,
    }, // Provide a default structure - CORRECTED SYNTAX
    isLoading: productsLoading,
    isError: productsError,
    error: productsApiError,
    refetch: refetchProducts, // Function to manually refetch if needed
  } = useQuery({
    queryKey: ["products", { page: 1, limit: 50 }], // Include basic pagination params in key
    queryFn: () => fetchProducts(1, 50), // Call fetchProducts with page and limit
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
  });

  // Fetch categories using useQuery
  const {
    data: categories = [], // Default to empty array
    isLoading: categoriesLoading,
    isError: categoriesError,
    error: categoriesApiError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories, // Direct function call
    staleTime: 15 * 60 * 1000, // Cache for 15 minutes
  });

  // Destructure products array and pagination info from productsData
  const { data: products = [] } = productsData; // Destructure the 'data' key - CORRECTED SYNTAX

  // Combine loading states if needed for a single spinner covering both products and categories
  const overallLoading = productsLoading || categoriesLoading;

  // Combine error states if needed
  const overallError = productsError || categoriesError;
  const overallErrorMessage = productsApiError?.message ||
    categoriesApiError?.message || "An unknown error occurred";

  // Memoize filtered products to avoid re-filtering on every render
  // For now, apply NO client-side filtering, just use the products from the API result
  // We will add API-based filtering later using searchProducts
  const filteredProducts = useMemo(() => {
    console.log("DEBUG: Applying filters to products from API");
    console.log("DEBUG: Raw products from API:", products);
    console.log("DEBUG: Current filters:", filters);
    console.log("DEBUG: Available categories for mapping:", categories);

    // For now, just return the products array from the API call.
    // We will implement filtering via searchProducts later.
    // This is the simplest case where API handles the filtering.
    // If filters were applied via searchProducts, this would be the result.
    return products;
  }, [products, filters, categories]); // Dependency array includes products, filters, and categories

  const handleFilterChange = (key, value) => {
    if (key === "reset") {
      setFilters({ category: "", minPrice: "", maxPrice: "", brand: "" });
      setSearchParams({});
    } else {
      setFilters((prev) => ({ ...prev, [key]: value }));
      // Update URL search params based on filter change
      const newParams = { ...Object.fromEntries(searchParams.entries()) }; // Copy existing params
      if (value) {
        newParams[key] = value;
      } else {
        delete newParams[key]; // Remove param if value is empty
      }
      setSearchParams(newParams);
    }
  };

  // Handle loading states (both products and categories)
  if (overallLoading) {
    console.log("DEBUG: Overall loading is true");
    return (
      <div className="container mx-auto px-4 py-8 bg-inherit min-h-screen">
        <h1 className="text-3xl font-bold mb-8 ">Products</h1>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter Panel Skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-base-100 p-4 rounded-lg shadow-md border border-neutral-content">
              <div className="skeleton h-4 w-1/4 mb-4"></div>
              <div className="skeleton h-10 w-full mb-4"></div>
              <div className="skeleton h-10 w-full mb-4"></div>
              <div className="skeleton h-10 w-full mb-4"></div>
              <div className="skeleton h-8 w-full"></div>
            </div>
          </div>
          {/* Product Grid Skeleton */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card bg-inherit shadow-xl">
                  <div className="skeleton h-48 w-full bg-gray-700/50"></div>
                  <div className="card-body">
                    <div className="skeleton h-4 w-3/4 mb-2 bg-gray-700/50">
                    </div>
                    <div className="skeleton h-4 w-full mb-2 bg-gray-700/50">
                    </div>
                    <div className="skeleton h-4 w-1/2 mb-4 bg-gray-700/50">
                    </div>
                    <div className="skeleton h-8 w-full bg-gray-700/50"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle error states (either products or categories)
  if (overallError) {
    console.log("DEBUG: Overall error occurred:", overallErrorMessage);
    return (
      <div className="container mx-auto px-4 py-8 bg-inherit min-h-screen">
        <h1 className="text-3xl font-bold mb-8 ">Products</h1>
        <div className="text-center py-12">
          <p className="text-xl mb-4 text-error">
            Error loading {overallErrorMessage}
          </p>
          <button
            className="btn btn-primary"
            onClick={() => {
              refetchProducts(); /* Add refetch for categories if needed */
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Log the final filtered products count before rendering
  console.log(
    "DEBUG: Rendering",
    filteredProducts.length,
    "filtered products from API",
  );

  return (
    <div className="container mx-auto px-4 py-8 bg-inherit min-h-screen">
      <h1 className="text-3xl font-bold mb-8 ">Products</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filter Panel - Pass categories and loading state if needed */}
        <div className="lg:col-span-1">
          <FilterPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            categories={categories} // Pass the categories fetched by useQuery
            loading={categoriesLoading} // Pass loading state if FilterPanel needs it (though skeleton is handled above now)
          />
        </div>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          {/* Results Count - Optional, based on API pagination data */}
          {
            /* <p className="mb-4 ">
            Showing {filteredProducts.length} of {productsData.total} products
          </p> */
          }

          {filteredProducts.length === 0
            ? (
              <div className="text-center py-12">
                <p className="text-xl mb-4 ">
                  No products found matching your criteria.
                </p>
                <button
                  className="btn btn-secondary bg-gray-700 hover:bg-gray-600 "
                  onClick={() => handleFilterChange("reset")}
                >
                  Clear Filters
                </button>
              </div>
            )
            : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Products;
