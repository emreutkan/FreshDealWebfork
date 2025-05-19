import React from 'react';

// List of available categories
const CATEGORIES = [
    "All Categories",
    "Baked Goods",
    "Fruits & Vegetables",
    "Meat & Seafood",
    "Dairy Products",
    "Ready Meals",
    "Snacks",
    "Beverages",
    "Pantry Items",
    "Frozen Foods",
    "Organic Products"
];

const CategoryFilter = ({ selectedCategory, onSelectCategory }) => {
    const styles = {
        container: {
            backgroundColor: '#fff',
            padding: '16px 0',
            marginBottom: '16px',
            borderBottom: '1px solid #eee',
            position: 'sticky',
            top: '60px',  // Adjust based on your header height
            zIndex: 10,
        },
        scrollContainer: {
            display: 'flex',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            WebkitOverflowScrolling: 'touch',
            msOverflowStyle: 'none',  // IE and Edge
            scrollbarWidth: 'none',  // Firefox
        },
        categoryButton: {
            display: 'inline-block',
            padding: '8px 16px',
            margin: '0 8px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap',
            border: '1px solid #e0e0e0',
            backgroundColor: '#fff',
            color: '#333',
        },
        categoryButtonActive: {
            backgroundColor: '#50703C',
            color: '#fff',
            border: '1px solid #50703C',
        },
        title: {
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '12px',
            marginLeft: '16px',
        }
    };

    return (
        <div style={styles.container}>
            <h4 style={styles.title}>Filter By Category</h4>
            <div style={styles.scrollContainer}>
                {CATEGORIES.map((category) => (
                    <button
                        key={category}
                        style={{
                            ...styles.categoryButton,
                            ...(selectedCategory === category ? styles.categoryButtonActive : {})
                        }}
                        onClick={() => onSelectCategory(category)}
                    >
                        {category}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CategoryFilter;