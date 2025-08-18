# Portfolio Manager

## Overview

Portfolio Manager is a full-stack web application designed to help users track and manage their stock portfolios. It features a React-based frontend and a Node.js/Express backend, allowing users to create portfolios, add stocks, and view real-time stock data.

-----

## Features

### Backend

The backend is built with Node.js and Express and provides the following features:

  * **User Authentication**: Secure user registration and login functionality using JWT for authentication.
  * **Portfolio Management**: Complete CRUD (Create, Read, Update, Delete) operations for managing user portfolios.
  * **Stock Tracking**: Allows for adding, updating, and removing stocks from a portfolio.
  * **Real-time Stock Data**: Integrates with the Finnhub API to fetch real-time stock quotes, historical data, and company profiles.
  * **Market Data**: Provides access to trending stocks, market gainers and losers, and market indices.

### Frontend

The frontend is a modern single-page application built with React and Vite, offering a seamless and responsive user experience. Key features include:

  * **User-friendly Interface**: A clean and intuitive interface for easy navigation and portfolio management.
  * **Secure Routes**: Protected routes that ensure only authenticated users can access their portfolio and watchlist.
  * **Component-based Architecture**: Organized and reusable components for maintainability and scalability.

-----

## Technologies Used

### Backend

  * **Node.js**: A JavaScript runtime for building the server-side application.
  * **Express**: A web application framework for Node.js, used for building the RESTful APIs.
  * **MongoDB**: A NoSQL database for storing user data and portfolio information.
  * **Mongoose**: An object data modeling (ODM) library for MongoDB and Node.js.
  * **JWT (JSON Web Tokens)**: For implementing secure user authentication.
  * **Bcrypt.js**: A library for hashing user passwords before storing them in the database.
  * **Dotenv**: For managing environment variables.

### Frontend

  * **React**: A JavaScript library for building user interfaces.
  * **Vite**: A fast build tool and development server for modern web projects.
  * **React Router**: For handling routing within the single-page application.
  * **Tailwind CSS**: A utility-first CSS framework for creating custom designs.
  * **Axios**: A promise-based HTTP client for making API requests to the backend.

-----

## Getting Started

### Prerequisites

  * Node.js and npm installed on your machine.
  * A MongoDB database instance (local or cloud-based).
  * An API key from Finnhub for stock data.

### Installation and Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/nilashishde/portfolio-manager.git
    cd portfolio-manager
    ```

2.  **Backend Setup:**

      * Navigate to the `backend` directory.
      * Install the dependencies:
        ```bash
        npm install
        ```
      * Create a `.env` file and add the necessary environment variables (see the "Environment Variables" section below).
      * Start the backend server:
        ```bash
        npm start
        ```

3.  **Frontend Setup:**

      * Navigate to the `frontend` directory.
      * Install the dependencies:
        ```bash
        npm install
        ```
      * Start the frontend development server:
        ```bash
        npm run dev
        ```

-----

## Environment Variables

For the backend to function correctly, you'll need to create a `.env` file in the `backend` directory. This file will store your environment variables, which are sensitive pieces of information that your application needs to run.

Here are the environment variables you'll need to include:

  * **`PORT`**: The port number on which your backend server will run. If not provided, it will default to `5000`.
  * **`MONGODB_URI`**: Your MongoDB connection string. This is required to connect to your database.
  * **`JWT_SECRET`**: A secret key for signing and verifying JSON Web Tokens (JWTs), which are used for user authentication.
  * **`FMP_API_KEY`**: Your API key from Finnhub, which is used to fetch real-time stock data.

Here's an example of what your `.env` file should look like:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FMP_API_KEY=your_finnhub_api_key
```

### API Keys

The only external API key you'll need for this project is from **Finnhub**.

To get your free API key from Finnhub, follow these steps:

1.  **Register for a free account** on the [Finnhub website](https://finnhub.io/register).
2.  **Verify your email address** by clicking on the link in the confirmation email.
3.  Once you've logged in, you'll be taken to your **dashboard**, where you can find your API key.
4.  **Copy the API key** and paste it into your `.env` file as the value for `FMP_API_KEY`.

-----

## API Endpoints

The backend exposes the following RESTful API endpoints:

  * **`/api/auth`**: Handles user authentication, including registration, login, and profile management.
  * **`/api/portfolios`**: Provides CRUD operations for portfolios and allows for managing stocks within a portfolio.
  * **`/api/stocks`**: Offers endpoints for searching stocks, fetching quotes, and retrieving market data.

For detailed information on each endpoint, please refer to the backend route files.

-----

## Project Structure

```
portfolio-manager/
|-- backend/
|   |-- config/
|   |-- controllers/
|   |-- middleware/
|   |-- models/
|   |-- routes/
|   |-- services/
|   |-- utils/
|   |-- .env
|   |-- index.js
|   `-- package.json
`-- frontend/
    |-- public/
    |-- src/
    |   |-- components/
    |   |-- context/
    |   |-- pages/
    |   |-- App.jsx
    |   `-- main.jsx
    |-- index.html
    `-- package.json
```
