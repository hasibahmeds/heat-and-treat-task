import { useEffect, useState } from "react";
import "./Refund.css";
import { toast } from "react-toastify";
import { requestWithFallback } from "../../assets/api";

const Refund = () => {
  const [addAmount, setAddAmount] = useState("");
  const [deleteAmount, setDeleteAmount] = useState("");
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingId, setLoadingId] = useState(null);

  const fetchRefunds = async () => {
    try {
      const res = await requestWithFallback("get", "/api/refund/list");
      if (res.data?.success) {
        setRefunds(res.data.data || []);
      } else {
        toast.error("Failed to load refund records");
      }
    } catch (err) {
      toast.error("Network error while loading refunds");
    }
  };

  const handleAdd = async () => {
    if (!addAmount || isNaN(addAmount) || Number(addAmount) <= 0) return;
    setLoading(true);
    try {
      const res = await requestWithFallback("post", "/api/refund/add", {
        amount: Number(addAmount),
      });
      if (res.data?.success) {
        toast.success("Amount added successfully");
        setAddAmount("");
        fetchRefunds();
      }
    } catch {
      toast.error("Failed to add refund amount");
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!deleteAmount || isNaN(deleteAmount) || Number(deleteAmount) <= 0) return;
    setLoading(true);
    try {
      const res = await requestWithFallback("post", "/api/refund/delete", {
        amount: Number(deleteAmount),
      });
      if (res.data?.success) {
        toast.success("Amount removed successfully");
        setDeleteAmount("");
        fetchRefunds();
      }
    } catch {
      toast.error("Failed to delete refund amount");
    }
    setLoading(false);
  };

  const clearAll = async () => {
    if (!window.confirm("Clear ALL refund records? This cannot be undone.")) return;
    setLoading(true);
    try {
      const res = await requestWithFallback("delete", "/api/refund/clear");
      if (res.data?.success) {
        toast.success("All refund records cleared");
        fetchRefunds();
      }
    } catch {
      toast.error("Failed to clear refunds");
    }
    setLoading(false);
  };

  const removeRefund = async (id) => {
    if (!window.confirm("Remove this refund entry?")) return;
    setLoadingId(id);
    try {
      const res = await requestWithFallback("delete", `/api/refund/remove/${id}`);
      if (res.data?.success) {
        toast.success("Refund entry removed");
        fetchRefunds();
      } else {
        toast.error(res.data?.message || "Failed to remove");
      }
    } catch {
      toast.error("Network error");
    }
    setLoadingId(null);
  };

  useEffect(() => {
    fetchRefunds();
  }, []);

  return (
    <div className="refund-container">
      <h3>Refund / Adjustment Management</h3>

      <div className="refund-inputs">
        <div className="input-group">
          <input
            type="number"
            placeholder="Add amount (positive)"
            value={addAmount}
            onChange={(e) => setAddAmount(e.target.value)}
            min="1"
          />
          <button onClick={handleAdd} disabled={loading}>
            {loading ? "..." : "Add"}
          </button>
        </div>

        <div className="input-group">
          <input
            type="number"
            placeholder="Subtract amount (positive)"
            value={deleteAmount}
            onChange={(e) => setDeleteAmount(e.target.value)}
            min="1"
          />
          <button onClick={handleDelete} disabled={loading}>
            {loading ? "..." : "Subtract"}
          </button>
        </div>

        <button className="clear-btn" onClick={clearAll} disabled={loading || refunds.length === 0}>
          {loading ? "..." : "Clear All"}
        </button>
      </div>

      {refunds.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: "2rem", color: "#888" }}>
          No refund/adjustment records yet.
        </p>
      ) : (
        <div className="table-wrapper">
          <table className="refund-table">
            <thead>
              <tr>
                <th>Added (+)</th>
                <th>Deleted (-)</th>
                <th>Added At</th>
                <th>Deleted At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {refunds.map((r) => (
                <tr key={r._id}>
                  <td>{r.addedAmount > 0 ? `+${r.addedAmount}` : "-"}</td>
                  <td>{r.deletedAmount > 0 ? `-${r.deletedAmount}` : "-"}</td>
                  <td>{r.addedAt ? new Date(r.addedAt).toLocaleString() : "-"}</td>
                  <td>{r.deletedAt ? new Date(r.deletedAt).toLocaleString() : "-"}</td>
                  <td>
                    <button
                      onClick={() => removeRefund(r._id)}
                      disabled={loadingId === r._id}
                      className="remove-btn"
                    >
                      {loadingId === r._id ? "..." : "Remove"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Refund;