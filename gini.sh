#!/bin/bash

# This script automates the setup of the Vector Embedding Visualization project.

# Exit immediately if a command exits with a non-zero status.
set -e

# 1. Start the database
_BLUE='\033[0;34m'
_GREEN='\033[0;32m'
_NC='\033[0m' # No Color

printf "${_BLUE}Starting the database...${_NC}\n"
podman-compose up -d db

# 2. Wait for the database to be ready
printf "${_BLUE}Waiting for the database to be ready...${_NC}\n"
sleep 10

# 3. Populate the database
printf "${_BLUE}Populating the database...${_NC}\n"
cat <<EOF | podman exec -i vector-display_db_1 psql -U postgres
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

# 4. Install backend dependencies
printf "${_BLUE}Installing backend dependencies...${_NC}\n"
(cd backend && npm install)

# 5. Start the backend server
printf "${_BLUE}Starting the backend server...${_NC}\n"
(cd backend && node server.js &)

# 6. Install frontend dependencies
printf "${_BLUE}Installing frontend dependencies...${_NC}\n"
(cd frontend && npm install)

# 7. Start the frontend application
printf "${_GREEN}Starting the frontend application...${_NC}\n"
(cd frontend && npm start)
