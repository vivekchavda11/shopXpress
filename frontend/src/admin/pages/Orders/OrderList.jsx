import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import "./orderList.css";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const location = useLocation();

  /* ================= FETCH ALL ORDERS ================= */
  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/orders/admin");
      setOrders(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  /* 🔄 FETCH WHEN PAGE IS OPENED */
  useEffect(() => {
    fetchOrders();
  }, [location.pathname]);

  /* ================= STATUS BADGE COLOR ================= */
  const getStatusBadge = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-success";
      case "Cancelled":
        return "bg-danger";
      case "Shipped":
        return "bg-warning text-dark";
      default:
        return "bg-warning text-dark";
    }
  };

  /* ================= UPDATE ORDER STATUS ================= */
  const updateStatus = async (orderId, status) => {
    try {
      await axios.put(
        `http://localhost:3000/api/orders/admin/${orderId}/status`,
        { orderStatus: status }
      );

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: `Order status changed to ${status}`,
        timer: 1500,
        showConfirmButton: false,
      });

      fetchOrders();
    } catch (error) {
      console.error(error);
    }
  };

  /* ================= DELETE ORDER ================= */
  const deleteOrder = async (orderId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This order will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3000/api/orders/admin/${orderId}`);
        Swal.fire("Deleted!", "Order has been deleted.", "success");
        fetchOrders();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="container-fluid">
      <h3 className="mb-3">Orders</h3>

      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle w-100">
          <thead className="table-dark">
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th className="text-center">Amount (₹)</th>
              <th className="text-center">Payment Status</th>
              <th className="text-center">Payment Method</th>
              <th className="text-center">Order Status</th>
              <th className="text-center">Date & Time</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center">
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o._id}>
                  {/* ORDER ID */}
                  <td
                    style={{
                      whiteSpace: "nowrap",
                      wordBreak: "break-all",
                      maxWidth: "200px",
                    }}
                  >
                    {o._id}
                  </td>

                  {/* CUSTOMER */}
                  <td>{o.userId?.username || "N/A"}</td>

                  {/* AMOUNT */}
                  <td className="text-center">{o.totalAmount}</td>

                  {/* PAYMENT STATUS */}
                  <td className="text-center">
                    <span style={{width:"100px"}}
                      className={`badge ${
                        o.paymentStatus === "Paid"
                          ? "bg-success"
                          : o.paymentStatus === "Refunded"
                          ? "bg-info text-dark"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {o.paymentStatus || "Pending"}
                    </span>
                  </td>

                  {/* PAYMENT METHOD */}
                  <td className="text-center">{o.paymentMethod || "COD"}</td>

                  {/* ORDER STATUS */}
                  <td className="text-center">
                    <span
                      className={`badge ${getStatusBadge(o.orderStatus)} d-block mb-1`}
                    >
                      {o.orderStatus}
                    </span>

                    <select
                      className="form-select form-select-sm"
                      value={o.orderStatus}
                      onChange={(e) => updateStatus(o._id, e.target.value)}
                    >
                      <option>Placed</option>
                      <option>Shipped</option>
                      <option>Delivered</option>
                      <option>Cancelled</option>
                    </select>
                  </td>

                  {/* DATE */}
                  <td className="text-center">
                    {new Date(o.createdAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </td>

                  {/* ACTIONS */}
                  <td className="text-center">
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => deleteOrder(o._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderList;
