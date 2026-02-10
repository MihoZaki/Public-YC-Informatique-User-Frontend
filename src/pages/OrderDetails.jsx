import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchOrderById } from "../services/api"; // Import the API function
import { toast } from "sonner"; // Import toast for error messages

const OrderDetails = () => {
  const { orderId } = useParams(); // Get the order ID from the URL
  const [order, setOrder] = useState(null); // State to hold the order details
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for errors

  useEffect(() => {
    const loadOrder = async () => {
      if (!orderId) {
        setError("Order ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setError(null); // Reset error state
        setLoading(true); // Set loading state
        const data = await fetchOrderById(orderId); // Fetch the specific order
        setOrder(data); // Update state with fetched order
      } catch (err) {
        console.error(`Error fetching order with id ${orderId}:`, err);
        setError(
          err.message ||
            "Failed to load order details. Please try again later.",
        );
        toast.error("Failed to load order details. Please try again later.");
      } finally {
        setLoading(false); // Always stop loading
      }
    };

    loadOrder();
  }, [orderId]); // Depend on orderId to refetch if it changes

  return (
    <div className="container mx-auto px-4 py-8 bg-inherit min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Order Details</h1>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center min-h-[200px]">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="alert alert-error">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-sm"
          >
            Retry
          </button>
        </div>
      )}

      {/* Order Details */}
      {!loading && !error && order && (
        <>
          {/* Back Button */}
          <div className="mb-6">
            <Link to="/account/orders" className="btn btn-sm btn-ghost">
              &larr; Back to Orders
            </Link>
          </div>

          {/* Order Summary Card */}
          <div className="card bg-base-100 shadow-lg border border-secondary-content mb-6">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">Order #{order.id}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={`badge ${
                        order.status === "completed"
                          ? "badge-success"
                          : order.status === "shipped"
                          ? "badge-info"
                          : order.status === "processing"
                          ? "badge-warning"
                          : "badge-neutral" // Default for other statuses
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Total Amount:</strong> DZD{" "}
                    {order.totalAmount.toFixed(2)}
                  </p>
                  <p>
                    <strong>Subtotal:</strong> DZD {order.subtotal.toFixed(2)}
                  </p>
                  <p>
                    <strong>Shipping Cost:</strong> DZD{" "}
                    {order.shippingCost.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Items List Card */}
          <div className="card bg-base-100 shadow-lg border border-secondary-content mb-6">
            <div className="card-body">
              <h3 className="card-title text-xl mb-4">Items Ordered</h3>
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="font-bold">Item</th>
                      <th className="font-bold">Price</th>
                      <th className="font-bold">Quantity</th>
                      <th className="font-bold">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item.productId}>
                        {/* Use productId or a unique identifier if available */}
                        <td>
                          <div className="flex items-center gap-4">
                            <div className="rounded-md overflow-hidden bg-base-200 p-1 w-16 h-16 flex-shrink-0">
                              {/* Fixed size container */}
                              <img
                                src={item.image_urls
                                  ? item.image_urls[0]
                                  : "https://placehold.co/100x100?text=No+Image"} // Use first image or placeholder
                                alt={item.name}
                                className="w-full h-full object-contain rounded-none" // Fill container
                              />
                            </div>
                            <div>
                              <p className="font-semibold">{item.name}</p>
                              {/* Add more item specs here if available in the item object */}
                              {/* <p className="text-sm text-gray-500">Specs: ...</p> */}
                            </div>
                          </div>
                        </td>
                        <td>DZD {item.price.toFixed(2)}</td>
                        <td>{item.quantity}</td>
                        <td>DZD {(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Addresses Card */}
          <div className="card bg-base-100 shadow-lg border border-secondary-content">
            <div className="card-body">
              <h3 className="card-title text-xl mb-4">Addresses</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-bold mb-2">Shipping Address</h4>
                  <p>
                    {order.shippingAddress.firstName}{" "}
                    {order.shippingAddress.lastName}
                  </p>
                  <p>{order.shippingAddress.address}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state}
                    {" "}
                    {order.shippingAddress.zipCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Billing Address</h4>
                  <p>
                    {order.billingAddress.firstName}{" "}
                    {order.billingAddress.lastName}
                  </p>
                  <p>{order.billingAddress.address}</p>
                  <p>
                    {order.billingAddress.city}, {order.billingAddress.state}
                    {" "}
                    {order.billingAddress.zipCode}
                  </p>
                  <p>{order.billingAddress.country}</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Order Not Found State (if API returns null) */}
      {!loading && !error && !order && (
        <div className="text-center py-12">
          <p className="text-xl text-error mb-4">Order not found.</p>
          <Link to="/account/orders" className="btn btn-primary">
            Go to My Orders
          </Link>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
