import Banner from "./Banner";
import Restaurant from "./Restaurants";
import Footer from "./Footer";

function RestaurantsPage() {
    return (
        <>
            <div class="container-fluid">
                <div class="layout_main">
                    <Banner />
                    <Restaurant />
                    <Footer />
                </div>
            </div>
        </>
    );
}

export default RestaurantsPage;