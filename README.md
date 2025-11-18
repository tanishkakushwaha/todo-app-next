# Task Management Application

A full-stack task management application built with Next.js, featuring server actions, React Query, PostgreSQL, and Docker support.

## Features

- ✅ Create, view, update, and delete tasks
- ✅ Toggle task status (pending/completed)
- ✅ Responsive UI with Tailwind CSS
- ✅ Real-time data synchronization with React Query
- ✅ Server-side actions with Next.js
- ✅ PostgreSQL database with Prisma ORM
- ✅ Comprehensive test coverage with Jest
- ✅ Dockerized for easy deployment

## Technology Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS
- **Backend**: Next.js Server Actions
- **Database**: PostgreSQL with Prisma ORM
- **State Management**: React Query (TanStack Query)
- **Testing**: Jest
- **DevOps**: Docker & Docker Compose

## Prerequisites

- Node.js 20 or higher
- PostgreSQL 16 or higher (or use Docker)
- Yarn or npm package manager

## Setup Instructions

### Option 1: Local Development (Without Docker)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd assignment
   ```

2. **Install dependencies**
   ```bash
   yarn install
   # or
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and update the `DATABASE_URL`:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/taskdb?schema=public"
   ```

4. **Set up PostgreSQL database**
   
   Make sure PostgreSQL is running locally. Create a database:
   ```sql
   CREATE DATABASE taskdb;
   ```

5. **Run database migrations**
   ```bash
   yarn db:generate
   yarn db:push
   # or
   npm run db:generate
   npm run db:push
   ```

6. **Start the development server**
   ```bash
   yarn dev
   # or
   npm run dev
   ```

7. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Option 2: Docker Development

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

   This will:
   - Start a PostgreSQL container
   - Build and start the Next.js application
   - Automatically run database migrations

2. **Access the application**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Option 3: Docker Production Build

1. **Build the Docker image**
   ```bash
   docker build -t task-app .
   ```

2. **Run the container**
   ```bash
   docker run -p 3000:3000 \
     -e DATABASE_URL="postgresql://postgres:postgres@host.docker.internal:5432/taskdb?schema=public" \
     task-app
   ```

## Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn test` - Run tests
- `yarn test:watch` - Run tests in watch mode
- `yarn db:generate` - Generate Prisma Client
- `yarn db:push` - Push schema changes to database
- `yarn db:migrate` - Run database migrations
- `yarn db:studio` - Open Prisma Studio (database GUI)

## Project Structure

```
assignment/
├── app/
│   ├── actions/
│   │   └── task-actions.ts      # Server actions for CRUD operations
│   ├── components/
│   │   ├── task-form.tsx         # Task creation form
│   │   └── task-list.tsx         # Task list display
│   ├── layout.tsx                # Root layout with React Query provider
│   ├── page.tsx                  # Main page
│   └── globals.css               # Global styles
├── lib/
│   ├── prisma.ts                 # Prisma client instance
│   └── react-query-provider.tsx  # React Query provider setup
├── prisma/
│   └── schema.prisma             # Database schema
├── __tests__/
│   └── task-actions.test.ts      # Unit tests for server actions
├── Dockerfile                    # Docker configuration
├── docker-compose.yml            # Docker Compose setup
└── package.json                  # Dependencies and scripts
```

## API/Server Actions

All backend operations are handled through Next.js Server Actions:

- `getTasks()` - Fetch all tasks
- `createTask(title, description?)` - Create a new task
- `updateTaskStatus(id, status)` - Update task status
- `deleteTask(id)` - Delete a task

## Database Schema

The `Task` model includes:
- `id` (String, CUID) - Unique identifier
- `title` (String) - Task title (required)
- `description` (String, optional) - Task description
- `status` (String) - Task status: "pending" or "completed"
- `createdAt` (DateTime) - Creation timestamp
- `updatedAt` (DateTime) - Last update timestamp

## Testing

Run the test suite:
```bash
yarn test
```

Run tests in watch mode:
```bash
yarn test:watch
```

The test suite includes unit tests for all server actions, covering:
- Task creation
- Task retrieval
- Status updates
- Task deletion
- Error handling

## Development

### Adding New Features

1. Update the Prisma schema if database changes are needed
2. Run `yarn db:push` to apply schema changes
3. Create server actions in `app/actions/`
4. Create React components in `app/components/`
5. Add tests in `__tests__/`

### Database Management

- **Prisma Studio**: Run `yarn db:studio` to open a GUI for database management
- **Migrations**: Use `yarn db:migrate` for production migrations
- **Schema Changes**: Use `yarn db:push` for development schema updates

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Add the `DATABASE_URL` environment variable
4. Deploy

### Docker

1. Build the image: `docker build -t task-app .`
2. Run with proper environment variables
3. Ensure PostgreSQL is accessible

## Troubleshooting

### Database Connection Issues

- Verify PostgreSQL is running
- Check `DATABASE_URL` in `.env`
- Ensure database exists: `CREATE DATABASE taskdb;`

### Prisma Client Issues

- Run `yarn db:generate` after schema changes
- Delete `node_modules/.prisma` and regenerate if needed

### Docker Issues

- Ensure Docker and Docker Compose are installed
- Check container logs: `docker-compose logs`
- Verify ports 3000 and 5432 are available

## License

This project is created for assessment purposes.

## Author

I have used AI To generate readme file, hope its acceptable, thank u for giving me this opportunity sir. I have all the base concepts clear, lets talk in an interview so that you can further judge my technical skills
