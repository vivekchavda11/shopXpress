import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/orders/user/${userId}`
      );
      setOrders(res.data || []);
    } catch (err) {
      setOrders([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /* ================= STATUS BADGE ================= */
  const getStatusBadge = (status) => {
    switch (status) {
      case "Delivered":
        return "success";
      case "Cancelled":
        return "danger";
      case "Shipped":
        return "info";
      default:
        return "warning";
    }
  };

  /* ================= VIEW ORDER ================= */
  const viewOrder = (order) => {
    Swal.fire({
      title: `Order Details`,
      width: 900,
      html: `
        <div class="text-start">
          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Order Status:</strong> ${order.orderStatus}</p>
          <p><strong>Payment:</strong> ${order.paymentMethod}</p>
          <p><strong>Payment Status:</strong> ${order.paymentStatus}</p>
          <hr />

          ${order.items
            .map(
              (item) => `
              <div class="d-flex align-items-center mb-3">
                <img src="http://localhost:3000${item.image}" width="60" class="rounded me-3"/>
                <div>
                  <div class="fw-semibold">${item.title}</div>
                  <small>Qty: ${item.qty} | ₹ ${item.price}</small>
                </div>
              </div>`
            )
            .join("")}

          <hr />
          <div class="d-flex justify-content-between">
            <span>Subtotal</span><span>₹ ${order.subtotal}</span>
          </div>
          <div class="d-flex justify-content-between">
            <span>Discount</span><span>₹ ${order.discount || 0}</span>
          </div>
          <div class="d-flex justify-content-between fw-bold mt-2">
            <span>Total</span><span>₹ ${order.totalAmount}</span>
          </div>
        </div>
      `,
      showCloseButton: true,
      showConfirmButton: false,
    });
  };

  /* ================= CANCEL ORDER ================= */
  const cancelOrder = async (orderId) => {
    const result = await Swal.fire({
      title: "Cancel Order?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axios.put(`http://localhost:3000/api/orders/cancel/${orderId}`);
        Swal.fire("Cancelled!", "Order cancelled successfully", "success");
        fetchOrders();
      } catch (err) {
        Swal.fire("Error", "Cancellation failed", "error");
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return <div className="text-center mt-5">No orders found</div>;
  }

  /* ================= DOWNLOAD INVOICE ================= */
  const downloadInvoice = (orderId) => {
    window.open(`http://localhost:3000/api/invoice/${orderId}`, "_blank");
  };

  return (
    <div className="container my-5">
      <h3 className="text-center fw-bold mb-4">📦 My Orders</h3>

      <div className="table-responsive">
        <table className="table table-bordered align-middle text-center">
          <thead className="table-dark">
            <tr>
              <th style={{ width: "250px" }}>Order ID</th>
              <th style={{ width: "120px" }}>Date</th>
              <th style={{ width: "80px" }}>Items</th>
              <th style={{ width: "120px" }}>Total</th>
              <th style={{ width: "150px" }}>Status</th>
              <th style={{ width: "150px" }}>Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>

                <td>{new Date(order.createdAt).toLocaleDateString("en-IN")}</td>

                <td>{order.items.length}</td>

                <td className="fw-semibold">
                  ₹ {order.totalAmount.toLocaleString()}
                </td>

                <td>
                  <span
                    className={`badge bg-${getStatusBadge(order.orderStatus)}`}
                  >
                    {order.orderStatus}
                  </span>
                </td>

                <td>
                  <button
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => viewOrder(order)}
                  >
                    View
                  </button>

                  {(order.paymentStatus === "Paid" ||
                    order.paymentMethod === "COD") && (
                    <button
                      className="btn btn-outline-secondary btn-sm me-2"
                      onClick={() => downloadInvoice(order._id)}
                    >
                      Invoice
                    </button>
                  )}

                  {order.orderStatus !== "Cancelled" &&
                    order.orderStatus !== "Delivered" && (
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => cancelOrder(order._id)}
                      >
                        Cancel
                      </button>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderHistory;
