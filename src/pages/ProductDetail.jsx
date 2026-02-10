import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useCart } from "../contexts/CartContext";
import { fetchProductById } from "../services/api"; // Import the new API function
import { toast } from "sonner"; // Import toast

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state for detail
  const [error, setError] = useState(null); // Add error state for detail
  const [selectedImageIndex, setSelectedImageIndex] = useState(0); // Track the index of the selected image from the array
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true); // Start loading
      setError(null); // Clear previous errors
      try {
        const data = await fetchProductById(id); // Fetch from real API (now using mock data)
        setProduct(data);
        // Reset selected image index when a new product loads
        setSelectedImageIndex(0);
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

  // Calculate the current image source based on the selected index and the product's image_urls
  const currentImageSrc =
    product && product.image_urls && product.image_urls[selectedImageIndex]
      ? product.image_urls[selectedImageIndex]
      : product?.image || ""; // Fallback to old 'image' field or empty string

  const handleAddToCart = async () => { // Make function async
    if (product) {
      try {
        const imageForCart = product.image_urls && product.image_urls[0]
          ? product.image_urls[0]
          : product.image;
        await addToCart({ ...product, quantity, image: product.image_urls[0] }); // Pass the selected image to the cart
        toast.success(`"${product.title}" added to cart!`); // Show success toast
      } catch (error) {
        console.error("Failed to add item to cart:", error);
        toast.error("Failed to add item to cart. Please try again."); // Show error toast
      }
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
  const imageGalleryList = product.image_urls || [product.image]; // Use image_urls array if available, otherwise fallback to single image

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
              alt={`${product.title} - Image ${selectedImageIndex + 1}`} // Provide better alt text
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
          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl font-bold text-primary">
              DZD {product.price}
            </span>
            {/* Removed discount calculation if not in API */}
            <span className="line-through text-gray-500">
              DZD {(product.price * 1.2).toFixed(2)}
            </span>
            <span className="badge badge-success bg-green-600 text-white">
              20% OFF
            </span>
          </div>

          <div className="mb-6">
            <p className="text-gray-600 mb-4">{product.description}</p>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Specifications:</h3>
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
                  {/* Add more specs from product.spec_highlights if needed */}
                  <tr>
                    <td>Stock Quantity</td>
                    <td
                      className={product.stock > 0
                        ? "text-success"
                        : "text-error"}
                    >
                      {product.stock > 0
                        ? `${product.stock} In Stock`
                        : "Out of Stock"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center">
              <button
                className="btn btn-sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <span className="mx-2">{quantity}</span>
              <button
                className="btn btn-sm"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
            <button
              className="btn btn-primary flex-1"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      <div className="divider"></div>
      {/* Related Products */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Related Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Related products would go here */}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
