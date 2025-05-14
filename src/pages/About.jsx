import { useNavigate } from 'react-router-dom';

const About = () => {
    const navigate = useNavigate();

    return (
        <div className="about-page">
            <div className="hero-section">
                <div className="container">
                    <div className="hero-content">
                        <h1 className="hero-title">About FreshDeal</h1>
                        <p className="hero-subtitle">Reducing food waste, connecting communities, and saving you money</p>
                    </div>
                </div>
                <div className="hero-overlay"></div>
            </div>

            <div className="container">
                <div className="mission-section">
                    <div className="section-header">
                        <h2 className="section-title">Our Mission</h2>
                        <div className="divider"></div>
                    </div>

                    <div className="row">
                        <div className="col-lg-6">
                            <p className="mission-text">
                                At FreshDeal, we're on a mission to reduce food waste while helping you save money.
                                Every day, restaurants and food vendors throw away perfectly good food that hasn't sold.
                                We connect you with local restaurants offering their surplus food at discounted prices,
                                creating a win-win situation for everyone.
                            </p>
                        </div>
                        <div className="col-lg-6">
                            <div className="stats-container">
                                <div className="stat-item">
                                    <span className="stat-number">40%</span>
                                    <span className="stat-text">of food is wasted globally</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-number">50%</span>
                                    <span className="stat-text">average savings on meals</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-number">100+</span>
                                    <span className="stat-text">partner restaurants</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="features-section">
                    <div className="section-header">
                        <h2 className="section-title">How It Works</h2>
                        <div className="divider"></div>
                    </div>

                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon-container">
                                <i className="bi bi-geo-alt-fill"></i>
                            </div>
                            <h3 className="feature-title">Find Nearby Deals</h3>
                            <p className="feature-description">
                                Discover restaurants in your area with surplus food offerings at discounted prices.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon-container">
                                <i className="bi bi-bag-check-fill"></i>
                            </div>
                            <h3 className="feature-title">Order & Save</h3>
                            <p className="feature-description">
                                Place your order through our app and enjoy savings of up to 50% on quality food.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon-container">
                                <i className="bi bi-bicycle"></i>
                            </div>
                            <h3 className="feature-title">Pickup or Delivery</h3>
                            <p className="feature-description">
                                Choose between picking up your order or having it delivered right to your door.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon-container">
                                <i className="bi bi-star-fill"></i>
                            </div>
                            <h3 className="feature-title">Earn & Redeem</h3>
                            <p className="feature-description">
                                Get rewards for reducing food waste and climb our sustainability leaderboard.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="impact-section">
                    <div className="section-header">
                        <h2 className="section-title">Our Impact</h2>
                        <div className="divider"></div>
                    </div>

                    <div className="impact-content">
                        <div className="impact-image-container">
                            <div className="impact-image"></div>
                        </div>

                        <div className="impact-text">
                            <h3 className="impact-subtitle">Making a Difference Together</h3>
                            <p>
                                Since our launch, FreshDeal users have collectively saved over 10,000 meals from going to waste.
                                That's equivalent to reducing 25 tons of CO2 emissions - the same as taking 5 cars off the road for a year.
                            </p>
                            <p>
                                By choosing to order through FreshDeal, you're not just getting great food at amazing prices —
                                you're also contributing to a more sustainable future and supporting local businesses.
                            </p>
                            <button className="impact-button" onClick={() => navigate('/')}>
                                Start Saving Today
                            </button>
                        </div>
                    </div>
                </div>

                <div className="team-section">
                    <div className="section-header">
                        <h2 className="section-title">Our Team</h2>
                        <div className="divider"></div>
                    </div>

                    <p className="team-description">
                        Founded in 2024 by a group of food enthusiasts and sustainability advocates,
                        FreshDeal is powered by a dedicated team passionate about creating positive change
                        through technology. We're committed to continuous innovation and expansion to serve
                        more communities and reduce food waste on a global scale.
                    </p>

                    <div className="team-values">
                        <div className="value-item">
                            <i className="bi bi-recycle"></i>
                            <h4>Sustainability</h4>
                            <p>Committed to environmental responsibility</p>
                        </div>
                        <div className="value-item">
                            <i className="bi bi-shop"></i>
                            <h4>Community</h4>
                            <p>Supporting local businesses and neighborhoods</p>
                        </div>
                        <div className="value-item">
                            <i className="bi bi-lightbulb"></i>
                            <h4>Innovation</h4>
                            <p>Continuously improving our platform</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="cta-section">
                <div className="container">
                    <h2 className="cta-title">Ready to reduce food waste and save money?</h2>
                    <p className="cta-subtitle">Join thousands of users already making a difference with FreshDeal</p>
                    <button className="cta-button" onClick={() => navigate('/')}>Get Started Now</button>
                </div>
            </div>

            <style jsx>{`
                .about-page {
                    background-color: #FFFFFF;
                }
                
                .container {
                    max-width: 1140px;
                    margin: 0 auto;
                    padding: 0 15px;
                }
                
                .hero-section {
                    position: relative;
                    height: 500px;
                    background-image: url('https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80');
                    background-size: cover;
                    background-position: center;
                    display: flex;
                    align-items: center;
                    color: white;
                    text-align: center;
                    margin-bottom: 60px;
                }
                
                .hero-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7));
                    z-index: 1;
                }
                
                .hero-content {
                    position: relative;
                    z-index: 2;
                    max-width: 800px;
                    margin: 0 auto;
                }
                
                .hero-title {
                    font-size: 48px;
                    font-weight: 700;
                    margin-bottom: 20px;
                    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
                }
                
                .hero-subtitle {
                    font-size: 20px;
                    line-height: 1.5;
                    margin-bottom: 30px;
                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
                }
                
                .section-header {
                    text-align: center;
                    margin-bottom: 40px;
                }
                
                .section-title {
                    font-size: 32px;
                    font-weight: 700;
                    color: #333333;
                    margin-bottom: 15px;
                }
                
                .divider {
                    height: 3px;
                    width: 60px;
                    background-color: #50703C;
                    margin: 0 auto;
                }
                
                .mission-section {
                    padding: 60px 0;
                }
                
                .mission-text {
                    font-size: 18px;
                    line-height: 1.7;
                    color: #555555;
                    margin-bottom: 30px;
                }
                
                .stats-container {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    padding: 30px;
                    background-color: #F8F9FA;
                    border-radius: 16px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
                }
                
                .stat-item {
                    display: flex;
                    flex-direction: column;
                    text-align: center;
                }
                
                .stat-number {
                    font-size: 36px;
                    font-weight: 700;
                    color: #50703C;
                    margin-bottom: 5px;
                }
                
                .stat-text {
                    font-size: 16px;
                    color: #666666;
                }
                
                .features-section {
                    padding: 60px 0;
                    background-color: #F8F9FA;
                    margin-bottom: 60px;
                }
                
                .features-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 30px;
                }
                
                @media (max-width: 992px) {
                    .features-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
                
                @media (max-width: 576px) {
                    .features-grid {
                        grid-template-columns: 1fr;
                    }
                }
                
                .feature-card {
                    background-color: white;
                    border-radius: 16px;
                    padding: 30px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
                    text-align: center;
                    transition: transform 0.3s, box-shadow 0.3s;
                }
                
                .feature-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
                }
                
                .feature-icon-container {
                    width: 70px;
                    height: 70px;
                    border-radius: 35px;
                    background-color: rgba(80, 112, 60, 0.1);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin: 0 auto 20px;
                }
                
                .feature-icon-container i {
                    font-size: 30px;
                    color: #50703C;
                }
                
                .feature-title {
                    font-size: 20px;
                    font-weight: 600;
                    color: #333333;
                    margin-bottom: 15px;
                }
                
                .feature-description {
                    font-size: 15px;
                    color: #666666;
                    line-height: 1.6;
                }
                
                .impact-section {
                    padding: 60px 0;
                }
                
                .impact-content {
                    display: flex;
                    align-items: center;
                    gap: 40px;
                }
                
                @media (max-width: 768px) {
                    .impact-content {
                        flex-direction: column;
                    }
                }
                
                .impact-image-container {
                    flex: 1;
                }
                
                .impact-image {
                    width: 100%;
                    height: 400px;
                    background-image: url('https://images.unsplash.com/photo-1621184455862-c163dfb30e0e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80');
                    background-size: cover;
                    background-position: center;
                    border-radius: 16px;
                    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
                }
                
                .impact-text {
                    flex: 1;
                    padding: 20px;
                }
                
                .impact-subtitle {
                    font-size: 24px;
                    font-weight: 600;
                    color: #333333;
                    margin-bottom: 20px;
                }
                
                .impact-text p {
                    font-size: 16px;
                    color: #555555;
                    line-height: 1.7;
                    margin-bottom: 20px;
                }
                
                .impact-button {
                    background-color: #50703C;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }
                
                .impact-button:hover {
                    background-color: #455f31;
                }
                
                .team-section {
                    padding: 60px 0;
                }
                
                .team-description {
                    font-size: 18px;
                    line-height: 1.7;
                    color: #555555;
                    text-align: center;
                    max-width: 800px;
                    margin: 0 auto 40px;
                }
                
                .team-values {
                    display: flex;
                    justify-content: space-between;
                    gap: 20px;
                }
                
                @media (max-width: 768px) {
                    .team-values {
                        flex-direction: column;
                    }
                }
                
                .value-item {
                    flex: 1;
                    text-align: center;
                    padding: 30px;
                    background-color: #F8F9FA;
                    border-radius: 16px;
                    transition: transform 0.3s;
                }
                
                .value-item:hover {
                    transform: translateY(-5px);
                }
                
                .value-item i {
                    font-size: 36px;
                    color: #50703C;
                    margin-bottom: 15px;
                }
                
                .value-item h4 {
                    font-size: 20px;
                    font-weight: 600;
                    color: #333333;
                    margin-bottom: 10px;
                }
                
                .value-item p {
                    font-size: 15px;
                    color: #666666;
                }
                
                .cta-section {
                    background-color: #50703C;
                    color: white;
                    padding: 80px 0;
                    text-align: center;
                }
                
                .cta-title {
                    font-size: 36px;
                    font-weight: 700;
                    margin-bottom: 20px;
                }
                
                .cta-subtitle {
                    font-size: 18px;
                    margin-bottom: 30px;
                }
                
                .cta-button {
                    background-color: white;
                    color: #50703C;
                    border: none;
                    padding: 14px 30px;
                    border-radius: 8px;
                    font-size: 18px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                
                .cta-button:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                }
                
                .row {
                    display: flex;
                    flex-wrap: wrap;
                    margin-right: -15px;
                    margin-left: -15px;
                }
                
                .col-lg-6 {
                    position: relative;
                    width: 100%;
                    padding-right: 15px;
                    padding-left: 15px;
                }
                
                @media (min-width: 992px) {
                    .col-lg-6 {
                        flex: 0 0 50%;
                        max-width: 50%;
                    }
                }
            `}</style>
        </div>
    );
};

export default About;