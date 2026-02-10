// src/pages/MyOrders.jsx
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // Import useAuth to get user
import { fetchUserOrders } from "../services/api"; // Import the API function
import { toast } from "sonner"; // Import toast for error messages

const MyOrders = () => {
  const { user } = useAuth(); // Get the authenticated user
  const [orders, setOrders] = useState([]); // State to hold the orders
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for errors
  const [searchParams, setSearchParams] = useSearchParams(); // For pagination

  // Pagination constants
  const ITEMS_PER_PAGE = 10; // Number of orders per page
  const currentPage = parseInt(searchParams.get("page")) || 1; // Get current page from URL params, default to 1

  useEffect(() => {
    const loadOrders = async () => {
      if (!user) {
        // If no user, can't fetch orders
        setError("User not authenticated.");
        setLoading(false);
        return;
      }

      try {
        setError(null); // Reset error state
        setLoading(true); // Set loading state
        const data = await fetchUserOrders(user.id); // Fetch orders for the current user
        setOrders(data); // Update state with fetched orders
      } catch (err) {
        console.error("Error fetching user orders:", err);
        setError(
          err.message || "Failed to load orders. Please try again later.",
        );
        toast.error("Failed to load orders. Please try again later.");
      } finally {
        setLoading(false); // Always stop loading
      }
    };

    loadOrders();
  }, [user]); // Depend on user.id to refetch if user changes

  // Calculate pagination details
  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedOrders = orders.slice(startIndex, endIndex);

  // Handler for changing pages
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setSearchParams({ page: page.toString() }); // Update URL param
    }
  };

  // Generate page number buttons
  const renderPageNumbers = () => {
    const pageButtons = [];
    const maxVisiblePages = 5; // Maximum number of page buttons to show at once

    let startPage = Math.max(
      1,
      currentPage - Math.floor(maxVisiblePages / 2),
    );
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust startPage if the range is too small
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`btn btn-sm mx-1 ${
            currentPage === i ? "btn-primary" : "btn-ghost"
          }`}
        >
          {i}
        </button>,
      );
    }

    return pageButtons;
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-inherit min-h-screen">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {/* Back Button */}
      <div className="mb-6">
        <Link to="/account" className="btn btn-sm btn-ghost">
          &larr; Back to Account
        </Link>
      </div>

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

      {/* Orders List */}
      {!loading && !error && (
        <>
          {orders.length === 0
            ? (
              <div className="text-center py-12">
                <p className="text-lg">You have no orders yet.</p>
                <Link to="/" className="btn btn-primary mt-4">
                  Start Shopping
                </Link>
              </div>
            )
            : (
              <>
                {/* Pagination Controls Above Table */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mb-4">
                    <button
                      className="btn btn-sm btn-ghost"
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                    <div className="flex items-center">
                      {renderPageNumbers()}
                    </div>
                    <button
                      className="btn btn-sm btn-ghost"
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </div>
                )}

                {/* Orders Table */}
                <div className="card bg-base-100 shadow-lg border border-secondary-content">
                  <div className="card-body p-0">
                    <div className="overflow-x-auto">
                      <table className="table">
                        <thead>
                          <tr>
                            <th className="font-bold">Order #</th>
                            <th className="font-bold">Date</th>
                            <th className="font-bold">Status</th>
                            <th className="font-bold">Total</th>
                            <th className="font-bold">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedOrders.map((order) => (
                            <tr key={order.id}>
                              <td>{order.id}</td>
                              <td>
                                {new Date(order.createdAt).toLocaleDateString()}
                              </td>{" "}
                              {/* Format date */}
                              <td>
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
                                    order.status.slice(1)}{" "}
                                  {/* Capitalize status */}
                                </span>
                              </td>
                              <td>DZD {order.totalAmount.toFixed(2)}</td>{" "}
                              {/* Format total */}
                              <td>
                                <Link
                                  to={`/account/order/${order.id}`} // Link to order details page
                                  className="btn btn-xs btn-outline"
                                >
                                  View Details
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Pagination Controls Below Table */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <button
                      className="btn btn-sm btn-ghost"
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                    <div className="flex items-center">
                      {renderPageNumbers()}
                    </div>
                    <button
                      className="btn btn-sm btn-ghost"
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
        </>
      )}
    </div>
  );
};

export default MyOrders;
