# acquy-hungthinh-server API Instructions

## Project Overview
This project serves as the backend server for the acquy hung thinh application.

## Setup Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/anhpd912/acquy-hungthinh-server.git
   ```
2. Navigate to the project directory:
   ```bash
   cd acquy-hungthinh-server
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```

## Server Startup Instructions
To start the server, run:
```bash
npm start
```
or for development mode (with nodemon):
```bash
npm run dev
```

## Middleware Setup
- **CORS**: Enables cross-origin resource sharing, which is essential for allowing requests from different origins.
- **Error Handling**: Custom middleware functions to handle errors and respond with appropriate messages.

## API Endpoints
### Posts
- **POST** `/api/posts`: Create a new post
- **GET** `/api/posts`: Retrieve all posts
- **GET** `/api/posts/:id`: Retrieve a post by ID
- **PUT** `/api/posts/:id`: Update a post by ID
- **DELETE** `/api/posts/:id`: Soft delete a post by ID

### Videos
- **POST** `/api/videos`: Create a new video
- **GET** `/api/videos`: Retrieve all videos
- **GET** `/api/videos/:id`: Retrieve a video by ID
- **PUT** `/api/videos/:id`: Update a video by ID
- **DELETE** `/api/videos/:id`: Soft delete a video by ID
