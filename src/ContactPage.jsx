import Banner from "./Banner";
import Footer from "./Footer";
import Contact from "./Contact";

function ContactPage() {
    return ( 
        <>
            <div class="container-fluid">
                <div class="layout_main">
                <Banner />
                    <Contact />
                    <Footer />
                </div>
            </div>
        </>
     );
}

export default ContactPage;