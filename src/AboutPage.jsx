import About from "./About";
import Banner from "./Banner";
import Footer from "./Footer";

function AboutPage() {
    return ( 
        <>
            <div class="container-fluid">
                <div class="layout_main">
                <Banner />
                    <About />
                    <Footer />
                </div>
            </div>
        </>
     );
}

export default AboutPage;