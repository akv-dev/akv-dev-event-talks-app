# Vector Embedding Visualization

This project allows you to visualize vector embeddings from a PostgreSQL database. It consists of a Node.js backend and a React frontend.

## Features

*   **Interactive Graph:** Visualizes vector embeddings as a force-directed graph.
*   **Distance on Hover:** Hover over the links between the nodes to see the distance between them.
*   **Vector Details:** Click on a node to see the text and embedding of the vector.
*   **Search:** Use the search bar to find and highlight specific nodes.
*   **Distance Metric:** Use the dropdown menu to switch between different distance metrics (Euclidean, Cosine, and Inner Product).
*   **Interactive Database Viewer:** Explore your database tables, view their schemas, and inspect the raw data.
*   **Embedding Visualization:** Visualize high-dimensional vector embeddings in a 2D scatter plot.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   [Node.js](https://nodejs.org/)
*   [Podman](https://podman.io/)

### Easy Setup with `gini.sh`

This project includes a `gini.sh` script that automates the entire setup process. Just run the following command:

```bash
./gini.sh
```

### Manual Installation

If you prefer to set up the project manually, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/akv-dev/akv-dev-event-talks-app.git
    cd akv-dev-event-talks-app
    ```

2.  **Start the database:**
    ```bash
    podman run -d --name postgres -e POSTGRESQL_USERNAME=postgres -e POSTGRESQL_PASSWORD=postgres -e POSTGRESQL_DATABASE=postgres -p 5432:5432 docker.io/bitnami/postgresql:latest
    ```

3.  **Populate the database:**
    Connect to the database using a PostgreSQL client (e.g., `psql` or a GUI tool). The credentials are provided in the `podman run` command.
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

4.  **Set up and start the backend:**
    ```bash
    cd backend
    npm install
    # Create a .env file with the database credentials
    node server.js &
    ```

5.  **Set up and start the frontend:**
    ```bash
    cd ../frontend
    npm install
    npm start
    ```

## How it works

The frontend fetches the vector embeddings from the backend. For each vector, it also fetches the closest matching vector from the database. The vectors are then displayed as a graph, where each vector is a node, and a line connects it to its closest match.