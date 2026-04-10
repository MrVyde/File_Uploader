# Express + Prisma File Uploader
## Overview
A Node.js project using Express, Prisma, and Passport.js with Supabase as the PostgreSQL database. The app supports session-based authentication, folder management, and file uploads with validation. Files are stored locally for now, with cloud storage integration (Cloudinary or Supabase Storage) planned.
This project is deployed and hosted on Render, ensuring reliable uptime and performance. You can access the live application through the link above to explore its full functionality.




## Deployment
**Live Demo:** [View File_Uploader on Render](https://file-uploader-ok0w.onrender.com)

Database: Supabase (already configured)
Hosting: Render

### Demo Credentials

##### To facilitate easy access and testing, you can use the following demo credentials:

Email: ddgdd@gmail.com

Password: qwerty

These credentials allow you to log in and explore the application's features without needing to create an account.

### File Validation and Security

This project includes robust file validation to ensure that only allowed file types and sizes are accepted. This prevents unauthorized or potentially harmful files from being uploaded, demonstrating a strong focus on security and reliability. The validation logic is a key feature that sets this project apart from ordinary file uploaders, showcasing thoughtful design and professional-grade safeguards.


## Features
Session-based authentication using Passport.js

Prisma session store to persist sessions in Supabase

Multer middleware for file uploads

CRUD operations for folders

Upload files into folders

View file details (name, size, upload time)

Download files

Save file URLs in the database for cloud storage

File validation (type/size restrictions)

Share folder functionality with expiring links

## Setup
Clone the repository.

### Install dependencies:

npm install express prisma @prisma/client passport passport-local express-session connect-prisma-session multer

### Configure environment variables in .env:
DATABASE_URL="postgresql://postgres:[PASSWORD]@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?schema=file_uploader"
SESSION_SECRET="your-secret"

### Initialize Prisma:

npx prisma migrate deploy

### Start the server:
npm run dev

This project sets the foundation for a secure file uploader with folder management, ready to extend with cloud storage integration.

