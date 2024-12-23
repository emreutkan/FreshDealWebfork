import Banner from "./Banner";
import Blog from "./Blog";
import Footer from "./Footer";

function BlogPage() {
    return (
        <>
            <div class="container-fluid">
                <div class="layout_main">
                    <Banner />
                    <Blog />
                    <Footer />
                </div>
            </div>
        </>
    );
}

export default BlogPage;