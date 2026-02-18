import { useEffect, useState } from "react";
import "./Refund.css";
import { toast } from "react-toastify";
import { requestWithFallback } from "../../assets/api";

const Refund = () => {
  const [addAmount, setAddAmount] = useState("");
  const [deleteAmount, setDeleteAmount] = useState("");
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(false); // For Add/Delete/Clear All
  const [loadingId, setLoadingId] = useState(null); // For individual Remove

  const fetchRefunds = async () => {
    try {
      const res = await requestWithFallback("get", "/api/refund/list");
      if (res.data.success) setRefunds(res.data.data);
    } catch {
      toast.error("Failed to fetch refunds");
    }
  };

  const handleAdd = async () => {
    if (!addAmount) return;
    setLoading(true);
    try {
      const res = await requestWithFallback("post", "/api/refund/add", { amount: Number(addAmount) });
      if (res.data.success) {
        toast.success("Amount Added");
        setAddAmount("");
        fetchRefunds();
      }
    } catch {
      toast.error("Failed to add amount");
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!deleteAmount) return;
    setLoading(true);
    try {
      const res = await requestWithFallback("post", "/api/refund/delete", { amount: Number(deleteAmount) });
      if (res.data.success) {
        toast.success("Amount Deleted");
        setDeleteAmount("");
        fetchRefunds();
      }
    } catch {
      toast.error("Failed to delete amount");
    }
    setLoading(false);
  };

  const clearAll = async () => {
    setLoading(true);
    try {
      const res = await requestWithFallback("delete", "/api/refund/clear");
      if (res.data.success) {
        toast.success("All refunds cleared");
        fetchRefunds();
      }
    } catch {
      toast.error("Failed to clear refunds");
    }
    setLoading(false);
  };

  // Remove single refund
  const removeRefund = async (id) => {
    setLoadingId(id);
    try {
      const res = await requestWithFallback("delete", `/api/refund/clear/${id}`);
      if (res.data.success) {
        toast.success("Refund removed");
        fetchRefunds();
      }
    } catch {
      toast.error("Failed to remove refund");
    }
    setLoadingId(null);
  };

  useEffect(() => {
    fetchRefunds();
  }, []);

  return (
    <div className="refund-container">
      <h3>Refund Page</h3>

      <div className="refund-inputs">
        <div className="input-group">
          <input
            type="number"
            placeholder="Add Amount"
            value={addAmount}
            onChange={(e) => setAddAmount(e.target.value)}
          />
          <button onClick={handleAdd} disabled={loading}>
            {loading ? "Processing..." : "Add"}
          </button>
        </div>

        <div className="input-group">
          <input
            type="number"
            placeholder="Delete Amount"
            value={deleteAmount}
            onChange={(e) => setDeleteAmount(e.target.value)}
          />
          <button onClick={handleDelete} disabled={loading}>
            {loading ? "Processing..." : "Delete"}
          </button>
        </div>

        <button className="clear-btn" onClick={clearAll} disabled={loading}>
          {loading ? "Clearing..." : "Clear All"}
        </button>
      </div>

      <div className="table-wrapper">
        <table className="refund-table">
          <thead>
            <tr>
              <th>Added Amount</th>
              <th>Deleted Amount</th>
              <th>Added Date & Time</th>
              <th>Deleted Date & Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {refunds.map((r) => (
              <tr key={r._id}>
                <td>{r.addedAmount || "-"}</td>
                <td>{r.deletedAmount || "-"}</td>
                <td>{r.addedAt ? new Date(r.addedAt).toLocaleString() : "-"}</td>
                <td>{r.deletedAt ? new Date(r.deletedAt).toLocaleString() : "-"}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => removeRefund(r._id)}
                    disabled={loadingId === r._id}
                  >
                    {loadingId === r._id ? "Removing..." : "Remove"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Refund;
