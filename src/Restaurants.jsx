import './Restaurants.css'
import Restaurant from './Restaurant';

function Restaurants() {
    return ( 
        <>
            <div className="restaurant_section layout_padding">
               <div className="container">
                  <div className="row">
                     <div className="col-sm-12">
                        <h1 className="restaurant_taital">Collections Food In city</h1>
                     </div>
                  </div>
               </div>
            </div>
            <div className="restaurant_section_2 layout_padding">
               <div className="container">
                  <div className="row">
                     {/*Data.map((restaurant, key) => {//data DB den gelen restaurant listesi olacak
                        return (
                           <Restaurant 
                              key={key}
                              restaurantImg={restaurant.image}
                              restaurantName={restaurant.name}
                              restaurantContent={restaurant.content}
                              restaurantLink={restaurant.link}
                           />
                        );
                     })*/}
                  </div>
               </div>
            </div>
        </>
     );
}

export default Restaurants;