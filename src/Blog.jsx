import { Link } from 'react-router';
import './Blog.css'
import blogImg1 from './assets/blog-img1.png'
import blogImg2 from './assets/blog-img2.png'
import blogImg3 from './assets/blog-img3.png'

function Blog() {
    return ( 
        <>
            <div className="blog_section layout_padding">
               <div className="container">
                  <div className="row">
                     <div className="col-sm-12">
                        <h1 className="blog_taital">Collections Food In city</h1>
                     </div>
                  </div>
               </div>
            </div>
            <div className="blog_section_2 layout_padding">
               <div className="container">
                  <div className="row">
                     <div className="col-md-6">
                        <div className="blog_img"><img src={blogImg1}/></div>
                     </div>
                     <div className="col-md-6">
                        <div className="blog_taital_main">
                           <h1 className="blog_text">This Week going</h1>
                           <p className="lorem_text">Long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed</p>
                           <div className="readmore_btn"><Link href="#">Read More</Link></div>
                        </div>
                     </div>
                     <div className="col-md-6">
                        <div className="blog_img"><img src={blogImg2}/></div>
                     </div>
                     <div className="col-md-6">
                        <div className="blog_taital_main">
                           <h1 className="blog_text">Just Delivery Food</h1>
                           <p className="lorem_text">Long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed</p>
                           <div className="readmore_btn"><Link href="#">Read More</Link></div>
                        </div>
                     </div>
                     <div className="col-md-6">
                        <div className="blog_img"><img src={blogImg3}/></div>
                     </div>
                     <div className="col-md-6">
                        <div className="blog_taital_main">
                           <h1 className="blog_text">Newly Opened Cafe</h1>
                           <p className="lorem_text">Long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed</p>
                           <div className="readmore_btn"><Link href="#">Read More</Link></div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
        </>
     );
}

export default Blog;