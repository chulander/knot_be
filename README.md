# KnotAPI Backend

This is the backend application for KnotAPI, built with Node.js, Express, and PostgreSQL. It provides APIs for contact management, user authentication, and real-time updates using Socket.IO. The project is configured to run using Docker for easy setup and deployment.

## Features

- **User Authentication**: Secure authentication using JWT, with user data stored in PostgreSQL.
- **Contact Management**: API endpoints to add, edit, delete, and view contact history.
- **Real-time Updates**: Broadcast updates via Socket.IO.
- **Audit Logging**: Track changes to contacts with detailed audit logs.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js** [nvm](https://github.com/nvm-sh/nvm) is recommended for managing Node.js versions.
- [pnpm](https://pnpm.io/) package manager is required to install dependencies.

  ```bash
  npm i -g pnpm
  ```

- **create a .env file** in the root of the project with the following content:

  ```bash
  DB_HOST=127.0.0.1
  DB_HOST_PORT=5432
  DB_NAME=postgres
  DB_USER=postgres
  DB_PASSWORD=Welcome1
  NODE_ENV=development
  PORT=3000
  JWT_SECRET=supersecret
  FRONTEND_ORIGIN=http://localhost:5173
  ```

- **Docker Desktop** installed to run Docker containers.

### Install Docker Desktop

1. **Download Docker Desktop**:

   - Visit [Docker Desktop](https://www.docker.com/products/docker-desktop) to download the installer for your operating system.
   - Follow the installation instructions on the Docker website.

2. **Install Docker Desktop**:
   - Run the installer and follow the setup instructions.
   - After installation, start Docker Desktop to ensure it’s running.
   - Grab the post

## Installation

Follow these steps to set up the backend project locally:

1. **Clone the repository**:

   ```bash
   git clone git@github.com:chulander/knot_be.git
   ```

2. **CD into the project directory**:
   ```bash
   cd knot_be
   ```
3. **Install dependencies**:

   ```bash
   npm install # or pnpm install
   ```

4. **Start the PostgreSQL database**:

   ```bash
   docker-compose up -d
   ```

5. **Run the migration and seed scripts**

   ```bash
   npm run migrate:seed # or pnpm run migrate:seed
   ```

6. **Start the development server**:
   ```bash
   npm run dev # or pnpm run dev
   ```
