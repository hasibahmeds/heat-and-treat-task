import express from "express";
import { addFood, listFood, removeFood, updateFood } from "../controllers/foodController.js"; // ← Added updateFood here
import multer from "multer";

const foodRouter = express.Router();

const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

foodRouter.post("/add", upload.single("image"), (req, res, next) => {
    // This wrapper allows the request to continue even if no file is uploaded
    next();
}, addFood);

foodRouter.get("/list", listFood);
foodRouter.post("/remove", removeFood);

// ← New update route
foodRouter.post("/update", upload.single("image"), (req, res, next) => {
    // Allow continuing even if no file is uploaded (for URL-only updates)
    next();
}, updateFood);

export default foodRouter;