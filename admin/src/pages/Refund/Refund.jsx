import { useEffect, useState } from "react";
import "./Refund.css";
import { toast } from "react-toastify";
import { requestWithFallback } from "../../assets/api";

const Refund = () => {

  const [addAmount, setAddAmount] = useState("");
  const [deleteAmount, setDeleteAmount] = useState("");
  const [refunds, setRefunds] = useState([]);

  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingClearAll, setLoadingClearAll] = useState(false);
  const [loadingId, setLoadingId] = useState(null);

  const fetchRefunds = async () => {
    const res = await requestWithFallback("get", "/api/refund/list");
    if (res.data.success) setRefunds(res.data.data);
  };

  const handleAdd = async () => {
    if (!addAmount) return;

    setLoadingAdd(true);
    const res = await requestWithFallback("post", "/api/refund/add", { amount: Number(addAmount) });

    if (res.data.success) {
      toast.success("Amount Added");
      setAddAmount("");
      fetchRefunds();
    }
    setLoadingAdd(false);
  };

  const handleDelete = async () => {
    if (!deleteAmount) return;

    setLoadingDelete(true);
    const res = await requestWithFallback("post", "/api/refund/delete", { amount: Number(deleteAmount) });

    if (res.data.success) {
      toast.success("Amount Deleted");
      setDeleteAmount("");
      fetchRefunds();
    }
    setLoadingDelete(false);
  };

  const clearAll = async () => {
    setLoadingClearAll(true);
    const res = await requestWithFallback("delete", "/api/refund/clear");

    if (res.data.success) {
      toast.success("Refund data cleared");
      fetchRefunds();
    }
    setLoadingClearAll(false);
  };

  const clearSingle = async (id) => {
    setLoadingId(id);
    const res = await requestWithFallback("delete", `/api/refund/clear/${id}`);

    if (res.data.success) {
      toast.success("Refund deleted");
      fetchRefunds();
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
          <button onClick={handleAdd} disabled={loadingAdd}>
            {loadingAdd ? "Adding..." : "Add"}
          </button>
        </div>

        <div className="input-group">
          <input
            type="number"
            placeholder="Delete Amount"
            value={deleteAmount}
            onChange={(e) => setDeleteAmount(e.target.value)}
          />
          <button onClick={handleDelete} disabled={loadingDelete}>
            {loadingDelete ? "Deleting..." : "Delete"}
          </button>
        </div>

        <button
          className="clear-btn"
          onClick={clearAll}
          disabled={loadingClearAll}
        >
          {loadingClearAll ? "Clearing..." : "Clear All"}
        </button>
      </div>

      <div className="table-wrapper">
        <table className="refund-table">
          <thead>
            <tr>
              <th>Added</th>
              <th>Deleted</th>
              <th>Added Time</th>
              <th>Deleted Time</th>
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
    className="action-btn"
    onClick={() => clearSingle(r._id)}
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
