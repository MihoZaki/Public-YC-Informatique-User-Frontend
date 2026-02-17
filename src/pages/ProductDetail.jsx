import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext"; // Import useAuth to check if user is logged in
import {
  fetchProductById,
  searchProducts,
  submitReview,
} from "../services/api"; // Import the API functions (removed addItemToCart)
import { toast } from "sonner"; // Import toast
import { StarIcon } from "@heroicons/react/24/solid"; // Import StarIcon for the rating display/form
import ProductCard from "../components/ProductCard"; // Import ProductCard for related products

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state for detail
  const [error, setError] = useState(null); // Add error state for detail
  const [selectedImageIndex, setSelectedImageIndex] = useState(0); // Track the index of the selected image from the array
  const [quantity, setQuantity] = useState(1);
  const { user } = useAuth(); // Get the current user from auth context
  const [reviews, setReviews] = useState([]); // State to hold reviews
  const [newReviewRating, setNewReviewRating] = useState(0); // State for the new review's star rating
  const [isSubmittingReview, setIsSubmittingReview] = useState(false); // Loading state for review submission
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedProductsLoading, setRelatedProductsLoading] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false); // Loading state for add to cart
  const { addToCart: addToLocalCart } = useCart(); // This calls the CartContext function

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true); // Start loading
      setError(null); // Clear previous errors
      try {
        const data = await fetchProductById(id); // Fetch from real API
        setProduct(data);
        // Reset selected image index when a new product loads
        setSelectedImageIndex(0);

        // Load related products after product is loaded
        loadRelatedProducts(data.category_id);

        // Initialize reviews state (will be populated separately if needed)
        setReviews([]); // Initialize with empty array
      } catch (err) {
        console.error(`Error fetching product with id ${id}:`, err);
        setError(
          err.message ||
            "Failed to load product details. Please try again later.",
        ); // Set error message
        toast.error("Failed to load product details. Please try again later."); // Show toast
      } finally {
        setLoading(false); // Stop loading regardless of success/error
      }
    };
    loadProduct();
  }, [id]);

  const loadRelatedProducts = async (categoryId) => {
    if (!categoryId) return;

    setRelatedProductsLoading(true);
    try {
      const response = await searchProducts({
        category_id: categoryId,
        limit: 6,
        page: 1,
      });
      // Filter out the current product from results
      const filteredProducts = response.data.filter((p) => p.id !== id);
      setRelatedProducts(filteredProducts);
    } catch (err) {
      console.error("Error fetching related products:", err);
      setRelatedProducts([]);
    } finally {
      setRelatedProductsLoading(false);
    }
  };

  // Calculate the current image source based on the selected index and the product's image_urls
  const currentImageSrc =
    product && product.image_urls && product.image_urls[selectedImageIndex]
      ? product.image_urls[selectedImageIndex]
      : ""; // Fallback to empty string if no images

  const handleAddToCart = async () => { // Make function async
    if (product) {
      setIsAddingToCart(true);
      try {
        // Use the CartContext function which handles API call and local state
        // Create a product object with the selected quantity
        const productToAdd = {
          ...product,
          quantity, // Use the selected quantity from state
        };

        await addToLocalCart(productToAdd);

        toast.success(`"${product.name}" added to cart!`); // Show success toast using product.name
      } catch (error) {
        console.error("Failed to add item to cart:", error);
        toast.error("Failed to add item to cart. Please try again."); // Show error toast
      } finally {
        setIsAddingToCart(false);
      }
    }
  };

  // Handler for submitting a new review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in to submit a rating.");
      return;
    }
    if (newReviewRating <= 0) {
      toast.error("Please select a rating.");
      return;
    }

    setIsSubmittingReview(true);
    try {
      // Call the actual API to submit the review
      await submitReview(product.id, newReviewRating);
      toast.success("Rating submitted successfully!");

      // Update the product's avg_rating and num_ratings locally after successful submission
      const totalRating = (product.avg_rating * product.num_ratings) +
        newReviewRating;
      const newNumRatings = product.num_ratings + 1;
      const newAvgRating = totalRating / newNumRatings;

      setProduct((prev) => ({
        ...prev,
        avg_rating: parseFloat(newAvgRating.toFixed(2)), // Round to 2 decimal places
        num_ratings: newNumRatings,
      }));

      // Reset the form
      setNewReviewRating(0);
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast.error("Failed to submit rating. Please try again.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (loading) { // Show loading state for product detail
    return (
      <div className="container mx-auto px-4 py-8 bg-inherit min-h-screen">
        <div className="skeleton h-96 w-full mb-6 bg-base-200"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="skeleton h-8 w-3/4 mb-4 bg-base-200"></div>
            <div className="skeleton h-4 w-full mb-2 bg-base-200"></div>
            <div className="skeleton h-4 w-5/6 mb-6 bg-base-200"></div>
            <div className="skeleton h-12 w-full bg-base-200"></div>
          </div>
          <div>
            <div className="skeleton h-64 w-full bg-base-200"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) { // Show error state for product detail
    return (
      <div className="container mx-auto px-4 py-8 bg-inherit min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4 text-error">
            Error loading product: {error}
          </p>
          <button
            className="btn btn-primary"
            onClick={() => window.location.reload()} // Simple retry mechanism
          >
            Retry
          </button>
          <Link to="/products" className="btn btn-accent btn-outline">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  if (!product) { // Fallback if product state is somehow null after loading
    return (
      <div className="container mx-auto px-4 py-8 bg-inherit min-h-screen">
        <p className="text-center text-error">Product not found.</p>
        <Link to="/products" className="btn btn-primary">Back to Products</Link>
      </div>
    );
  }

  // Determine the list of images to display in the thumbnail gallery
  const imageGalleryList = product.image_urls || []; // Use image_urls array, fallback to empty array if none

  // --- Determine Pricing Information ---
  const hasDiscount = product.has_active_discount &&
    product.discounted_price_cents !== undefined;
  const currentPrice = hasDiscount
    ? product.discounted_price_cents / 100
    : product.price_cents / 100; // Convert cents to dollars
  const originalPrice = hasDiscount ? product.price_cents / 100 : null; // Convert cents to dollars
  const discountPercentage = hasDiscount
    ? product.effective_discount_percentage
    : 0;
  // --- End of Determination ---

  return (
    <div className="container mx-auto px-4 py-8 bg-inherit min-h-screen">
      {/* Updated Link with btn-sm */}
      <Link to="/products" className="btn btn-accent btn-outline mb-6">
        <ArrowLeftIcon className="h-4 w-4 mr-2" />
        Back to Products
      </Link>

      <div className="divider"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div>
          <div className="aspect-square mb-4 bg-base-100 rounded-lg p-4">
            <img
              src={currentImageSrc} // Use the image source determined by state/index
              alt={`${product.name} - Image ${selectedImageIndex + 1}`} // Provide better alt text using product.name
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
          {/* Thumbnail Strip */}
          <div className="flex flex-wrap gap-2 mt-2 max-h-32 overflow-y-auto">
            {/* Added flex-wrap and scrollable container */}
            {imageGalleryList.map((imgUrl, index) => (
              <button
                key={index} // Use the array index as the key
                className={`w-16 h-16 border rounded ${
                  selectedImageIndex === index
                    ? "border-primary ring-2 ring-primary"
                    : "border-transparent"
                } bg-base-200 flex-shrink-0`} // Highlight selected image
                onClick={() => setSelectedImageIndex(index)} // Update selected index on click
                title={`View Image ${index + 1}`} // Tooltip for clarity
              >
                <img
                  src={imgUrl}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover rounded pointer-events-none"
                />{" "}
                {/* pointer-events-none prevents interaction with img itself */}
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>{" "}
          {/* Use product.name */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl font-bold text-primary">
              DA {currentPrice.toFixed(2)}{" "}
              {/* Use currentPrice and convert to DA */}
            </span>
            {/* Show original price if there's a discount */}
            {hasDiscount && originalPrice && (
              <>
                <span className="line-through text-gray-500">
                  DA {originalPrice.toFixed(2)}
                </span>
                <span className="badge badge-success bg-green-600 text-white">
                  -{discountPercentage.toFixed(0)}%
                </span>
              </>
            )}
          </div>

          {/* Short Description */}
          <p className="text-gray-600 mb-4">
            {product.description ||
              product.short_description || "No description available."}
          </p>

          {/* Old-style specs table */}
          <div className="mb-6">
            <table className="table table-zebra bg-base-100">
              <tbody>
                <tr>
                  <td>Category</td>
                  <td>{product.category}</td>
                </tr>
                <tr>
                  <td>Brand</td>
                  <td>{product.brand}</td>
                </tr>
                <tr>
                  <td>Stock Quantity</td>
                  <td
                    className={product.stock_quantity > 0
                      ? "text-success"
                      : "text-error"}
                  >
                    {product.stock_quantity > 0
                      ? `${product.stock_quantity} In Stock`
                      : "Out of Stock"}
                  </td>
                </tr>
                <tr>
                  <td>Avg Rating</td>
                  <td>{product.avg_rating} ({product.num_ratings} reviews)</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Add to Cart Section */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center">
              <button
                className="btn btn-sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={isAddingToCart} // Disable when adding to cart
              >
                -
              </button>
              <span className="mx-2">{quantity}</span>
              <button
                className="btn btn-sm"
                onClick={() => setQuantity(quantity + 1)}
                disabled={isAddingToCart} // Disable when adding to cart
              >
                +
              </button>
            </div>
            <button
              className="btn btn-primary flex-1"
              onClick={handleAddToCart}
              disabled={isAddingToCart} // Disable when adding to cart
            >
              {isAddingToCart
                ? (
                  <>
                    <span className="loading loading-spinner loading-xs mr-2">
                    </span>
                    Adding...
                  </>
                )
                : (
                  "Add to Cart"
                )}
            </button>
          </div>

          {/* Reviews Section (Stars Only, Repositioned) */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-2">Rate this Product</h3>
            {user
              ? (
                <form onSubmit={handleReviewSubmit}>
                  <div className="flex space-x-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`text-xl ${
                          star <= newReviewRating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                        onClick={() => setNewReviewRating(star)}
                      >
                        <StarIcon className="h-6 w-6" />
                      </button>
                    ))}
                  </div>
                  <button
                    type="submit"
                    className="btn btn-sm btn-primary"
                    disabled={isSubmittingReview || newReviewRating <= 0}
                  >
                    {isSubmittingReview
                      ? (
                        <>
                          <span className="loading loading-spinner loading-xs mr-2">
                          </span>
                          Submitting...
                        </>
                      )
                      : (
                        "Submit Rating"
                      )}
                  </button>
                </form>
              )
              : (
                <p className="text-sm text-gray-500">
                  Log in to rate this product.
                </p>
              )}
          </div>

          <div className="divider"></div>
          <h2 className="text-2xl content-center font-bold mb-4">
            Specifications
          </h2>
          <div className="bg-base-100 p-4 rounded-box border border-base-200">
            <table className="table table-zebra">
              <tbody>
                {product.spec_highlights &&
                  Object.entries(product.spec_highlights).map((
                    [key, value],
                  ) => (
                    <tr key={key}>
                      <td className="font-semibold capitalize">
                        {key.replace(/_/g, " ")}
                      </td>{" "}
                      {/* Format key */}
                      <td>{value}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="divider"></div>
      {/* Related Products */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Related Products</h2>
        {relatedProductsLoading
          ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card bg-base-100 shadow-xl">
                  <div className="skeleton h-48 w-full"></div>
                  <div className="card-body">
                    <div className="skeleton h-4 w-3/4 mb-2"></div>
                    <div className="skeleton h-4 w-full mb-2"></div>
                    <div className="skeleton h-4 w-1/2 mb-4"></div>
                    <div className="skeleton h-8 w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          )
          : relatedProducts.length > 0
          ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          )
          : (
            <p className="text-center text-gray-500">
              No related products found.
            </p>
          )}
      </div>
    </div>
  );
};

export default ProductDetail;
