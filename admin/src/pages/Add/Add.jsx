// import { useState } from 'react'
// import { assets } from '../../assets/assets'
// import './Add.css'
// import axios from 'axios'
// import { toast } from 'react-toastify'
// const Add = ({url}) => {
  // const url = "http://localhost:4000";        last time chillona 
  // const [image, setImage] = useState(false);
  // const [data,setData] = useState({
  //     name:"",
  //     description:"",
  //     price:"",
  //     category:"Deeply Fried"
  // })
  // const onChangeHandler = (event) => {
  //     const name = event.target.name;
  //     const value = event.target.value;
  //     setData(data=>({...data,[name]:value}))
  // }
  // const onSubmitHandler = async (event) => {
  //     event.preventDefault();
  //     const formData = new FormData();
  //     formData.append("name",data.name)
  //     formData.append("description",data.description)
  //     formData.append("price",Number(data.price))
  //     formData.append("category",data.category)
  //     formData.append("image",image)
  //     const response = await axios.post(`${url}/api/food/add`,formData);
  //     if (response.data.success) {
  //         setData({
  //     name:"",
  //     description:"",
  //     price:"",
  //     category:"Deeply Fried"
  // })
  // setImage(false)
  // toast.success(response.data.message)
  //     }
  //     else {
  //       toast.error(response.data.message)
  //     }
  // }
  // useEffect(()=>{                {last time chilona 43-45}
  // console.log(data);
  // },[data])
//   return (
//     <div className='add'>
//       <form className='flex-col' onSubmit={onSubmitHandler}>
//         <div className="add-img-upload flex-col">
//           <p>Upload Image</p>
//           <label htmlFor="image">
//             <img src={image?URL.createObjectURL(image):assets.upload_areaa} alt="" />
//           </label>
//           <input onChange={(e)=>setImage(e.target.files[0])} type='file' id='image' hidden required/>
//         </div>
//         <div className="add-product-name flex-col">
//           <p>Product name</p>
//           <input onChange={onChangeHandler} value={data.name} type='text' name='name'placeholder='Type here'/>
//         </div>
//         <div className="add-product-description flex-col">
//           <p>Product description</p>
//           <textarea onChange={onChangeHandler} value={data.description} name='description' rows='6' placeholder='Write content here' required></textarea>
//         </div>
//         <div className="add-category-price">
//           <div className="add-category flex-col">
//               <p>Product category</p>
//               <select onChange={onChangeHandler} name='category'>
//                 <option value="Deeply Fried">Deeply Fried</option>
//                 <option value="Whole Meat">Whole Meat</option>
//                 <option value="Stomach Fillers">Stomach Fillers</option>
//                 <option value="Hat Specials">Hat Specials</option>
//                 <option value="Add Ons">Add Ons</option>
//                 <option value="Hottie Drinks">Hottie Drinks</option>
//                 <option value="Icy Drinks">Icy Drinks</option>
//                 <option value="Icy Shakes">Icy Shakes</option>
//               </select>
//           </div>
//           <div className="add-price flex-col">
//              <p>Product price</p>
//              <input onChange={onChangeHandler} value={data.price} type='Number' name='price' placeholder='TK' />
//           </div>
//         </div>
//         <button type='submit' className='add-btn'>ADD</button>
//       </form>
//     </div>
//   )
// }
// export default Add

















// import { useState } from "react";
// import { assets } from "../../assets/assets";
// import "./Add.css";
// import axios from "axios";
// import { toast } from "react-toastify";

// const Add = ({ url }) => {
//   const [image, setImage] = useState(false);
//   const [data, setData] = useState({
//     name: "",
//     description: "",
//     price: "",
//     category: "Deep Fried",
//   });

//   const onChangeHandler = (event) => {
//     const name = event.target.name;
//     const value = event.target.value;
//     setData((data) => ({ ...data, [name]: value }));
//   };

//   const onSubmitHandler = async (event) => {
//     event.preventDefault();
//     const formData = new FormData();
//     formData.append("name", data.name);
//     formData.append("description", data.description);
//     formData.append("price", Number(data.price));
//     formData.append("category", data.category);
//     formData.append("image", image);
//     const response = await axios.post(`${url}/api/food/add`, formData);
//     if (response.data.success) {
//       setData({
//         name: "",
//         description: "",
//         price: "",
//         category: "Deep Fried",
//       });
//       setImage(false);
//       toast.success(response.data.message);
//     } else {
//       toast.error(response.data.message);
//     }
//   };

//   return (
//     <div className="add">
//       <form className="flex-col" onSubmit={onSubmitHandler}>
//         <div className="add-img-upload flex-col">
//           <p>Upload Image</p>
//           <label htmlFor="image">
//             <img
//               src={image ? URL.createObjectURL(image) : assets.upload_areaa}
//               alt=""
//             />
//           </label>
//           <input
//             onChange={(e) => setImage(e.target.files[0])}
//             type="file"
//             id="image"
//             hidden
//             required
//           />
//         </div>
//         <div className="add-product-name flex-col">
//           <p>Product name</p>
//           <textarea                         /*input past = textarea*/
//             onChange={onChangeHandler}
//             value={data.name}
//             type="text"
//             name="name"
//                         rows="1" // Starting with 3 rows
//             placeholder="Type here"
//             required

//               style={{
//               resize: "vertical", // Allows only vertical resize
//               minHeight: "40px", // Optional: minimum height
//               overflowY: "auto", // Shows scrollbar only if needed
//             }}
//           />
//         </div>
//         <div className="add-product-description flex-col">
//           <p>Product description</p>
//           <textarea
//             onChange={onChangeHandler}
//             value={data.description}
//             name="description"
//             rows="1" // Starting with 3 rows
//             placeholder="Write content here"
//             required
//             style={{
//               resize: "vertical", // Allows only vertical resize
//               minHeight: "90px", // Optional: minimum height
//               overflowY: "auto", // Shows scrollbar only if needed
//             }}
//           />
//         </div>
//         <div className="add-category-price">
//           <div className="add-category flex-col">
//             <p>Product category</p>
//             <select onChange={onChangeHandler} name="category">
//               <option value="Deep Fried">Deep Fried</option>
//               <option value="Crispy Fried Wings">Crispy Fried Wings</option>
//               <option value="Juicy Wings">Juicy Wings</option>
//               <option value="Savory">Savory</option>
//               <option value="Rice Bowls">Rice Bowls</option>
//               <option value="Add Ons">Add Ons</option>
//               <option value="Coffee">Coffee</option>
//             </select>
//           </div>
//           <div className="add-price flex-col">
//             <p>Product price</p>
//             <input
//               onChange={onChangeHandler}
//               value={data.price}
//               type="Number"
//               name="price"
//               placeholder="TK"
//             />
//           </div>
//         </div>
//         <button type="submit" className="add-btn">
//           ADD
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Add;







import { useState } from "react";
import { assets } from "../../assets/assets";
import "./Add.css";
import axios from "axios";
import { toast } from "react-toastify";

const Add = ({ url }) => {
  const [image, setImage] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageType, setImageType] = useState("file"); // 'file' or 'url'

  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Deep Fried",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    
    // Logic to send either file or URL
    if (imageType === "file" && image) {
      formData.append("image", image);
    } else {
      formData.append("imageUrl", imageUrl);
    }

    const response = await axios.post(`${url}/api/food/add`, formData);
    if (response.data.success) {
      setData({
        name: "",
        description: "",
        price: "",
        category: "Deep Fried",
      });
      setImage(false);
      setImageUrl("");
      toast.success(response.data.message);
    } else {
      toast.error(response.data.message);
    }
  };

  return (
    <div className="add">
      <form className="flex-col" onSubmit={onSubmitHandler}>
        <div className="add-img-upload flex-col">
          <p>Upload Image</p>
          
          <div className="image-source-selector" style={{display:'flex', gap:'10px', marginBottom:'10px'}}>
             <label><input type="radio" checked={imageType === 'file'} onChange={()=>setImageType('file')} /> File</label>
             <label><input type="radio" checked={imageType === 'url'} onChange={()=>setImageType('url')} /> URL</label>
          </div>

          {imageType === "file" ? (
            <>
              <label htmlFor="image">
                <img
                  src={image ? URL.createObjectURL(image) : assets.upload_areaa}
                  alt=""
                />
              </label>
              <input
                onChange={(e) => setImage(e.target.files[0])}
                type="file"
                id="image"
                hidden
                required={imageType === "file"}
              />
            </>
          ) : (
            <input 
              className="url-input"
              type="text" 
              placeholder="Paste image URL here" 
              value={imageUrl}
              onChange={(e)=>setImageUrl(e.target.value)}
              required={imageType === "url"}
              // style={{padding: '10px', background: 'rgb(61, 61, 61)', color: 'white', borderRadius: '6px', border: 'none', width: 'max(40%, 200px)'}}
            />
          )}
        </div>
        
        <div className="add-product-name flex-col">
          <p>Product name</p>
          <textarea
            onChange={onChangeHandler}
            value={data.name}
            name="name"
            rows="1"
            placeholder="Type here"
            required
            style={{ resize: "vertical", minHeight: "40px", overflowY: "auto" }}
          />
        </div>
        <div className="add-product-description flex-col">
          <p>Product description</p>
          <textarea
            onChange={onChangeHandler}
            value={data.description}
            name="description"
            rows="1"
            placeholder="Write content here"
            required
            style={{ resize: "vertical", minHeight: "90px", overflowY: "auto" }}
          />
        </div>
        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Product category</p>
            <select onChange={onChangeHandler} name="category">
              <option value="Deep Fried">Deep Fried</option>
              <option value="Crispy Fried Wings">Crispy Fried Wings</option>
              <option value="Juicy Wings">Juicy Wings</option>
              <option value="Savory">Savory</option>
              <option value="Rice Bowls">Rice Bowls</option>
              <option value="Add Ons">Add Ons</option>
              <option value="Coffee">Coffee</option>
            </select>
          </div>
          <div className="add-price flex-col">
            <p>Product price</p>
            <input
              onChange={onChangeHandler}
              value={data.price}
              type="Number"
              name="price"
              placeholder="TK"
            />
          </div>
        </div>
        <button type="submit" className="add-btn">
          ADD
        </button>
      </form>
    </div>
  );
};

export default Add;
