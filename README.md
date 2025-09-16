# Vector Embedding Visualization

This project allows you to visualize vector embeddings from a PostgreSQL database. It consists of a Node.js backend and a React frontend.

## Features

*   **Interactive Graph:** Visualizes vector embeddings as a force-directed graph.
*   **Distance on Hover:** Hover over the links between the nodes to see the distance between them.
*   **Vector Details:** Click on a node to see the text and embedding of the vector.
*   **Search:** Use the search bar to find and highlight specific nodes.
*   **Distance Metric:** Use the dropdown menu to switch between different distance metrics (Euclidean, Cosine, and Inner Product).

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   [Node.js](https://nodejs.org/)
*   [Podman](https://podman.io/)
*   [Podman Compose](https://github.com/containers/podman-compose)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/akv-dev/akv-dev-event-talks-app.git
    cd akv-dev-event-talks-app
    ```

2.  **Start the database:**
    This project uses Podman to run a PostgreSQL database with the `pgvector` extension.
    ```bash
    podman-compose up -d db
    ```

3.  **Populate the database:**
    Connect to the database using a PostgreSQL client. The credentials are in the `docker-compose.yml` file (user: `postgres`, password: `postgres`, database: `postgres`, host: `localhost`, port: `5432`).
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

4.  **Install backend dependencies:**
    ```bash
    cd backend
    npm install
    ```

5.  **Set up backend environment variables:**
    Create a `.env` file in the `backend` directory with your PostgreSQL connection details:
    ```
    DB_USER=postgres
    DB_HOST=localhost
    DB_DATABASE=postgres
    DB_PASSWORD=postgres
    DB_PORT=5432
    ```

6.  **Start the backend server:**
    ```bash
    node server.js
    ```
    The server will be running on `http://localhost:3001`.

7.  **Install frontend dependencies:**
    In a new terminal, navigate to the `frontend` directory:
    ```bash
    cd ../frontend
    npm install
    ```

8.  **Start the frontend application:**
    ```bash
    npm start
    ```
    The application will open in your browser at `http://localhost:3000`.

## How it works

The frontend fetches the vector embeddings from the backend. For each vector, it also fetches the closest matching vector from the database. The vectors are then displayed as a graph, where each vector is a node, and a line connects it to its closest match.