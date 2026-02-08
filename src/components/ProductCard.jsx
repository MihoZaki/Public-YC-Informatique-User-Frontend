import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  CheckCircleIcon,
  EyeIcon,
  ShoppingCartIcon,
  StarIcon,
} from "@heroicons/react/24/solid";
import { useCart } from "../contexts/CartContext";

const ProductCard = ({ product }) => {
  const navigation = useNavigate();
  const savedTheme = localStorage.getItem("theme");
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const handleQuickAdd = async () => {
    if (isAdding) return;
    setIsAdding(true);
    setIsAdded(false);

    try {
      // Ensure the image added to the cart is the first one from the product's image_urls, or fall back to image
      const imageForCart = product.image_urls
        ? product.image_urls[0]
        : product.image;
      await addToCart({ ...product, quantity: 1, image: imageForCart }); // Pass the correct image
      setIsAdded(true);
      toast.success(`"${product.title}" added to cart!`);
      setTimeout(() => {
        setIsAdded(false);
      }, 1500);
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      toast.error("Failed to add item to cart. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };
  // ...
  const handleCardPress = () => {
    navigation(`/product/${product.id}`);
  };

  const displayImage = product.image_urls
    ? product.image_urls[0]
    : product.image;
  return (
    <div
      className={`card bg-base-100 shadow-sm hover:shadow-2xl transition-shadow duration-300 relative border rounded-lg border-info`}
    >
      <figure
        className="h-48 overflow-hidden cursor-pointer"
        onClick={handleCardPress}
      >
        <img
          src={displayImage}
          alt={product.title}
          className="w-full h-full object-fill rounded-t-lg hover:scale-105 transition-transform duration-300"
        />
      </figure>
      <div className="card-body p-4">
        <h2 className="card-title text-m line-clamp-2">{product.title}</h2>
        <div className="flex items-center gap-1">
          <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
          <span className="text-xs">4.5</span>
          <span className="text-xs text-gray-500">(128)</span>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2">
          {product.description}
        </p>
        <div className="mt-2 flex flex-row items-baseline justify-between flex-wrap gap-2">
          {true
            ? (
              <div className="flex flex-row items-center gap-1">
                <p className="text-xs font-medium text-gray-400 line-through mb-2">
                  DA {product.price}
                </p>
                <p className="text-sm font-bold text-base-content mb-2">
                  DA {(product.price - 10).toFixed(2)}
                </p>
              </div>
            )
            : (
              <p className="text-lg font-bold text-base-content mb-2">
                DA {product.price}
              </p>
            )}
          <button
            className={`btn btn-sm ${
              isAdded ? "btn-success " : "btn-primary"
            } z-50`}
            onClick={handleQuickAdd}
            title={isAdded ? "Added to Cart!" : "Add to Cart"}
            disabled={isAdded || isAdding}
          >
            {isAdding
              ? <span className="loading loading-spinner loading-xs"></span>
              : isAdded
              ? (
                <>
                  <CheckCircleIcon className="h-4 w-4 mr-1 text-base-content" />
                  <span className="text-base-content">Added!</span>
                </>
              )
              : (
                <>
                  <ShoppingCartIcon className="h-4 w-4 text-white  mr-1" />
                  Add to cart
                </>
              )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
