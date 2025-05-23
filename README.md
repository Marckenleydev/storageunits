### landing page ui
![landing page ui](./assets/landing.jpg)
### units page ui
![units page ui](./assets/unitsdash.jpg)
### bookings page ui
![bookings page ui](./assets/bookingdash.jpg)
Before running this application, make sure you have the following installed:

Node.js (v18 or higher)
npm or yarn
PostgreSQL (v13 or higher)
Git

🚀 Installation

1. Clone the Repository
git clone https://github.com/Marckenleydev/storageunits.git
cd storageunits

2. Install Dependencies
Backend Dependencies
cd server
npm install

Frontend Dependencies
cd ../client
npm install

⚙️ Environment Setup
1. Backend Environment Variables
Create a .env file in the server directory:

cd server
cp .env

Add the following environment variables to server/.env:
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/storageunit?schema=public"

# Server
PORT=8080

2. Frontend Environment Variables
Create a .env.local file in the client directory:
cd ../client
cp  .env.local
Add the following to client/.env.local:
NEXT_PUBLIC_API_URL=http://localhost:8080

 Database Setup
1. Create PostgreSQL Database
bash# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE storageunit;

2. Run Database Migrations
cd server

# Generate Prisma client
npx prisma generate

Running the Application

Development Mode
1. Start the Backend Server
cd server
npm run dev
The backend server will start at http://localhost:8080

2. Start the Frontend Application
Open a new terminal:
bashcd client
npm run dev
The frontend application will start at http://localhost:3000