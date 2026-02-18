import { useEffect, useState } from "react";
import "./Refund.css";
import { toast } from "react-toastify";
import { requestWithFallback } from "../../assets/api";

const Refund = () => {

  const [addAmount, setAddAmount] = useState("");
  const [deleteAmount, setDeleteAmount] = useState("");
  const [refunds, setRefunds] = useState([]);

  const fetchRefunds = async () => {
    const res = await requestWithFallback("get", "/api/refund/list");
    if (res.data.success) setRefunds(res.data.data);
  };

  const handleAdd = async () => {
    if (!addAmount) return;
    const res = await requestWithFallback("post", "/api/refund/add", { amount: Number(addAmount) });
    if (res.data.success) {
      toast.success("Amount Added");
      setAddAmount("");
      fetchRefunds();
    }
  };

  const handleDelete = async () => {
    if (!deleteAmount) return;
    const res = await requestWithFallback("post", "/api/refund/delete", { amount: Number(deleteAmount) });
    if (res.data.success) {
      toast.success("Amount Deleted");
      setDeleteAmount("");
      fetchRefunds();
    }
  };

  const clearAll = async () => {
    const res = await requestWithFallback("delete", "/api/refund/clear");
    if (res.data.success) {
      toast.success("Refund data cleared");
      fetchRefunds();
    }
  };

  useEffect(() => {
    fetchRefunds();
  }, []);

  return (
    <div className="refund add">
      <h3>Refund Page</h3>

      <div className="refund-inputs">
        <div>
          <input
            type="number"
            placeholder="Add Amount"
            value={addAmount}
            onChange={(e) => setAddAmount(e.target.value)}
          />
          <button onClick={handleAdd}>Add</button>
        </div>

        <div>
          <input
            type="number"
            placeholder="Delete Amount"
            value={deleteAmount}
            onChange={(e) => setDeleteAmount(e.target.value)}
          />
          <button onClick={handleDelete}>Delete</button>
        </div>

        <button className="clear-btn" onClick={clearAll}>Clear All</button>
      </div>

      <table className="refund-table">
        <thead>
          <tr>
            <th>Added Amount</th>
            <th>Deleted Amount</th>
            <th>Added Date & Time</th>
            <th>Deleted Date & Time</th>
          </tr>
        </thead>
        <tbody>
          {refunds.map((r, index) => (
            <tr key={index}>
              <td>{r.addedAmount || "-"}</td>
              <td>{r.deletedAmount || "-"}</td>
              <td>{r.addedAt ? new Date(r.addedAt).toLocaleString() : "-"}</td>
              <td>{r.deletedAt ? new Date(r.deletedAt).toLocaleString() : "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Refund;
