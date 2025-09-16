# Vector Embedding Visualization

This project allows you to visualize vector embeddings from a PostgreSQL database. It consists of a Node.js backend and a React frontend.

## Setup

### 1. Database Setup

This project uses Docker to run a PostgreSQL database with the `pgvector` extension. 

1.  **Start the database container:**
    ```bash
    docker-compose up -d db
    ```

2.  **Connect to the database and create the table:**
    You can connect to the database using any PostgreSQL client. The credentials are in the `docker-compose.yml` file.
    Once connected, run the following SQL commands:

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
    DB_USER=postgres
    DB_HOST=localhost
    DB_DATABASE=postgres
    DB_PASSWORD=postgres
    DB_PORT=5432
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
