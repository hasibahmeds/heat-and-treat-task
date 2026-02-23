// src/pages/Refund/Refund.jsx
import { useEffect, useState } from "react";
import "./Refund.css";
import { toast } from "react-toastify";
import { requestWithFallback } from "../../assets/api";
import { formatBDTime } from "../../utils/dateUtils";

const Refund = () => {
  const [cancelledOrders, setCancelledOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchCancelledOrders = async () => {
    try {
      const res = await requestWithFallback("get", "/api/order/cancelled");
      if (res.data?.success) {
        setCancelledOrders(res.data.data || []);
      } else {
        toast.error("Failed to load cancelled orders");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleRefundDecision = async (orderId, decision) => {   // "approved" | "rejected"
    if (!["approved", "rejected"].includes(decision)) return;

    if (!window.confirm(`Are you sure you want to ${decision} refund for this order?`)) {
      return;
    }

    setUpdatingId(orderId);
    try {
      const res = await requestWithFallback("patch", `/api/order/${orderId}/refund-status`, {
        refundStatus: decision
      });

      if (res.data?.success) {
        toast.success(`Refund ${decision === "approved" ? "approved" : "rejected"}`);
        fetchCancelledOrders(); // refresh list
      } else {
        toast.error(res.data?.message || "Failed to update");
      }
    } catch (err) {
      toast.error("Error updating refund status");
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    fetchCancelledOrders();
  }, []);

  if (loading) {
    return <div className="refund-container">Loading cancelled orders...</div>;
  }

  return (
    <div className="refund-container">
      <h3>Cancelled Orders – Refund Approval</h3>

      {cancelledOrders.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: "3rem", color: "#888" }}>
          No cancelled orders pending refund decision.
        </p>
      ) : (
        <div className="refund-list">
          {cancelledOrders.map((order) => (
            <div key={order._id} className="refund-card">
              <div className="refund-card-header">
                {/* <p className="order-id">Order #{order._id.slice(-8)}</p> */}
                <p className="order-id">Order Id: {order._id.slice(-8)}</p>
                <p className="order-date">{formatBDTime(order.date)}</p>
              </div>

              <div className="refund-card-body">
                <p>
                  <strong>Customer:</strong> {order.address?.firstName || ""}{" "}
                  {order.address?.lastName || ""} • {order.address?.phone || "—"}
                </p>
                <p>
                  <strong>Amount:</strong> {order.amount} TK
                </p>
                <p>
                  <strong>Items:</strong>{" "}
                  {order.items.map(i => `${i.name} ×${i.quantity}`).join(", ")}
                </p>
                <p>
                  <strong>Delivery Area:</strong> {order.address?.deliveryArea || "—"}
                </p>

                <div className="refund-decision">
                  <label>
                    <input
                      type="radio"
                      name={`refund-${order._id}`}
                      checked={order.refundStatus === "approved"}
                      onChange={() => handleRefundDecision(order._id, "approved")}
                      disabled={updatingId === order._id || order.refundStatus !== "pending"}
                    />
                    Approve Refund (subtract from revenue)
                  </label>

                  <label>
                    <input
                      type="radio"
                      name={`refund-${order._id}`}
                      checked={order.refundStatus === "rejected"}
                      onChange={() => handleRefundDecision(order._id, "rejected")}
                      disabled={updatingId === order._id || order.refundStatus !== "pending"}
                    />
                    Reject Refund (keep in revenue)
                  </label>
                </div>

                {order.refundStatus !== "pending" && (
                  <p className={`refund-status ${order.refundStatus}`}>
                    {order.refundStatus === "approved" ? "Refund Approved" : "Refund Rejected"}
                    {order.refundDecisionAt && ` • ${new Date(order.refundDecisionAt).toLocaleString()}`}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Refund;