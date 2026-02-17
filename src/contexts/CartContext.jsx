import React, { createContext, useContext, useEffect, useState } from "react";
import { useStore } from "../stores/useStore";
import {
  addItemToCart,
  clearUserCart,
  fetchUserCart,
  removeCartItem,
  updateCartItem,
} from "../services/api";
import { toast } from "sonner";

// Import the auth context to listen for changes
import { useAuth } from "../contexts/AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    setCartFromBackend, // Add new function to the store to set cart directly
  } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false); // Track initialization

  // Get auth context to detect login/logout events
  const { user, isAuthenticated } = useAuth();

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => {
    const price = typeof item.price === "number"
      ? item.price
      : parseFloat(item.price);
    const quantity = typeof item.quantity === "number"
      ? item.quantity
      : parseInt(item.quantity);
    return sum + (isNaN(price) ? 0 : price) * (isNaN(quantity) ? 0 : quantity);
  }, 0);
  const total = subtotal;

  // Function to sync the entire cart with the backend
  const syncCartWithBackend = async () => {
    try {
      const backendCart = await fetchUserCart();

      if (backendCart.items && Array.isArray(backendCart.items)) {
        // Prepare cart items from backend data
        const cartItemsFromBackend = backendCart.items.map((cartItem) => {
          const product = cartItem.product;
          const unitPrice = product.final_price_cents / 100; // Use product's final price

          return {
            id: product.id,
            name: product.name,
            price: unitPrice, // This is the final/discounted price
            original_price_cents: product.original_price_cents, // Preserve original price
            final_price_cents: product.final_price_cents, // Preserve final price
            image: product.image_urls && product.image_urls.length > 0
              ? product.image_urls[0]
              : "", // Use first image URL
            quantity: cartItem.quantity, // This is the crucial part - use the actual quantity from backend
            cart_item_id: cartItem.id, // Store the backend cart item ID
            brand: product.brand,
            stock_quantity: product.stock_quantity,
            has_active_discount: product.has_active_discount,
          };
        });

        // Set the entire cart state directly from backend data
        setCartFromBackend(cartItemsFromBackend);
      }
    } catch (error) {
      // Handle unauthorized error specifically
      if (error.response?.status === 401) {
        // User is not authorized, which might mean token expired
        // Don't clear cart in this case, as it might be a guest cart
        console.warn(
          "Cart sync failed due to authorization error, continuing with current cart",
        );
      } else {
        console.error("Failed to sync cart with backend:", error);
        // Don't clear cart on sync failure - maintain current state
        // Clear the cart if there's an error (user not logged in)
        clearCart();
      }
    }
  };

  // Load cart from backend on component mount
  useEffect(() => {
    const loadCartFromBackend = async () => {
      setIsLoading(true);
      try {
        await syncCartWithBackend();
      } catch (error) {
        console.error("Failed to load cart from backend:", error);
        clearCart();
      } finally {
        setIsLoading(false);
        setIsInitialized(true); // Mark as initialized
      }
    };

    loadCartFromBackend();
  }, []); // Remove dependencies to prevent re-running

  // Effect to sync cart when user authentication status changes
  useEffect(() => {
    if (isInitialized) {
      // Refresh cart when authentication status changes
      syncCartWithBackend();
    }
  }, [isAuthenticated, isInitialized]);

  // Enhanced cart actions that sync with backend
  const syncAddToCart = async (product) => {
    if (!isInitialized) {
      toast.error("Cart not ready. Please try again.");
      return;
    }

    try {
      // Call backend API first
      const response = await addItemToCart(product.id, product.quantity || 1);

      // After adding to backend, sync the entire cart to ensure consistency
      await syncCartWithBackend();
    } catch (error) {
      // Handle unauthorized error specifically
      if (error.response?.status === 401) {
        toast.error("Please log in to add items to your cart.");
      } else {
        console.error("Failed to add item to cart:", error);
        toast.error("Failed to add item to cart. Please try again.");
      }
    }
  };

  const syncRemoveFromCart = async (productId) => {
    if (!isInitialized) {
      toast.error("Cart not ready. Please try again.");
      return;
    }

    try {
      // Find the cart item ID in the current cart
      const cartItem = cart.find((item) => item.id === productId);
      if (cartItem && cartItem.cart_item_id) {
        await removeCartItem(cartItem.cart_item_id);
      }

      // After removing from backend, sync the entire cart to ensure consistency
      await syncCartWithBackend();
    } catch (error) {
      // Handle unauthorized error specifically
      if (error.response?.status === 401) {
        toast.error("Please log in to manage your cart.");
      } else {
        console.error("Failed to remove item from cart:", error);
        toast.error("Failed to remove item from cart. Please try again.");
      }
    }
  };

  const syncUpdateQuantity = async (productId, quantity) => {
    if (!isInitialized) {
      toast.error("Cart not ready. Please try again.");
      return;
    }

    try {
      if (quantity <= 0) {
        await syncRemoveFromCart(productId);
        return;
      }

      // Find the cart item ID in the current cart
      const cartItem = cart.find((item) => item.id === productId);
      if (cartItem && cartItem.cart_item_id) {
        await updateCartItem(cartItem.cart_item_id, quantity);

        // After updating backend, sync the entire cart to ensure consistency
        await syncCartWithBackend();
      }
    } catch (error) {
      // Handle unauthorized error specifically
      if (error.response?.status === 401) {
        toast.error("Please log in to update your cart.");
      } else {
        console.error("Failed to update quantity:", error);
        toast.error("Failed to update quantity. Please try again.");
      }
    }
  };

  const syncClearCart = async () => {
    if (!isInitialized) {
      toast.error("Cart not ready. Please try again.");
      return;
    }

    try {
      await clearUserCart();

      // Update local store
      clearCart();
    } catch (error) {
      // Handle unauthorized error specifically
      if (error.response?.status === 401) {
        toast.error("Please log in to clear your cart.");
      } else {
        console.error("Failed to clear cart:", error);
        toast.error("Failed to clear cart. Please try again.");
      }
    }
  };

  // Expose a method to manually refresh the cart
  const refreshCart = async () => {
    setIsLoading(true);
    await syncCartWithBackend();
    setIsLoading(false);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart: syncAddToCart,
        removeFromCart: syncRemoveFromCart,
        updateQuantity: syncUpdateQuantity,
        clearCart: syncClearCart,
        refreshCart, // Expose the refresh function
        subtotal,
        total,
        isLoading, // Add loading state
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
