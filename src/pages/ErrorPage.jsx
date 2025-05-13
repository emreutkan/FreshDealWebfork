import React from "react";

function ErrorPage() {
    const styles = {
        errorContainer: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
            fontFamily: "Arial, sans-serif",
            textAlign: "center",
            padding: "0 20px"
        },
        errorHero: {
            marginBottom: "2rem",
            padding: "2rem",
            borderRadius: "8px",
            background: "rgba(255, 255, 255, 0.8)",
            boxShadow: "0 8px 32px rgba(31, 38, 135, 0.2)",
            backdropFilter: "blur(4px)",
            border: "1px solid rgba(255, 255, 255, 0.18)"
        },
        heroTitle: {
            fontSize: "3rem",
            margin: "0 0 0.5rem 0",
            color: "#333",
            fontWeight: "bold"
        },
        heroSubtitle: {
            fontSize: "1.2rem",
            color: "#666",
            margin: "0"
        },
        errorContent: {
            background: "white",
            padding: "2rem",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            maxWidth: "500px",
            width: "100%"
        },
        title: {
            fontSize: "2rem",
            color: "#e74c3c",
            margin: "0 0 1rem 0"
        },
        message: {
            fontSize: "1.1rem",
            color: "#555",
            marginBottom: "1.5rem"
        },
        button: {
            padding: "12px 24px",
            background: "#3498db",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "1rem",
            cursor: "pointer",
            transition: "background 0.3s ease"
        },
        buttonHover: {
            background: "#2980b9"
        }
    };

    return (
        <div style={styles.errorContainer}>
            <div style={styles.errorHero}>
                <h1 style={styles.heroTitle}>404</h1>
                <p style={styles.heroSubtitle}>Page Not Found</p>
            </div>
            <div style={styles.errorContent}>
                <h2 style={styles.title}>Oops!</h2>
                <p style={styles.message}>
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <button
                    style={styles.button}
                    onMouseOver={(e) => Object.assign(e.target.style, styles.buttonHover)}
                    onMouseOut={(e) => e.target.style.background = styles.button.background}
                    onClick={() => window.history.back()}
                >
                    Go Back
                </button>
            </div>
        </div>
    );
}

export default ErrorPage;