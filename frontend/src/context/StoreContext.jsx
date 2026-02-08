// import { createContext, useEffect, useState } from "react";
// import axios from "axios";

// export const StoreContext = createContext(null);

// const StoreContextProvider = (props) => {
//   const [cartItems, setCartItems] = useState({});
//   const [userEmail, setUserEmail] = useState("");
//   const url = "http://localhost:4000";
//   const [token, setToken] = useState("");
//   const [food_list, setFoodList] = useState([]);

//   const addToCart = async (itemId) => {
//     if (!cartItems[itemId]) {
//       setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
//     } else {
//       setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
//     }
//     if (token) {
//       await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
//     }
//   };

//   const removeFromCart = async (itemId) => {
//     setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
//     if (token) {
//       await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
//     }
//   };

//   const getTotalCartAmount = () => {
//     let totalAmount = 0;
//     for (const item in cartItems) {
//       if (cartItems[item] > 0) {
//         const itemInfo = food_list.find((product) => product._id === item);
//         if (itemInfo) {
//           totalAmount += itemInfo.price * cartItems[item];
//         }
//       }
//     }
//     return totalAmount;
//   };

//   const fetchFoodList = async () => {
//     const response = await axios.get(url + "/api/food/list");
//     setFoodList(response.data.data);
//   };

//   const loadCartData = async (token) => {
//     const response = await axios.post(url + "/api/cart/get", {}, { headers: { token } });
//     setCartItems(response.data.cartData);
//   };

//   useEffect(() => {
//     async function loadData() {
//       await fetchFoodList();

//       if (localStorage.getItem("token")) {
//         const savedToken = localStorage.getItem("token");
//         const savedEmail = localStorage.getItem("userEmail"); // ← Restore email

//         setToken(savedToken);
//         if (savedEmail) {
//           setUserEmail(savedEmail);
//         }

//         await loadCartData(savedToken);
//       }
//     }
//     loadData();
//   }, []);

//   const contextValue = {
//     food_list,
//     cartItems,
//     setCartItems,
//     addToCart,
//     removeFromCart,
//     getTotalCartAmount,
//     url,
//     token,
//     setToken,
//     userEmail,
//     setUserEmail
//   };

//   return (
//     <StoreContext.Provider value={contextValue}>
//       {props.children}
//     </StoreContext.Provider>
//   );
// };

// export default StoreContextProvider;







import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [userEmail, setUserEmail] = useState("");
  // Use Vite env var `VITE_API_URL` when available.
  // - In local dev: fall back to localhost:4000
  // - In deployed env without VITE_API_URL: fall back to current origin (assumes backend is same host)
  const url = import.meta.env.VITE_API_URL ?? (window.location.hostname === "localhost" ? "http://localhost:4000" : window.location.origin);

  if (!import.meta.env.VITE_API_URL && window.location.hostname !== "localhost") {
    // Helpful warning for deployed builds where the env var wasn't provided
    // The preferred fix is to set `VITE_API_URL` in Render (or your hosting) to the backend URL.
    // Example: https://your-backend.onrender.com
    console.warn("VITE_API_URL not set — using ", window.location.origin, " as API base. Set VITE_API_URL in Render environment variables to your backend URL for cross-origin requests.");
  }

  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);

  const addToCart = async (itemId) => {
    setCartItems((prev) => {
      const current = prev[itemId] || 0;
      return { ...prev, [itemId]: current + 1 };
    });
    if (token) {
      await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      const current = prev[itemId] || 0;
      if (current <= 1) {
        const { [itemId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [itemId]: current - 1 };
    });
    if (token) {
      await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const itemInfo = food_list.find((product) => product._id === item);
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  const fetchFoodList = async () => {
    const response = await axios.get(url + "/api/food/list");
    setFoodList(response.data.data);
  };

  const loadCartData = async (token) => {
    const response = await axios.post(url + "/api/cart/get", {}, { headers: { token } });
    // Added fallback to empty object to prevent "undefined" error
    setCartItems(response.data.cartData || {}); 
  };

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();

      if (localStorage.getItem("token")) {
        const savedToken = localStorage.getItem("token");
        const savedEmail = localStorage.getItem("userEmail");

        setToken(savedToken);
        if (savedEmail) {
          setUserEmail(savedEmail);
        }

        await loadCartData(savedToken);
      }
    }
    loadData();
  }, []);

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
    userEmail,
    setUserEmail
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
