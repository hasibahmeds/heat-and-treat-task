// import { useEffect, useState } from 'react'
// import './List.css'
// import axios from "axios"
// import {toast} from "react-toastify"

// const List = ({url}) => {

//   // const url = "http://localhost:4000"
//   const [list,setList] = useState([]);

//   const fetchList = async () => {
//   const response = await axios.get(`${url}/api/food/list`);
//   // console.log(response.data);
  
//       if (response.data.success) {
//         setList(response.data.data);
//       }
//        else 
//       {
//          toast.error("Error")

//       }
//   }


//   const removeFood = async(foodId) => {
//       // console.log(foodId);
//       const response = await axios.post(`${url}/api/food/remove`,{id:foodId})
//       await fetchList();
//       if (response.data.success) {
//         toast.success(response.data.message)
//       } 
//       else {
//         toast.error("Error")
//       }
      
//   }

//   useEffect(()=>{
//     fetchList();
//   },[])
//   return (
//     <div className='list add flex-col'>
//       <p>All Foods List</p>
//         <div className="list-table">
//           <div className="list-table-format title">
//             <b>Image</b>
//             <b>Name</b>
//             <b>Category</b>
//             <b>Price</b>
//             <b>Action</b>
//           </div>
//           {list.map((item,index)=>{
//             return (
//               <div key={index} className='list-table-format'>
//                   <img src={`${url}/images/`+item.image} alt="" />
//                   <p>{item.name}</p>
//                   <p>{item.category}</p>
//                   <p>{item.price} TK</p>
//                   <p onClick={()=>removeFood(item._id)} className='cursor'>X</p>
                  
//               </div>
//             )
//           })}
//         </div>
//     </div>
//   )
// }

// export default List

























//Gpie//

// import { useEffect, useState } from 'react';
// import './List.css';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// const List = ({ url = 'http://localhost:4000' }) => {
//   const [list, setList] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const fetchList = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`${url}/api/food/list`);
//       if (response.data && response.data.success) {
//         setList(response.data.data || []);
//       } else {
//         toast.error(response.data?.message || 'Failed to load list');
//       }
//     } catch (err) {
//       toast.error(err?.response?.data?.message || 'Network error while fetching list');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const removeFood = async (foodId) => {
//     try {
//       const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
//       if (response.data && response.data.success) {
//         toast.success(response.data.message || 'Item removed');
//         await fetchList();
//       } else {
//         toast.error(response.data?.message || 'Error removing item');
//       }
//     } catch (err) {
//       toast.error(err?.response?.data?.message || 'Network error while removing item');
//     }
//   };

//   useEffect(() => {
//     fetchList();
//   }, []);

//   return (
//     <div className="list add flex-col">
//       <p className='Para'>All Foods List</p>
//       <div className="list-table">
//         <div className="list-table-format title">
//           <b>Image</b>
//           <b>Name</b>
//           <b>Category</b>
//           <b>Price</b>
//           <b>Action</b>
//         </div>

//         {loading && <div className="list-loading">Loading...</div>}
//         {!loading && list.length === 0 && <div className="list-empty">No items found</div>}

//         {!loading &&
//           list.map((item) => (
//             <div key={item._id} className="list-table-format">
//               <img src={`${url}/images/${item.image}`} alt={`${item.name} image`} />
//               <p className="cell-name">{item.name}</p>
//               <p className="cell-category">{item.category}</p>
//               <p className="cell-price">{item.price} TK</p>
//               <button
//                 type="button"
//                 onClick={() => removeFood(item._id)}
//                 className="cell-action cursor"
//                 aria-label={`Remove ${item.name}`}
//                 title={`Remove ${item.name}`}
//               >
//                 X
//               </button>
//             </div>
//           ))}
//       </div>
//     </div>
//   );
// };

// export default List;






















// import { useEffect, useState } from 'react';
// import './List.css';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// const List = ({ url = 'http://localhost:4000' }) => {
//   const [list, setList] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const fetchList = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`${url}/api/food/list`);
//       if (response.data && response.data.success) {
//         setList(response.data.data || []);
//       } else {
//         toast.error(response.data?.message || 'Failed to load list');
//       }
//     } catch (err) {
//       toast.error(err?.response?.data?.message || 'Network error while fetching list');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const removeFood = async (foodId) => {
//     try {
//       const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
//       if (response.data && response.data.success) {
//         toast.success(response.data.message || 'Item removed');
//         await fetchList();
//       } else {
//         toast.error(response.data?.message || 'Error removing item');
//       }
//     } catch (err) {
//       toast.error(err?.response?.data?.message || 'Network error while removing item');
//     }
//   };

//   useEffect(() => {
//     fetchList();
//   }, []);

//   return (
//     <div className="list add flex-col">
//       <div className="list-table">
//       <p className='Para'>All Foods List</p>
//         {/* Table Header */}
//         <div className="list-table-format title">
//           <b>#</b>
//           <b>Image</b>
//           <b>Name</b>
//           <b>Category</b>
//           <b>Price</b>
//           <b>Action</b>
//         </div>

//         {/* Loading & Empty States */}
//         {loading && <div className="list-loading">Loading...</div>}
//         {!loading && list.length === 0 && <div className="list-empty">No items found</div>}

//         {/* List Items with Index */}
//         {!loading &&
//           list.map((item, index) => (
//             <div key={item._id} className="list-table-format">
//               <p className="cell-index">{index + 1}</p>
//               <img src={`${url}/images/${item.image}`} alt={`${item.name} image`} />
//               <p className="cell-name">{item.name}</p>
//               <p className="cell-category">{item.category}</p>
//               <p className="cell-price">{item.price} TK</p>
//               <button
//                 type="button"
//                 onClick={() => removeFood(item._id)}
//                 className="cell-action cursor"
//                 aria-label={`Remove ${item.name}`}
//                 title={`Remove ${item.name}`}
//               >
//                 X
//               </button>
//             </div>
//           ))}
//       </div>
//     </div>
//   );
// };

// export default List;









import { useEffect, useState } from 'react';
import './List.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const List = ({ url = 'http://localhost:4000' }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editItem, setEditItem] = useState(null); 
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
  });
  const [imageFile, setImageFile] = useState(null);

  const fetchList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data && response.data.success) {
        setList(response.data.data || []);
      } else {
        toast.error(response.data?.message || 'Failed to load list');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Network error while fetching list');
    } finally {
      setLoading(false);
    }
  };

  // const removeFood = async (foodId) => {
  //   try {
  //     const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
  //     if (response.data && response.data.success) {
  //       toast.success(response.data.message || 'Item removed');
  //       await fetchList();
  //     } else {
  //       toast.error(response.data?.message || 'Error removing item');
  //     }
  //   } catch (err) {
  //     toast.error(err?.response?.data?.message || 'Network error while removing item');
  //   }
  // };


const removeFood = async (foodId) => {
    // Added confirmation alert
    if (window.confirm("Are you sure you want to remove this item?")) {
      try {
        const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
        if (response.data && response.data.success) {
          toast.success(response.data.message || 'Item removed');
          await fetchList();
        } else {
          toast.error(response.data?.message || 'Error removing item');
        }
      } catch (err) {
        toast.error(err?.response?.data?.message || 'Network error while removing item');
      }
    }
  };


  const startEdit = (item) => {
    setEditItem(item._id);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      imageUrl: item.image.startsWith('http') ? item.image : '',
    });
    setImageFile(null);
  };

  const cancelEdit = () => {
    setEditItem(null);
    setFormData({ name: '', description: '', price: '', category: '', imageUrl: '' });
    setImageFile(null);
  };

  const saveUpdate = async () => {
    if (!editItem) return;

    const data = new FormData();
    data.append('id', editItem);
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('category', formData.category);
    if (formData.imageUrl) {
      data.append('imageUrl', formData.imageUrl);
    }
    if (imageFile) {
      data.append('image', imageFile);
    }

    try {
      const response = await axios.post(`${url}/api/food/update`, data);
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
        cancelEdit();
      } else {
        toast.error(response.data.message || 'Update failed');
      }
    } catch (err) {
      toast.error('Error updating item');
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="list add flex-col">
      <div className="list-table">
        <p className='Para'>All Foods List</p>
        
        <div className="list-table-format title">
          <b>#</b>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>

        {loading && <div className="list-loading">Loading...</div>}
        {!loading && list.length === 0 && <div className="list-empty">No items found</div>}

        {!loading &&
          list.map((item, index) => (
            <div key={item._id} className="list-table-format">
              <p className="cell-index">{index + 1}</p>

              <img
                src={item.image.startsWith("http") ? item.image : `${url}/images/${item.image}`}
                alt={`${item.name} image`}
              />

              {editItem === item._id ? (
                <>
                  <textarea
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="edit-input cell-name"
                    placeholder="Name"
                    rows="1"
                  />
                  
                  {/* Category Dropdown */}
                  <select 
                    value={formData.category} 
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="edit-input cell-category"
                  >
                    <option value="Deep Fried">Deep Fried</option>
                    <option value="Crispy Fried Wings">Crispy Fried Wings</option>
                    <option value="Juicy Wings">Juicy Wings</option>
                    <option value="Savory">Savory</option>
                    <option value="Rice Bowls">Rice Bowls</option>
                    <option value="Add Ons">Add Ons</option>
                    <option value="Coffee">Coffee</option>
                  </select>

                  <textarea
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="edit-input cell-price"
                    placeholder="Price"
                    rows="1"
                  />
                  <div className="edit-actions">
                    <button onClick={saveUpdate} className="save-btn">Save</button>
                    <button onClick={cancelEdit} className="cancel-btn">Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <p className="cell-name">{item.name}</p>
                  <p className="cell-category">{item.category}</p>
                  <p className="cell-price">{item.price} TK</p>
                  <div className="cell-action">
                    <button onClick={() => startEdit(item)} className="edit-btn" title="Edit">
                      ✎
                      {/* ✒️ */}
                    </button>
                    <button
                      onClick={() => removeFood(item._id)}
                      className="cell-action cursor delete-btn"
                      title={`Remove ${item.name}`}
                    >
                      X
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}

        {editItem && (
          <div className="edit-full-row">
            <p>Description:</p>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Description"
              rows="4"
            />
            <p>Image URL (Optional):</p>
            <textarea
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="Or paste Image URL (http...)"
              className="edit-input"
              rows="2"
            />
            <p>Or upload new image:</p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default List;