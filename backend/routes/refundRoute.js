import express from "express";
import {
  addRefundAmount,
  deleteRefundAmount,
  getRefunds,
  clearRefunds
} from "../controllers/refundController.js";

const refundRouter = express.Router();

refundRouter.post("/add", addRefundAmount);
refundRouter.post("/delete", deleteRefundAmount);
refundRouter.get("/list", getRefunds);
refundRouter.delete("/clear", clearRefunds);
refundRouter.delete("/clear/:id", clearSingleRefund);


export default refundRouter;
