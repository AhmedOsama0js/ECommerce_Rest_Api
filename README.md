# ECommerce REST API

This is a backend API for an e-commerce platform built with JavaScript using Node.js and Express. It provides various routes to manage categories, products, users, orders, cart, reviews, and more.

## Features
- User Authentication & Authorization
- Manage Products, Categories, and Subcategories
- Manage Orders, Coupons, Cart, and Wishlist
- Add and manage Reviews for products
- Handle Addresses and Brands

## Technologies Used
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework for APIs
- **MongoDB**: Database for data storage
- **JWT**: Authentication

## Setup & Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/AhmedOsama0js/ECommerce_Rest_Api.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file and add:
   ```env
   MONGO_URI=<your_mongo_connection_string>
   JWT_SECRET=<your_jwt_secret_key>
   ```

4. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/login`: Login user and receive a JWT token
- `POST /api/auth/register`: Register a new user
- `POST /api/auth/resetPassword`: Reset user password

### Products
- `GET /api/products`: Get all products
- `POST /api/products`: Add a new product
- `PUT /api/products/:id`: Update product details
- `DELETE /api/products/:id`: Delete a product

### Categories
- `GET /api/categories`: Get all categories
- `POST /api/categories`: Add a new category
- `PUT /api/categories/:id`: Update category details
- `DELETE /api/categories/:id`: Delete a category

### Orders
- `GET /api/orders`: Get all orders
- `POST /api/orders`: Create a new order
- `PUT /api/orders/:id`: Update order status
- `DELETE /api/orders/:id`: Cancel an order

### Cart
- `GET /api/cart`: View cart
- `POST /api/cart`: Add item to cart
- `DELETE /api/cart/:id`: Remove item from cart

### Reviews
- `POST /api/reviews`: Add a review for a product
- `GET /api/reviews/:productId`: Get reviews for a product

### Wishlist
- `GET /api/wishlist`: View wishlist
- `POST /api/wishlist`: Add item to wishlist
- `DELETE /api/wishlist/:id`: Remove item from wishlist

### Addresses
- `POST /api/addresses`: Add a new address
- `GET /api/addresses`: View addresses

## License
This project is licensed under the MIT License.

## Contributing
Feel free to fork the repository and submit a pull request with your improvements or fixes.

## More Info
For more information, visit the [repository](https://github.com/AhmedOsama0js/ECommerce_Rest_Api).
```

This README covers setup, features, API endpoints, and details about the technologies used in the project.
