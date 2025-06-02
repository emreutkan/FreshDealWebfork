# FreshDeal: Food Delivery Web Application

![FreshDeal Logo](./public/logo.webp)

## Overview

FreshDeal is a modern food delivery web application built with React that connects users with their favorite restaurants. The platform offers a seamless experience for discovering, ordering, and tracking food deliveries with additional features like achievement systems and restaurant rankings.

## Features

- **Restaurant Discovery**: Browse through various restaurants with filtering options
- **User Authentication**: Secure login and registration system
- **Order Management**: Place, track, and review your food orders
- **Address Selection**: Save and manage delivery addresses
- **Favorites**: Mark and access your favorite restaurants quickly
- **Restaurant Ratings**: View and leave comments on restaurant experiences
- **Achievement System**: Earn achievements based on your platform activity
- **Rankings**: Check restaurant rankings based on user reviews and ratings
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Cart Management**: Easily add items to cart and proceed to checkout

## Technology Stack

- **Frontend**: React 18
- **State Management**: Redux Toolkit
- **Routing**: React Router v7
- **Forms & Validation**: Formik with Yup
- **UI Components**: React Bootstrap, Bootstrap 5
- **Maps Integration**: React Google Maps API
- **Date Handling**: date-fns
- **HTTP Client**: Axios
- **Styling**: CSS with Bootstrap
- **Build Tool**: Vite

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation

1. Clone the repository
```bash
git clone [repository-url]
cd freshdealweb
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the app for production
- `npm run lint` - Run ESLint for code quality
- `npm run preview` - Preview the production build locally

## Project Structure

```
src/
├── App.jsx               # Main application component
├── components/           # Reusable UI components
├── context/              # React context providers
├── CustomInputs/         # Custom form input components
├── images/               # Static image assets
├── pages/                # Application pages/routes
├── redux/                # Redux store, slices, and API
│   ├── api/              # API integration
│   ├── slices/           # Redux state slices
│   └── thunks/           # Async Redux thunks
├── schemas/              # Form validation schemas
├── services/             # Service layer for API communication
└── utils/                # Utility functions
```

## Features in Detail

### Restaurant Management
Users can browse, filter, and search for restaurants based on various criteria including location, cuisine type, and ratings.

### User Profile
Personalized user profiles that track order history, favorite restaurants, and earned achievements.

### Order Processing
Complete order flow from cart to checkout with order tracking and history.

### Authentication
Secure user authentication with protected routes and user-specific content.

### Responsive Design
Fully responsive design that works across desktop, tablet, and mobile devices.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [React](https://reactjs.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Bootstrap](https://getbootstrap.com/)
- [Vite](https://vitejs.dev/)
- And all other open-source libraries used in this project
