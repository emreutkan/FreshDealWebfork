import React from 'react';

const FlashDealsFloatingBadge = ({ onClick }) => {
    const styles = {
        floatingBadge: {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            backgroundColor: '#50703C',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '30px',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
            cursor: 'pointer',
            transition: 'all 0.2s',
            zIndex: 1000,
        },
        icon: {
            marginRight: '8px',
            fontSize: '16px',
        },
        text: {
            fontWeight: '600',
        }
    };

    return (
        <div
            style={styles.floatingBadge}
            onClick={onClick}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.25)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
            }}
        >
            <i className="bi bi-lightning-fill" style={styles.icon}></i>
            <span style={styles.text}>Flash Deals</span>
        </div>
    );
};

export default FlashDealsFloatingBadge;