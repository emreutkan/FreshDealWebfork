import Banner from "./Banner";
import Shop from "./Shop";
import Footer from "./Footer";

function ShopPage() {
    return ( 
<>
            <div class="container-fluid">
                <div class="layout_main">
                <Banner />
                    <Shop />
                    <Footer />
                </div>
            </div>
        </>
     );
}

export default ShopPage;