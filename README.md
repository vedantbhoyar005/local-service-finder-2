# Tap-a-Task 🛠️

Tap-a-Task is a comprehensive service booking platform that connects users with skilled local workers (plumbers, electricians, painters, and more). It features a modern, responsive user interface and offers specialized dashboards tailored for Users, Workers, and Administrators.

## 🌟 Features

- **Role-Based Authentication**: Secure access customized for Users, Workers, and Admins.
- **Service Discovery**: Easily search, filter, and discover local service providers.
- **Booking Management**: Real-time booking system allowing users to schedule tasks.
- **Rating & Reviews**: Users can leave 1-5 star ratings and reviews for workers after a completed service.
- **Interactive Dashboards**:
  - **User Dashboard**: Manage profiles, view past and upcoming bookings, and save addresses/payment methods.
  - **Worker Dashboard**: Track earnings, manage job requests, and view ratings.
  - **Admin Dashboard**: Oversee platform activity, manage workers, and configure available service categories.

## 💻 Tech Stack

- **Framework**: React 18 with [Vite](https://vitejs.dev/)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/) (Radix UI primitives)
- **Routing**: React Router DOM
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management & Toast**: React Hook Form, Sonner (for toast notifications)

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine. 
*Note: This project supports both `npm` and `bun` package managers.*

### Installation

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <repository-url>
   cd tap-a-task-main
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   bun install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

4. **Open your browser**:
   Navigate to `http://localhost:8080/` (or the port specified in your terminal) to view the application.

## 📂 Project Structure

```text
src/
├── components/     # Reusable UI components (including shadcn/ui)
├── data/           # Mock data for services, workers, and bookings
├── hooks/          # Custom React hooks (e.g., useAuth)
├── pages/          # Application pages/routes
│   ├── admin/      # Admin dashboard and management pages
│   ├── worker/     # Worker dashboard and profile pages
│   └── ...         # User and generic pages (Booking, Search, Auth, etc.)
├── App.tsx         # Main application routing and providers
└── index.css       # Global styles and Tailwind directives
```

## 📜 License

This project is open-source and available for use.
