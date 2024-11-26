<h1 align="center">
  PawPaw Pet Care
</h1>

### Kelompok PAW 11
| Name                            | NIM                |
| ------------------------------- | ------------------ |
| Iqbal Hidayat Rasyad            | 22/506066/TK/55425 |
| Adzka Bagus Juniarta            | 22/500276/TK/54824 |
| Bulan Aprilia Putri Murela      | 22/500326/TK/54834 |
| Christella Jesslyn Dewantara    | 22/493149/TK/54003 |
| Muhammad Zidane Septian Irsyadi | 22/504678/TK/55212 |

## Requirement

This project uses Next.js version 15 and requires Node.js version 18.18.0 or higher.

## Clone into your local directory with

```
git clone https://github.com/PAW11-oke/pawpaw.git
cd pawpaw
```

## Install the dependency

```
npm install
```
or
```bash
yarn install
```

## Setup dummy backend for upload
Make the `.env` file and fill in the actual values for the environment variables.

```bash
# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET="your_secret_key"

# MongoDB
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/your_database?retryWrites=true&w=majority

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email
EMAIL_PORT=your_port
EMAIL_AUTH_USER=your_email
EMAIL_AUTH_PASS=your_password

# Google OAuth
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret

# JWT
JWT_SECRET=your_jwt_secret
NODE_ENV=production
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3030](http://localhost:3030) with your browser to see the result.

## Tech Stack

**Auth & Session Management**: Gunakan JWT untuk aplikasi yang memerlukan otentikasi tanpa status (stateless) dan Redis untuk cache sesi jika aplikasi memerlukan sesi yang disimpan server.

**Database**: MongoDB, NoSQL sebagai penyimpanan data utama yang dapat disesuaikan dengan kebutuhan aplikasi.

**Media Handling**: Gunakan Cloudinary untuk manajemen gambar dan video.

**Caching**: Redis untuk caching data server dan React Query/SWR untuk caching data API di klien.

**Real-Time Features**: Socket.IO untuk notifikasi langsung atau live chat.
