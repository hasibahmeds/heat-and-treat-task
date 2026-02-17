// from yt

// import  { useContext } from 'react'
// import './FoodItem.css'
// import { assets } from '../../assets/assets'
// import { StoreContext } from '../../context/StoreContext'
// const FoodItem = ({id,name,price,description,image}) => {

//   const {cartItems,addToCart,removeFromCart,url} = useContext(StoreContext);
    
//   return (
//     <div className='food-item'>
//             <div className="food-item-img-container">
//                 <img className='food-item-image' src={url+"/images/"+image} alt=''/>
                
//                 {!cartItems[id]
//                     ?<img className='add' onClick={()=>addToCart(id)} src={assets.add_icon_white} alt=''/>
//                     :<div className='food-item-counter'>
//                         <img onClick={()=>removeFromCart(id)} src={assets.remove_icon_red} alt=''/>
//                         <p>{cartItems[id]}</p>
//                         <img onClick={()=>addToCart(id)} src={assets.add_icon_green} alt=''/>
//                     </div>
                  
//                 }
//             </div>
//             <div className="food-item-info">
//                 <div className="food-item-name-rating">
//                     <p>{name}</p>
//                     <img src={assets.rating_starts} alt=''/>
//                 </div>
//                 <p className='food-item-desc'>{description}</p>
//                 <p className="food-item-price">{price} TK</p>
//             </div>
//     </div>
//   )
// }

// export default FoodItem






// comment this under code just for using button instead of the image icons for add and remove from cart

// import { useContext } from 'react'
// import './FoodItem.css'
// import { assets } from '../../assets/assets'
// import { StoreContext } from '../../context/StoreContext'

// const FoodItem = ({id,name,price,description,image}) => {

//   const {cartItems,addToCart,removeFromCart,url} = useContext(StoreContext);
    // Logic to determine image source
//   const imageSrc = image.startsWith("http") ? image : url + "/images/" + image;
    
//   return (
//     <div className='food-item'>
//             <div className="food-item-img-container">
//                 <img className='food-item-image' src={imageSrc} alt=''/>
//                 {!cartItems?.[id]
//                     ?<img className='add' onClick={()=>addToCart(id)} src={assets.add_icon_white} alt=''/>
//                     :<div className='food-item-counter'>
//                         <img onClick={()=>removeFromCart(id)} src={assets.remove_icon_red} alt=''/>
//                         <p>{cartItems[id]}</p>
//                         <img onClick={()=>addToCart(id)} src={assets.add_icon_green} alt=''/>
//                     </div>
//                 }
//             </div>
//             <div className="food-item-info">
//                 <div className="food-item-name-rating">
//                     <p>{name}</p>
//                 </div>
//                 <p className='food-item-desc'>{description}</p>
//                 <p className="food-item-price">{price} TK</p>
//             </div>
//     </div>
//   )
// }

// export default FoodItem












import { useContext } from 'react'
import './FoodItem.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'

const FoodItem = ({id,name,price,description,image}) => {
  const {cartItems,addToCart,removeFromCart,url} = useContext(StoreContext);
  
  // Logic to determine image source
  const imageSrc = image.startsWith("http") ? image : url + "/images/" + image;
   
  // Current quantity in cart (0 if not present)
  const quantity = cartItems?.[id] || 0;

  return (
    <div className='food-item'>
      <div className="food-item-img-container">
        <img className='food-item-image' src={imageSrc} alt={name}/>
        
        {/* Replaced old counter / add icon logic with conditional button vs ± controls */}
        {quantity === 0 ? (
          <button
            className="add-to-cart-btn"
            onClick={() => addToCart(id)}
          >
            Add To Cart
          </button>
        ) : (
          <div className="food-item-counter-modern">
            <button 
              className="counter-btn minus" 
              onClick={() => removeFromCart(id)}
            >
              −
            </button>
            <span className="counter-value">{quantity}</span>
            <button 
              className="counter-btn plus" 
              onClick={() => addToCart(id)}
            >
              +
            </button>
          </div>
        )}
      </div>

      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
        </div>
        <p className='food-item-desc'>{description}</p>
        <p className="food-item-price">{price} TK</p>
      </div>
    </div>
  )
}

export default FoodItem