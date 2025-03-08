# Full-Stack Log Processing Application

This project is a full-stack application that processes large log files asynchronously using a Node.js microservice with BullMQ, a Next.js frontend with React for real-time analytics, and Supabase for authentication and database storage. The entire system is deployed using Docker.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Setup Instructions](#setup-instructions)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Real-Time Updates](#real-time-updates)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Features

- Upload log files and process them asynchronously.
- Real-time analytics dashboard displaying log statistics.
- User authentication using Supabase.
- WebSocket connection for live updates on job processing.
- Dockerized application for easy deployment.

## Technologies

- **Backend**: Node.js (20.x), BullMQ, Supabase
- **Frontend**: Next.js (14.x), React (18.x)
- **Database**: Supabase
- **Containerization**: Docker, Docker Compose

## Setup Instructions

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/full-stack-app.git
   cd full-stack-app
   ```

2. Create a `.env` file in both the `backend` and `frontend` directories and configure the necessary environment variables (e.g., Supabase URL, Redis host).

3. Build and run the application using Docker Compose:
   ```
   docker-compose up --build
   ```

4. Access the application at `http://localhost:3000`.

## Usage

- Navigate to the dashboard to upload log files.
- View real-time statistics and job processing updates.

## API Endpoints

- **POST** `/api/upload-logs`: Upload log files and enqueue processing jobs.
- **GET** `/api/stats`: Fetch aggregated log statistics from Supabase.
- **GET** `/api/stats/[jobId]`: Fetch statistics for a specific job.
- **GET** `/api/queue-status`: Get the current status of the BullMQ queue.

## Real-Time Updates

The application uses a WebSocket connection established at `/api/live-stats` to broadcast job progress and completion events to the frontend, ensuring users receive live updates on log processing.

## Testing

Unit tests are implemented for log processing logic using Jest, and integration tests are available for the `/api/upload-logs` endpoint with mocked BullMQ.
