// src/assets/assets.js
import logo from './logo.png'
import logo_hat from './logo_hat.png'
import add_icon from './add_icon.png'
import order_icon from './order_icon.png'
import profile_image from './profile_image.png'
import upload_area from './upload_area.png'
import upload_areaa from './upload_areaa.jpg'
import parcel_icon from './parcel_icon.png'

export const assets = {
  logo,
  logo_hat,
  add_icon,
  order_icon,
  profile_image,
  upload_area,
  upload_areaa,
  parcel_icon
};

// ────────────────────────────────────────────────
// Automatic backend URL detection — no .env needed
// ────────────────────────────────────────────────
const isLocal = window.location.hostname === "localhost" ||
                window.location.hostname === "127.0.0.1";

export const url = isLocal
  ? 'http://localhost:4000'
  : 'https://heat-and-treat-task-backend.onrender.com';

// Optional: only if you really want fallback logic
export const fallbackUrl = null; // or remove this export completely