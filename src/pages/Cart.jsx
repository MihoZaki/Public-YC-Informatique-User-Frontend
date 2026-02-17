import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { TrashIcon } from "@heroicons/react/24/solid";

const Cart = () => {
  const { cart, subtotal, total, updateQuantity, removeFromCart, clearCart } =
    useCart();

  // Initialize localQuantities with the current cart quantities
  const [localQuantities, setLocalQuantities] = useState(
    cart.reduce((acc, item) => {
      acc[item.id] = item.quantity;
      return acc;
    }, {}),
  );

  // Ref to store timeout IDs for each item
  const timeoutRefs = useRef({});

  // Update localQuantities whenever the cart changes
  useEffect(() => {
    setLocalQuantities(
      cart.reduce((acc, item) => {
        acc[item.id] = item.quantity;
        return acc;
      }, {}),
    );
  }, [cart]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(timeoutRefs.current).forEach((timeoutId) => {
        if (timeoutId) clearTimeout(timeoutId);
      });
    };
  }, []);

  // Function to handle quantity update with debounce and stock limit
  const handleQuantityUpdate = (productId, newQuantity) => {
    // Find the cart item to get its stock quantity
    const item = cart.find((i) => i.id === productId);
    if (!item) return;

    // Limit the quantity to the available stock
    const maxQuantity = item.stock_quantity;
    const limitedQuantity = Math.min(newQuantity, maxQuantity);

    // Update local state immediately for instant UI feedback
    setLocalQuantities((prev) => ({
      ...prev,
      [productId]: limitedQuantity,
    }));

    // Clear existing timeout for this product if it exists
    if (timeoutRefs.current[productId]) {
      clearTimeout(timeoutRefs.current[productId]);
    }

    // Schedule the backend update after 500ms
    timeoutRefs.current[productId] = setTimeout(() => {
      // Check if the item is still in the cart
      const itemExists = cart.some((item) => item.id === productId);
      if (itemExists) {
        // Call the actual cart update function with the limited quantity
        updateQuantity(productId, limitedQuantity);
      }
      // Clean up the timeout ref after execution
      delete timeoutRefs.current[productId];
    }, 500); // 500ms delay before API call
  };

  // Handler for quantity decrease
  const handleDecreaseQuantity = (item) => {
    const newQuantity = Math.max(
      1,
      (localQuantities[item.id] !== undefined
        ? localQuantities[item.id]
        : item.quantity) - 1,
    );
    handleQuantityUpdate(item.id, newQuantity);
  };

  // Handler for quantity increase
  const handleIncreaseQuantity = (item) => {
    // Calculate the new quantity (current + 1)
    const currentQuantity = localQuantities[item.id] !== undefined
      ? localQuantities[item.id]
      : item.quantity;
    const newQuantity = currentQuantity + 1;

    // This will be limited by handleQuantityUpdate
    handleQuantityUpdate(item.id, newQuantity);
  };

  // Calculate total original value, total discounted value, and total savings from the cart
  // These values come directly from the backend response
  const { totalOriginalValue, totalDiscountedValue, totalSavings } = useMemo(
    () => {
      let originalValue = 0;
      let discountedValue = 0;
      let savings = 0;

      cart.forEach((item) => {
        const quantity = localQuantities[item.id] !== undefined
          ? localQuantities[item.id]
          : item.quantity;

        // Extract price info from the product object
        const originalPrice = item.original_price_cents
          ? item.original_price_cents / 100
          : item.price;
        const finalPrice = item.final_price_cents
          ? item.final_price_cents / 100
          : item.price;
        const hasDiscount = item.has_active_discount;

        originalValue += originalPrice * quantity;
        discountedValue += finalPrice * quantity;
        if (hasDiscount) {
          savings += (originalPrice - finalPrice) * quantity;
        }
      });

      return {
        totalOriginalValue: originalValue,
        totalDiscountedValue: discountedValue,
        totalSavings: savings,
      };
    },
    [cart, localQuantities],
  );

  return (
    <div className="container mx-auto px-4 py-8 bg-inherit min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {cart.length === 0
        ? (
          <div className="text-center py-12">
            <p className="text-xl mb-4">Your cart is empty</p>
            <Link to="/products" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        )
        : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {cart.map((item) => {
                  // Use the local quantity if available, otherwise use the item's quantity
                  const displayQuantity = localQuantities[item.id] !== undefined
                    ? localQuantities[item.id]
                    : item.quantity;

                  // Extract price info from the product object
                  const originalPrice = item.original_price_cents
                    ? item.original_price_cents / 100
                    : item.price;
                  const finalPrice = item.final_price_cents
                    ? item.final_price_cents / 100
                    : item.price;
                  const hasDiscount = item.has_active_discount;

                  // Calculate max quantity based on stock
                  const maxQuantity = item.stock_quantity;
                  const isAtMaxStock = displayQuantity >= maxQuantity;

                  return (
                    <div
                      key={item.id}
                      className="card bg-base-100 shadow-lg border border-base-200"
                    >
                      <div className="card-body">
                        <div className="flex items-center space-x-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-contain bg-inherit p-2 rounded"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold">{item.name}</h3>
                            <div className="flex items-center gap-2">
                              {hasDiscount && (
                                <span className="line-through text-gray-500">
                                  DZD {originalPrice.toFixed(2)}
                                </span>
                              )}
                              <span className="text-primary font-bold">
                                DZD {finalPrice.toFixed(2)}
                              </span>
                              {hasDiscount && (
                                <span className="badge badge-success bg-green-600 text-white">
                                  -{originalPrice > 0
                                    ? ((1 - finalPrice / originalPrice) * 100)
                                      .toFixed(0)
                                    : "0"}%
                                </span>
                              )}
                            </div>
                            {/* Stock availability indicator */}
                            <div className="text-sm mt-1">
                              {isAtMaxStock
                                ? (
                                  <span className="text-warning">
                                    Maximum stock reached ({maxQuantity})
                                  </span>
                                )
                                : (
                                  <span className="text-success">
                                    In Stock: {maxQuantity} available
                                  </span>
                                )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              className="btn btn-xs"
                              onClick={() => handleDecreaseQuantity(item)}
                              type="button"
                            >
                              -
                            </button>
                            <span className="mx-2">
                              {displayQuantity}
                            </span>
                            <button
                              className={`btn btn-xs ${
                                isAtMaxStock ? "btn-disabled" : ""
                              }`}
                              onClick={() => handleIncreaseQuantity(item)}
                              type="button"
                              disabled={isAtMaxStock}
                            >
                              +
                            </button>
                          </div>
                          <button
                            className="btn btn-error btn-xs"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <TrashIcon className="h-4 w-4 text-white" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6">
                <button className="btn btn-error btn-sm" onClick={clearCart}>
                  Clear Cart
                </button>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="card bg-base-100 shadow-lg sticky top-24 border border-base-200">
                <div className="card-body">
                  <h3 className="card-title">Order Summary</h3>

                  <div className="space-y-2">
                    {/* Original price with discount strikethrough */}
                    <div className="flex justify-between">
                      <span>Original Price:</span>
                      <span className="line-through text-gray-500">
                        DZD {totalOriginalValue.toFixed(2)}
                      </span>
                    </div>

                    {/* Current subtotal */}
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>DZD {subtotal.toFixed(2)}</span>
                    </div>

                    {/* Total savings */}
                    {totalSavings > 0 && (
                      <div className="flex justify-between text-success">
                        <span>You Save:</span>
                        <span>-DZD {totalSavings.toFixed(2)}</span>
                      </div>
                    )}

                    {/* Display additional backend-calculated totals */}
                    <div className="flex justify-between">
                      <span>Items:</span>
                      <span>{cart.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Quantity:</span>
                      <span>
                        {cart.reduce((sum, item) => sum + item.quantity, 0)}
                      </span>
                    </div>

                    <div className="divider"></div>

                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>DZD {total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Link to="/checkout" className="btn btn-primary w-full mt-4">
                    Proceed to Checkout
                  </Link>

                  <Link
                    to="/products"
                    className="btn btn-secondary btn-outline w-full mt-2"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default Cart;
