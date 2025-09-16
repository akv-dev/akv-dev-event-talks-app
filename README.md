# Vector Embedding Visualization

This project allows you to visualize vector embeddings from a PostgreSQL database. It consists of a Node.js backend and a React frontend.

## Setup

### 1. Database Setup

You need to have PostgreSQL installed with the `pgvector` extension.

1.  **Install `pgvector`:** Follow the instructions at [https://github.com/pgvector/pgvector](https://github.com/pgvector/pgvector).

2.  **Create the table and insert data:** Connect to your PostgreSQL database and run the following SQL commands:

    ```sql
    CREATE EXTENSION IF NOT EXISTS vector;

    CREATE TABLE embeddings (
      id SERIAL PRIMARY KEY,
      text TEXT,
      embedding VECTOR(3)
    );

    INSERT INTO embeddings (text, embedding) VALUES
      ('apple', '[1, 2, 3]'),
      ('banana', '[1, 2, 4]'),
      ('orange', '[1, 3, 3]'),
      ('grape', '[2, 2, 3]'),
      ('strawberry', '[1, 1, 1]'),
      ('pineapple', '[1, 1, 2]');
    ```

### 2. Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:** Create a `.env` file in the `backend` directory with your PostgreSQL connection details:
    ```
    DB_USER=your_postgres_user
    DB_HOST=your_postgres_host
    DB_DATABASE=your_postgres_database
    DB_PASSWORD=your_postgres_password
    DB_PORT=your_postgres_port
    ```

4.  **Start the backend server:**
    ```bash
    node server.js
    ```
    The server will be running on `http://localhost:3001`.

### 3. Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the frontend development server:**
    ```bash
    npm start
    ```
    The application will open in your browser at `http://localhost:3000`.

## How it works

The frontend fetches the vector embeddings from the backend. For each vector, it also fetches the closest matching vector from the database. The vectors are then displayed as a graph, where each vector is a node, and a line connects it to its closest match.
