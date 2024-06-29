# P2P TCP Chat Application

## Overview

This repository contains the codebase for a Peer-to-Peer (P2P) TCP Chat application. It consists of a frontend built with Angular and a backend implemented using Ktor, a Kotlin-based framework. The application facilitates real-time messaging between users over a TCP connection, allowing them to chat directly with each other.

## Features

- **User Management:**
  - Sign up and sign in functionality.
  - User authentication and authorization (Future development plan: JWT integration).

- **Real-time Messaging:**
  - P2P messaging via TCP connection.
  - Message status tracking (not sent, sent, received, read).

- **WebSocket Integration:**
  - Real-time updates and notifications using WebSocket for message delivery status (Future development plan: WebSocket enhancement to handle unread messages).

- **Chat Management:**
  - Creation of new chats between users.
  - Listing and retrieving existing chats.

## Technologies Used

- **Frontend:**
  - Angular
  - TypeScript
  - WebSocket for real-time updates

- **Backend:**
  - Ktor (Kotlin-based framework for building asynchronous servers)
  - MongoDB (NoSQL database for storing user data and chat history)

## Project Structure

- **`/frontend`:** Contains Angular frontend code.
- **`/backend`:** Contains Ktor backend code.
- **`/dbMongoConnection`:** MongoDB connection handling.
- **`/handling`:** Business logic for user handling, chat handling, and WebSocket management.
- **`/models`:** Data models used across the application.
- **`/routing`:** Routing definitions for API endpoints and WebSocket connections.

## Future Development

- **JWT Authentication:** Implement JSON Web Token (JWT) for secure user authentication and authorization.
- **Unread Message Tracking:** Enhance WebSocket functionality to handle unread message notifications.
- **User Interface Improvements:** Enhance frontend UI/UX for better user experience.
- **Performance Optimization:** Optimize database queries and WebSocket handling for improved performance.

## Getting Started

To run the application locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your/repository.git](https://github.com/efraimG21/P2P-Tcp-chat
   cd P2P-Tcp-chat
   ```

2. **Set up MongoDB:**
   - Install MongoDB locally or use a cloud service.
   - Update MongoDB connection details in `dbMongoConnection/MongoDBConnection.kt`.

3. **Run Backend (Ktor):**
   - Navigate to `/backend` directory.
   - Build and run the backend server:
     ```bash
     ./gradlew run
     ```

4. **Run Frontend (Angular):**
   - Navigate to `/frontend` directory.
   - Install dependencies and start the Angular development server:
     ```bash
     npm install
     npm start
     ```

5. **Access the Application:**
   - Open your web browser and go to `http://localhost:4200` to access the application frontend.

## Contributing

Contributions to this project are welcome! Please fork the repository and create a pull request with your suggested changes. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any questions or feedback regarding this project, please contact me.
