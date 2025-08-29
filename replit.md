# Overview

Synapse Soccer Prophet is a comprehensive football prediction and analysis web application that provides users with match predictions, league information, team standings, and player statistics. The application serves as a centralized dashboard for football data analysis, featuring a neural network-inspired branding and modern web interface.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Static Single Page Application (SPA)**: Built with vanilla JavaScript, HTML5, and CSS3
- **UI Framework**: Tailwind CSS for responsive design and styling
- **Icons**: Font Awesome for consistent iconography
- **Design Pattern**: Tab-based navigation with dynamic content rendering
- **Responsive Design**: Mobile-first approach using CSS Grid and Flexbox

## Backend Architecture
- **Server Framework**: Express.js (v5.1.0) serving as a lightweight REST API server
- **Architecture Pattern**: Simple MVC-like structure with separation of concerns
- **Static File Serving**: Express static middleware for frontend assets
- **API Design**: RESTful endpoints following `/api/{resource}` convention
- **Error Handling**: Basic try-catch blocks with JSON error responses

## Data Storage Solutions
- **File-Based Storage**: JSON files for data persistence
- **Data Structure**: Structured JSON files for different entities (matches, leagues, standings, players)
- **Data Location**: Centralized `/data` directory containing all application data
- **No Database**: Simple file system approach suitable for read-heavy operations

## Authentication and Authorization
- **Security Model**: Currently no authentication or authorization implemented
- **Access Control**: Open API endpoints without restrictions
- **Future Consideration**: System designed to easily accommodate authentication middleware

## API Structure
- **GET /api/matches**: Returns match fixtures with predictions and odds
- **GET /api/leagues**: Returns available football leagues and competitions
- **GET /api/standings**: Returns current league table standings
- **GET /api/players**: Returns player statistics and performance data
- **Fallback Route**: Serves main application for client-side routing

## Frontend Components
- **Tab Navigation**: Dynamic tab switching for different data views
- **Data Visualization**: Card-based layouts for matches, standings, and player stats
- **Responsive Grid**: Adaptive layouts for different screen sizes
- **Loading States**: Asynchronous data loading with error handling

# External Dependencies

## Core Dependencies
- **Express.js (^5.1.0)**: Web application framework for Node.js server
- **Node.js Built-in Modules**: 
  - `fs` for file system operations
  - `path` for file path utilities

## Frontend Libraries
- **Tailwind CSS (v2.2.19)**: Utility-first CSS framework via CDN
- **Font Awesome (v6.0.0)**: Icon library for UI elements via CDN

## Development Dependencies
- **npm**: Package management and script execution
- **No build tools**: Direct browser execution without compilation steps

## External Services
- **No external APIs**: Currently operates independently without third-party integrations
- **CDN Dependencies**: Relies on external CDNs for CSS frameworks and icon libraries
- **Future Integration Potential**: Architecture supports adding external football data APIs

## Data Sources
- **Static JSON Files**: All data currently stored in local JSON files
- **Manual Data Management**: Data updates require direct file modifications
- **Scalability Consideration**: File-based approach suitable for prototype/demo purposes