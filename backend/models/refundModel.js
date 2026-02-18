import mongoose from "mongoose";

const refundSchema = new mongoose.Schema({
  addedAmount: { type: Number, default: 0 },
  deletedAmount: { type: Number, default: 0 },
  addedAt: { type: Date },
  deletedAt: { type: Date }
}, { timestamps: true });

const refundModel = mongoose.models.refund || mongoose.model("refund", refundSchema);

export default refundModel;
