#!/bin/bash

# This script automates the setup of the Vector Embedding Visualization project.

# Exit immediately if a command exits with a non-zero status.
set -e

# 1. Start the database
_BLUE='\033[0;34m'
_GREEN='\033[0;32m'
_NC='\033[0m' # No Color

printf "${_BLUE}Starting the database...${_NC}"

if command -v podman &> /dev/null; then
    CONTAINER_CMD="podman"
elif command -v docker &> /dev/null; then
    CONTAINER_CMD="docker"
else
    printf "Error: Neither podman nor docker found. Please install one of them.\n"
    exit 1
fi

printf "Using ${CONTAINER_CMD}...\n"

if ${CONTAINER_CMD} inspect postgres > /dev/null 2>&1; then
    printf "Postgres container already exists. Starting it if it's stopped.\n"
    ${CONTAINER_CMD} start postgres
else
    printf "Postgres container not found. Creating and starting a new one.\n"
    ${CONTAINER_CMD} run -d --name postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=postgres -p 5432:5432 docker.io/pgvector/pgvector:pg17-trixie
fi


# 2. Wait for the database to be ready
printf "${_BLUE}Waiting for the database to be ready...${_NC}\n"
sleep 10

# 3. Populate the database
printf "${_BLUE}Populating the database...${_NC}\n"
export PGPASSWORD=postgres
cat <<EOF | ${CONTAINER_CMD} exec -i postgres psql -U postgres -h localhost
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
EOF
unset PGPASSWORD

# 4. Create .env file for backend
printf "${_BLUE}Creating .env file for backend...${_NC}\n"
cat <<EOF > backend/.env
DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=postgres
DB_PASSWORD=postgres
DB_PORT=5432
EOF

# 5. Install backend dependencies
printf "${_BLUE}Installing backend dependencies...${_NC}\n"
(cd backend && npm install)

# 6. Start the backend server
printf "${_BLUE}Starting the backend server...${_NC}\n"
(cd backend && node server.js &)

# 7. Install frontend dependencies
printf "${_BLUE}Installing frontend dependencies...${_NC}\n"
(cd frontend && npm install)

# 8. Start the frontend application
printf "${_GREEN}Starting the frontend application...${_NC}\n"
(cd frontend && npm start)
