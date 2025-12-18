# Course Management System

A full-stack web application designed to manage course offerings and their delivery instances. The system provides comprehensive CRUD operations for courses, handles prerequisite relationships, and manages course delivery instances across different years and semesters.

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Key Features](#-key-features)
- [Design Decisions](#-design-decisions)
- [Database Design](#-database-design)
- [API Endpoints](#-api-endpoints)
- [Docker Deployment](#-docker-deployment)
- [CI/CD Pipeline](#-cicd-pipeline)
- [Project Structure](#-project-structure)
- [Useful Links](#-useful-links)

## 🎯 Project Overview

The Course Management System is a full-stack application that enables efficient management of academic courses and their delivery instances. It supports complex prerequisite relationships and provides a user-friendly interface for course administration.

### Key Features

- 📚 **Course Management** - Create, read, update, and delete courses with prerequisite handling
- 🔄 **Prerequisite Relationships** - Manage complex course dependencies
- 📅 **Instance Management** - Handle course delivery instances across different years and semesters
- 🎨 **Responsive UI** - Modern, user-friendly web interface built with React and Tailwind CSS
- 🔒 **Validation** - Comprehensive input validation and error handling
- 🐳 **Containerization** - Docker support for consistent deployment
- 🚀 **CI/CD** - Automated deployment pipeline with GitHub Actions

## 🏗️ Architecture

### System Architecture

![image](https://github.com/saksy25/frontendApp-iitb/issues/1#issue-3743212509)

The application follows a three-tier architecture with clear separation of concerns:
- **Presentation Layer**: React frontend with Tailwind CSS
- **Business Logic Layer**: Spring Boot REST API
- **Data Layer**: MySQL database with JPA/Hibernate

## 🚀 Tech Stack

### Backend
- **Java 17** - Programming language
- **Spring Boot** - Application framework
- **Spring Data JPA** - Data persistence layer
- **Spring Web** - RESTful web services
- **Maven** - Build management
- **MySQL 8.0** - Relational database

### Frontend
- **React + Vite** - UI library and build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **React Hooks** - State management

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **GitHub Actions** - CI/CD pipeline
- **DockerHub** - Container registry

## 💡 Design Decisions

### Why Spring Boot?
- Mature ecosystem with extensive documentation
- Built-in features for REST API development
- Excellent Spring Data JPA integration
- Robust security and validation framework
- Easy testing with Spring Boot Test

### Why React?
- Component-based architecture for reusability
- Large ecosystem and community support
- Excellent developer experience with modern tooling
- Easy state management and API integration

### Why MySQL?
- ACID compliance ensuring data integrity and consistency
- Mature and stable database system
- Excellent performance for both read and write operations
- Strong support for complex relationships with foreign key constraints
- Easy integration with Spring Boot through Spring Data JPA
- Reliable replication and backup capabilities

## 🗄️ Database Design

### Entity Relationship Diagram

![image](https://github.com/saksy25/frontendApp-iitb/issues/2#issue-3743228839)

### Database Tables

#### 1. courses
- `id` - Primary Key (BIGINT, Auto-increment)
- `title` - Course title (VARCHAR, NOT NULL)
- `course_code` - Unique course identifier (VARCHAR, UNIQUE, NOT NULL)
- `description` - Course description (TEXT)

#### 2. course_instances
- `id` - Primary Key (BIGINT, Auto-increment)
- `course_id` - Foreign Key to courses (BIGINT, NOT NULL)
- `year` - Academic year (INTEGER, NOT NULL)
- `semester` - Semester number (INTEGER, NOT NULL, CHECK: 1-2)

#### 3. course_prerequisites
- `course_id` - Foreign Key to courses (BIGINT)
- `prerequisite_id` - Foreign Key to courses (BIGINT)

### Database Constraints
- Unique constraint on `course_code`
- Check constraint on `semester` (values: 1 or 2)
- Foreign key constraints on all relationship fields
- Composite unique constraint on `(course_id, year, semester)` for instances

## 🔌 API Endpoints

### Course Endpoints

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| POST | `/api/courses` | Create a new course | 201 Created |
| GET | `/api/courses` | Retrieve all courses with prerequisites | 200 OK |
| GET | `/api/courses/{id}` | Retrieve specific course | 200 OK |
| DELETE | `/api/courses/{id}` | Delete a course (if no dependencies) | 200 OK / 400 Bad Request |

### Instance Endpoints

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| POST | `/api/instances` | Create new course instance | 201 Created |
| GET | `/api/instances/{year}/{semester}` | List instances for year/semester | 200 OK |
| GET | `/api/instances/{year}/{semester}/{courseId}` | Get specific instance details | 200 OK |
| DELETE | `/api/instances/{year}/{semester}/{courseId}` | Delete specific instance | 200 OK |

### HTTP Status Codes
- **200 OK** - Successful operations
- **201 Created** - Resource creation
- **204 No Content** - No records found
- **400 Bad Request** - Validation errors
- **500 Internal Server Error** - Server/network issues

### Sample API Requests

**Create Course:**
```json
POST /api/courses
{
  "title": "Data Structures and Algorithms",
  "course_code": "CS201",
  "description": "Advanced data structures and algorithm design",
  "prerequisites": ["CS101"]
}
```

**Create Instance:**
```json
POST /api/instances
{
  "courseId": "CS201",
  "year": 2024,
  "semester": 1
}
```

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/saksy25/backendApp-iitb.git
   cd backendApp-iitb
   ```

2. **Run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

This starts:
- MySQL database on port 3306
- Backend API on port 8080
- Frontend app on port 5173

### Docker Compose Configuration

```yaml
services:
  # MySQL Database
  mysql:
    image: mysql:8.0
    container_name: mysql-db
    environment:
      MYSQL_ROOT_PASSWORD: your_password
      MYSQL_DATABASE: courses_db
    ports:
      - "3306:3306"
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      timeout: 10s
      retries: 10

  # Backend Service
  backend:
    image: saksy20/backend-app:latest
    container_name: spring-backend
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/courses_db
      SPRING_DATASOURCE_USERNAME: root
      SPRING_DATASOURCE_PASSWORD: your_password
    ports:
      - "8080:8080"
    depends_on:
      mysql:
        condition: service_healthy

  # Frontend Service
  frontend:
    image: saksy20/frontend-app:latest
    container_name: react-frontend
    ports:
      - "5173:80"
    depends_on:
      - backend
```

### Individual Docker Commands

**Backend:**
```bash
docker build -t course-backend .
docker run -p 8080:8080 course-backend
```

**Frontend:**
```bash
docker build -t course-frontend .
docker run -p 5173:80 course-frontend
```

## 🚀 CI/CD Pipeline

GitHub Actions workflow automates the deployment process:

### Pipeline Stages
1. **Code Checkout** - Pull latest code from repository
2. **Run Tests** - Execute unit and integration tests
3. **Build Docker Images** - Create Docker images for backend and frontend
4. **Push to DockerHub** - Upload images to container registry
5. **Deploy** - Deploy to staging/production environments

### Workflow Configuration
Located in `.github/workflows/deploy.yml`

## 📁 Project Structure

### Backend Structure
```
backendApp-iitb/
├── src/
│   ├── main/
│   │   ├── java/com/iitbombay/courses-api/
│   │   │   ├── controller/
│   │   │   │   └── CourseController.java
│   │   │   ├── dto/
│   │   │   │   ├── CourseDto.java
│   │   │   │   └── CourseInstanceDto.java
│   │   │   ├── entity/
│   │   │   │   ├── Course.java
│   │   │   │   └── CourseInstance.java
│   │   │   ├── exception/
│   │   │   │   ├── CourseDependencyException.java
│   │   │   │   ├── CourseInstanceNotFoundException.java
│   │   │   │   ├── GlobalExceptionHandler.java
│   │   │   │   └── InvalidPrerequisiteException.java
│   │   │   ├── repository/
│   │   │   │   ├── CourseRepository.java
│   │   │   │   └── CourseInstanceRepository.java
│   │   │   └── service/
│   │   │       └── CourseService.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
│       └── java/com/iitbombay/courses-api/
│           └── CoursesApiApplicationTests.java
├── Dockerfile
├── docker-compose.yml
└── pom.xml
```

### Frontend Structure
```
frontendApp-iitb/
├── src/
│   ├── components/
│   │   ├── Course.jsx
│   │   └── Instance.jsx
│   ├── pages/
│   │   └── CourseApp.jsx
│   ├── App.jsx
│   └── main.jsx
├── public/
├── Dockerfile
└── package.json
```

### Key Backend Components

**Service Layer:**
- Validates prerequisite existence before course creation
- Checks dependency constraints before deletion
- Handles prerequisite relationship management
- Manages course delivery instances
- Validates course existence before instance creation

**Exception Handling:**
- Custom exceptions for specific error cases
- Global exception handler for consistent error responses
- Proper HTTP status codes for all scenarios

### Key Frontend Components

**Course Management:**
- `CourseForm` - Multiple selection for prerequisites
- `CourseList` - Displays courses with prerequisites
- `CourseDetails` - Shows detailed course information

**Instance Management:**
- `InstanceForm` - Creates course delivery instances with dropdown selection
- `InstanceList` - Filters by year and semester
- `InstanceDetails` - Shows instance-specific information

**State Management:**
- React hooks (useState, useEffect) for local state
- Context API for global state management
- Custom hooks for API integration

## 🔗 Useful Links

- **Frontend Repository**: [github.com/saksy25/frontendApp-iitb](https://github.com/saksy25/frontendApp-iitb)
- **Backend Repository**: [github.com/saksy25/backendApp-iitb](https://github.com/saksy25/backendApp-iitb)
- **LinkedIn Profile**: [Sakshi Salunke](http://www.linkedin.com/in/sakshi-salunke-758014273)
- **DockerHub Images**: 
  - Backend: `saksy20/backend-app:latest`
  - Frontend: `saksy20/frontend-app:latest`

## 🎓 Conclusion

The Course Management System is a well-designed full-stack application that follows best practices for clean architecture, validation, and user experience. It effectively handles course prerequisites, errors, and user input. Docker containerization and CI/CD pipelines ensure smooth and consistent deployment across all environments.
