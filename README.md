# Learning Management System API

## Project Overview

This Node.js API serves as the backend for the Learning Management System, facilitating educational processes for faculty, students, and administrators. It handles all data processing and storage, providing endpoints for managing courses, assignments, quizzes, grades, and user accounts.

- **Node Version**: 18+
- **API Base URL**: `http://localhost:5000`

## Features

1. **Courses**: API endpoints to create, retrieve, update, and delete course information.
2. **Assignments**: Endpoints for managing assignments, accessible by faculty for CRUD operations and by students for viewing.
3. **Quizzes**: Supports operations similar to assignments for quiz management.
4. **Grades**: Faculty can manage grades through these endpoints, while students can retrieve their own grade information.
5. **Announcements**: Allows faculty to create and update announcements that are broadcast to students.
6. **User Management**: Admin endpoints to manage user accounts, including creating new student or faculty profiles.

## API Endpoints

## Setup and Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>

   ```

2. Install dependencies:

   ```bash
   cd lms-api
   npm install

   ```

3. Start the development server:

   ```bash
   npm start

   ```
