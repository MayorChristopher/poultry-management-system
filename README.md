# Automated Poultry Management System

A full-stack web application designed to simulate and manage a poultry farm, providing real-time monitoring, automated controls, and comprehensive logging. Built with Next.js, Tailwind CSS, and Supabase, this system offers a clean interface for both general users and administrators.

## ✨ Features

*   **Clean and Professional Landing Page**: Introduces the project with a short description and navigation to the dashboard, sign-in, and registration.
*   **Supabase Authentication**: Secure user sign-up and login without email confirmation.
*   **Role-Based Access Control**: Users are assigned 'admin' or 'user' roles, with 'admin' roles having access to the control panel. Roles can be manually changed in the Supabase dashboard.
*   **Dynamic Dashboard**:
    *   Simulates and displays real-time sensor readings for Temperature, Humidity, Water Level, and Feed Level.
    *   Values update every 5 seconds with randomized mock data.
    *   Visual color-coded status indicators (green = safe, yellow = warning, red = critical).
    *   Charts for temperature and humidity trends over time.
*   **Activity Logs Page**:
    *   Displays a dynamic table of recent simulated events (feeding logs, environmental alerts, water/feed refill logs).
    *   Logs update automatically or when control actions are triggered.
*   **Admin Control Panel**:
    *   Accessible only to users with the 'admin' role.
    *   Buttons to activate feeder, refill water tank, start cooling system, and other simulated actions.
    *   Actions trigger new log entries with timestamps and simulated state changes.
*   **Supabase Storage Integration (Future Ready)**: Project setup includes a folder structure and bucket configuration for future image or file uploads (e.g., camera captures, maintenance logs).

## 🚀 Technologies Used

*   **Next.js**: React framework for building full-stack applications.
*   **React**: Frontend library for building user interfaces.
*   **Tailwind CSS**: Utility-first CSS framework for rapid styling.
*   **Supabase**: Open-source Firebase alternative for:
    *   Authentication (Email/Password)
    *   PostgreSQL Database (for user profiles and logs)
    *   Storage (for future file uploads)
*   **Lucide React**: Icon library for modern and clean icons.

## ⚙️ Setup and Installation

Follow these steps to get your project up and running locally and deployed to Vercel.

### 1. Clone the Repository

\`\`\`bash
git clone <your-repository-url>
cd automated-poultry-system
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
# or
yarn install
# or
pnpm install
\`\`\`

### 3. Supabase Project Setup

If you don't have a Supabase project, create one at [Supabase](https://supabase.com/).

#### a. Configure Environment Variables

Create a `.env.local` file in the root of your project and add your Supabase credentials:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
\`\`\`

**Important**: For production deployments on Vercel, you must also add these environment variables directly in your Vercel project settings.

#### b. Run Database Schema Script

Go to your Supabase project dashboard, navigate to the **SQL Editor**, and run the contents of the `db/schema.sql` file. This will create the `profiles` and `logs` tables, set up Row Level Security (RLS), and create a trigger to automatically create a profile for new users.

### 4. Run the Application Locally

\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### 5. Admin Access

After registering a new user through the application, their default role will be 'user'. To grant 'admin' access (which unlocks the Control Panel):

1.  Go to your Supabase project dashboard.
2.  Navigate to the **Table Editor**.
3.  Select the `profiles` table.
4.  Find the row corresponding to the user you wish to make an admin.
5.  Change the `role` column value from `'user'` to `'admin'`.

## ☁️ Deployment

This project is designed for easy deployment on [Vercel](https://vercel.com/).

1.  Push your code to a Git repository (GitHub, GitLab, Bitbucket).
2.  Import your repository into Vercel.
3.  Ensure you have set the `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` environment variables in your Vercel project settings.
4.  Vercel will automatically detect the Next.js framework and deploy your application.

## 🛣️ Future Enhancements

*   **Real-time Notifications**: Implement toast notifications for critical alerts or control action confirmations.
*   **User Management Interface**: An admin panel to manage user roles directly within the application.
*   **Data Export**: Functionality to export sensor data and logs to CSV or other formats.
*   **Customizable Settings**: Allow admins to configure sensor thresholds and alert preferences.
*   **Image/File Uploads**: Fully integrate Supabase Storage for camera captures or maintenance log attachments.
*   **Historical Data View**: More advanced charting and filtering for long-term data analysis.
