# Student Management System — Client

## Prerequisites
- Node.js installed
- API server must be running on http://localhost:5000

## How to Start the Client

### Option 1 — VS Code Live Server (Recommended)
1. Open the project in VS Code
2. Right-click `client/index.html`
3. Click **"Open with Live Server"**
4. Client opens at `http://127.0.0.1:5500/client/index.html`

### Option 2 — Using serve
```bash
npm install -g serve
cd client
serve .
```
Then open `http://localhost:3000`

## How to Start the API
```bash
# From project root
npm run dev
```
API runs at `http://localhost:5000`

## How to Run Tests
```bash
# From project root
npm test
```
Requires Brave browser installed at:
`C:/Users/don48/AppData/Local/BraveSoftware/Brave-Browser/Application/brave.exe`

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/students | Get all students |
| GET | /api/students/:id | Get student by ID |
| POST | /api/students | Create new student |
| PUT | /api/students/:id | Update student |
| DELETE | /api/students/:id | Delete student |

## Features
- View all students in a table
- Add new students via form
- Edit existing student records
- Delete students
- Live search by name, course or email
- Stats dashboard showing totals and averages
- API documentation at `http://localhost:5000/docs`