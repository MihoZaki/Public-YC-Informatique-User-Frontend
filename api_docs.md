
---

## **Guest Checkout**

### `POST /api/v1/checkout/guest`

*   **Description:** Allows an unauthenticated user (guest) to place an order using items from their frontend-managed cart session.
*   **Method:** `POST`
*   **Headers:**
    *   `Content-Type: application/json`
    *   `X-Session-ID: <session_identifier>` (A unique identifier for the guest's cart session, managed by the frontend, e.g., using `localStorage` or `sessionStorage`).
*   **Request Body:**
    ```json
    {
      "shipping_address": {
        "full_name": "John Doe",
        "phone_number_1": "+1234567890",
        "phone_number_2": "+0987654321",
        "province": "Lagos",
        "city": "Ikeja",
        "address": "123 Main Street"
      },
      "delivery_service_id": "delivery-service-uuid-string",
      "payment_method": "Cash on Delivery", // Or other supported methods
      "notes": "Leave at front desk if not home."
    }
    ```
    *   `shipping_address`: An object containing the guest's delivery information.
        *   `full_name` (string, required): The name of the person receiving the order.
        *   `phone_number_1` (string, required): Primary contact number.
        *   `phone_number_2` (string, optional): Secondary contact number.
        *   `province` (string, required): The province/state for delivery.
        *   `city` (string, required): The city/town for delivery.
        *   `address` (string, required): The full delivery address.
    *   `delivery_service_id` (string, required): The UUID of the selected delivery service option.
    *   `payment_method` (string, required): The chosen payment method (e.g., "Cash on Delivery").
    *   `notes` (string, optional): Any additional notes for the delivery.
*   **Response:**
    *   **Code:** `201 Created`
    *   **Body:** `application/json`
        ```json
        {
          "order": {
            "id": "order-uuid-string",
            "user_id": null, // Will be null for guest orders
            "user_full_name": "John Doe",
            "status": "pending",
            "total_amount_cents": 150000,
            "payment_method": "Cash on Delivery",
            "province": "Lagos",
            "city": "Ikeja",
            "phone_number_1": "+1234567890",
            "phone_number_2": "+0987654321",
            "delivery_service_id": "delivery-service-uuid-string",
            "notes": "Leave at front desk if not home.",
            "created_at": "2026-02-15T18:30:00Z",
            "updated_at": "2026-02-15T18:30:00Z"
          },
          "items": [
            {
              "id": "order-item-uuid-string",
              "order_id": "order-uuid-string",
              "product_id": "product-uuid-string",
              "product_name": "RTX 4080 Super",
              "price_cents": 100000,
              "quantity": 1,
              "subtotal_cents": 100000,
              "created_at": "2026-02-15T18:30:00Z",
              "updated_at": "2026-02-15T18:30:00Z"
            },
            // ... more items
          ]
        }
        ```
*   **Errors:**
    *   `400 Bad Request`: If the `X-Session-ID` header is missing, the request body contains invalid JSON, or required fields in the request body are missing or invalid.
    *   `409 Conflict`: If stock availability changes between the time the cart was viewed and the order creation attempt, leading to insufficient stock for one or more items.
    *   `500 Internal Server Error`: If there's a general server-side failure during the order creation process (e.g., database transaction failure).

---

## **Cart Bulk Add Items**

### `POST /api/v1/cart/bulk-add`

*   **Description:** Adds multiple items to the authenticated user's cart in a single request. If an item already exists in the cart, its quantity will be increased by the specified amount.
*   **Method:** `POST`
*   **Headers:**
    *   `Content-Type: application/json`
    *   `Authorization: Bearer <access_token>` (A valid JWT access token obtained after login/register).
*   **Request Body:**
    ```json
    {
      "items": [
        {
          "product_id": "product-uuid-string",
          "quantity": 2
        },
        {
          "product_id": "another-product-uuid-string",
          "quantity": 1
        }
        // ... more items
      ]
    }
    ```
    *   `items`: An array of objects, each representing an item to add.
        *   `product_id` (string, required): The UUID of the product to add.
        *   `quantity` (integer, required): The number of units of the product to add. Must be greater than 0.
*   **Response:**
    *   **Code:** `200 OK`
    *   **Body:** `application/json`
        ```json
        {
          "message": "Cart updated successfully",
          "cart_summary": {
            "id": "cart-uuid-string",
            "user_id": "user-uuid-string",
            "items": [
              {
                "id": "cart-item-uuid-string",
                "cart_id": "cart-uuid-string",
                "product_id": "product-uuid-string",
                "quantity": 5, // Quantity after adding 2 to existing 3
                "product_name": "RTX 4080 Super",
                "product_price_cents": 100000,
                "final_price_cents": 95000, // Price after discount if applicable
                "discount_percentage": 5,
                "subtotal_cents": 475000,
                "created_at": "2026-02-15T18:00:00Z",
                "updated_at": "2026-02-15T18:30:00Z"
              },
              {
                "id": "another-cart-item-uuid-string",
                "cart_id": "cart-uuid-string",
                "product_id": "another-product-uuid-string",
                "quantity": 1, // Quantity added
                "product_name": "Intel Core i9-14900K",
                "product_price_cents": 50000,
                "final_price_cents": 50000, // No discount
                "discount_percentage": 0,
                "subtotal_cents": 50000,
                "created_at": "2026-02-15T18:30:00Z",
                "updated_at": "2026-02-15T18:30:00Z"
              }
              // ... other items in the cart
            ],
            "total_items": 2,
            "total_value_cents": 525000,
            "total_discounted_value_cents": 525000
          }
        }
        ```
*   **Errors:**
    *   `400 Bad Request`: If the request body contains invalid JSON, required fields are missing, or the specified `quantity` is less than or equal to 0.
    *   `401 Unauthorized`: If the `Authorization` header is missing or the provided JWT token is invalid or expired.
    *   `404 Not Found`: If one or more of the specified `product_id`s do not exist in the database.
    *   `409 Conflict`: If adding the items would exceed the available stock for one or more of the products.
    *   `500 Internal Server Error`: If there's a general server-side failure during the cart update process.

---
