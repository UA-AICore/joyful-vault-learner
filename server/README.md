
# Vault Learning Backend API

This is the backend API for Vault Learning, an AI-powered web app that helps educators, therapists, and interventionists create engaging learning activities for children with learning disabilities.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A Supabase account and project

### Installation

1. Clone the repository
2. Navigate to the server directory
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file based on `.env.example` and add your Supabase credentials:
   ```
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   PORT=3001
   NODE_ENV=development
   ```

### Running the Server

Development mode:
```
npm run dev
```

Production mode:
```
npm start
```

## API Endpoints

### Activities

- `GET /api/activities` - Get all activities
- `GET /api/activities/:id` - Get a single activity
- `POST /api/activities` - Create a new activity
- `PUT /api/activities/:id` - Update an activity
- `DELETE /api/activities/:id` - Delete an activity

### Search

- `POST /api/search` - Search activities with filters

### Admin

- `GET /api/admin/categories` - Get all categories
- `POST /api/admin/categories` - Create a new category
- `DELETE /api/admin/categories/:id` - Delete a category
- `GET /api/admin/materials` - Get all materials
- `POST /api/admin/materials` - Create a new material
- `DELETE /api/admin/materials/:id` - Delete a material

## Project Structure

```
server/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Custom middleware
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   └── index.js        # Entry point
├── .env.example        # Example environment variables
├── package.json        # Dependencies and scripts
└── README.md           # Documentation
```

## Database Schema

The API uses Supabase (PostgreSQL) with the following tables:

- `activities` - Learning activities
- `categories` - Activity categories
- `materials` - Materials for activities

## Error Handling

The API uses a global error handler middleware that returns standardized error responses.
