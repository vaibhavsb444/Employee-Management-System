# Employee Management System

## Objective
Develop a full-featured, responsive web application that allows HR administrators to manage employee records through a clean, functional interface backed by a cloud database. The system implements a complete CRUD (Create, Read, Update, Delete) workflow with real-time searching, department filtering, multi-column sorting, input validation, and direct persistence in MongoDB Atlas.

---

## Features
- **Create Employee**: Add new employee records with frontend and backend input validation.
- **Read & Directory View**: Searchable, filterable, and sortable tabular display of employee records fetched live from MongoDB Atlas.
- **Update Employee**: Edit existing records with an intuitive pre-filled modal form.
- **Delete with Confirmation**: Safe deletion workflow requiring user confirmation dialog before removal.
- **Live Search & Filter**: Real-time searching across names, roles, and departments, plus a department dropdown filter.
- **Multi-Column Sorting**: Interactive sorting by Name, Department, Role, Salary, or Join Date.
- **UI States & Feedback**:
  - Interactive loading spinner during asynchronous network requests.
  - Descriptive empty state when no employee matches the search criteria.
  - Contextual button feedback (`Saving...`, `Updating...`, `Deleting...`).
  - Toast alert banners for success operations and actionable error alerts.
- **Responsive Layout**: Designed and verified across desktop (1440px), laptop (1024px), tablet (768px), and mobile (390px) screens.

---

## Tech Stack
- **Frontend**:
  - HTML5 (Semantic markup)
  - CSS3 (Vanilla CSS with custom design tokens, Flexbox, and CSS Grid)
  - JavaScript (ES6+ `async`/`await`, Fetch API, dynamic DOM manipulation)
  - Font Awesome 6 (Vector icons)
- **Backend**:
  - Node.js (Asynchronous runtime environment)
  - Express.js (REST API framework and static asset hosting)
  - Mongoose (Object Data Modeling and schema validation)
  - cors (Cross-Origin Resource Sharing middleware)
  - dotenv (Environment configuration)
- **Database**:
  - MongoDB Atlas (Cloud NoSQL document database)
- **API Testing**:
  - Postman / Thunder Client (Full test collection included)

---

## Project Structure
```text
Project_2_Employee_Management/
│
├── backend/
│   ├── models/
│   │   └── Employee.js            # Mongoose schema and model
│   ├── routes/
│   │   └── employeeRoutes.js      # Express REST API CRUD route handlers
│   ├── .env                       # Local environment variables (git-ignored)
│   ├── .env.example               # Environment variables template
│   ├── .gitignore                 # Backend gitignore
│   ├── package.json               # Backend dependencies & scripts
│   └── server.js                  # Express application entry point
│
├── frontend/
│   ├── index.html                 # Administrative dashboard interface & modals
│   ├── style.css                  # Administrative theme styles
│   └── script.js                  # Frontend REST API client & UI logic
│
├── screenshots/
│   ├── 01-create.png              # Add Employee form & creation notification
│   ├── 02-read.png                # Employee directory table with search/filter
│   ├── 03-update.png              # Edit Employee modal with pre-filled fields
│   ├── 04-delete.png              # Delete confirmation dialog modal
│   ├── 05-mongodb.png             # MongoDB Atlas dashboard showing test.employees
│   └── README.md                  # Screenshot capture guide
│
├── Employee_Management_API.postman_collection.json # Postman CRUD collection (root)
├── database-schema.md             # MongoDB schema documentation
├── .env.example                   # Root environment variable template
├── .gitignore                     # Root gitignore
└── README.md                      # Comprehensive documentation
```

---

## Prerequisites
Before running the project, ensure you have:
- [Node.js](https://nodejs.org/) (v16.0.0 or higher recommended)
- [npm](https://www.npmjs.com/) (bundled with Node.js)
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account with an active cluster
- [Postman](https://www.postman.com/) or the VS Code [Thunder Client](https://www.thunderclient.com/) extension (optional, for API testing)

---

## MongoDB Atlas Setup
1. Log in to [MongoDB Atlas](https://cloud.mongodb.com).
2. Create or navigate to your free M0 cluster.
3. Under **Security > Database Access**:
   - Create a database user with password authentication and read/write privileges.
4. Under **Security > Network Access**:
   - Add your IP address or `0.0.0.0/0` (allow access from anywhere for development).
5. Click **Connect > Drivers > Node.js**:
   - Copy the connection URI string.

---

## Environment Variables
Create a file named `.env` inside the `backend/` directory based on `.env.example`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database>?retryWrites=true&w=majority
```

> ⚠️ **IMPORTANT SECURITY NOTICE:**
> Never commit your real `.env` file or expose your MongoDB username and password to GitHub or public repositories. The `.env` file is excluded via `.gitignore`.

---

## Installation
Open your terminal and navigate to the backend directory:

```bash
cd Week2_Internship/Project_2_Employee_Management/backend
npm install
```

---

## Run Backend
Start the Express REST API server:

```bash
npm start
```
*(Or use `node server.js` / `npm run dev`)*

Upon successful launch, the terminal displays:
```text
Connecting to MongoDB Atlas...
✅ Successfully connected to MongoDB Atlas database!
🚀 Employee Management Server running on http://localhost:5000
📡 API Endpoints available at: http://localhost:5000/api/employees
🌐 Frontend accessible at: http://localhost:5000
```

---

## How to Open Frontend
Once the backend server is running:
- Open your web browser and navigate to: **`http://localhost:5000`**
- The Express backend serves the `frontend/` files directly.
- Alternatively, you can open `frontend/index.html` via any local server, as CORS is enabled on the backend.

---

## API Endpoints

| Method | Endpoint | Description | Status Codes |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/health` | Check server and database connection status | `200 OK` |
| **GET** | `/api/employees` | Retrieve all employees (supports `?search=`, `?department=`, `?sort=`) | `200 OK`, `500 Server Error` |
| **GET** | `/api/employees/:id` | Retrieve single employee by MongoDB ObjectId | `200 OK`, `400 Bad Request`, `404 Not Found` |
| **POST** | `/api/employees` | Create a new employee record | `201 Created`, `400 Bad Request`, `500 Server Error` |
| **PUT** | `/api/employees/:id` | Update an existing employee record | `200 OK`, `400 Bad Request`, `404 Not Found` |
| **DELETE** | `/api/employees/:id` | Delete an employee record | `200 OK`, `400 Bad Request`, `404 Not Found` |

### Required Employee Schema
```json
{
  "name": "Rahul Kumar",
  "department": "Engineering",
  "role": "Software Developer",
  "salary": 35000,
  "joinDate": "2026-09-23"
}
```

---

## CRUD Operations & How to Use

### 1. Create (Add Employee)
- Click the **"Add Employee"** button in the header to open the modal form.
- Fill out all required fields:
  - **Full Name**: Non-empty string.
  - **Department**: Selected from dropdown.
  - **Role**: Job designation string.
  - **Salary**: Numeric value $> 0$.
  - **Join Date**: Valid date.
- Click **"Save Employee"**. The request sends a `POST /api/employees` call. On success, the modal closes, a toast banner confirms creation, and the table automatically updates.

### 2. Read (Employee Directory)
- On page load, `GET /api/employees` fetches all stored records.
- Records are displayed in a clean tabular view showing Name, Department, Role, Salary, and Join Date.
- **Search**: Type in the search box to filter records in real-time across name, department, or role.
- **Filter**: Choose a department from the dropdown to narrow down results.
- **Sort**: Click column headers (`Name`, `Department`, `Role`, `Salary`, `Join Date`) to toggle ascending/descending order.

### 3. Update (Edit Employee)
- Click the **"Edit"** button on any employee row.
- The modal form opens with the employee's existing values pre-filled.
- Modify the desired fields and click **"Update Employee"**.
- A `PUT /api/employees/:id` request is sent to the backend. The document is updated in MongoDB Atlas and immediately reflected in the table.

### 4. Delete (Delete Employee)
- Click the **"Delete"** button next to an employee.
- A confirmation dialog modal appears asking for explicit confirmation.
- Clicking **"Cancel"** closes the modal without changes.
- Clicking **"Delete Employee"** sends a `DELETE /api/employees/:id` request. The record is permanently removed from MongoDB Atlas and removed from the UI.

---

## Testing with Postman or Thunder Client

The project includes a ready-to-import Postman collection:
[`Employee_Management_API.postman_collection.json`](Employee_Management_API.postman_collection.json)

1. Open Postman or VS Code Thunder Client.
2. Click **Import** and select `Employee_Management_API.postman_collection.json`.
3. Set the collection variable:
   - `baseUrl`: `http://localhost:5000`
   - `employeeId`: A valid MongoDB `_id` from your database
4. Available pre-configured requests:
   - **1. GET All Employees**: `GET {{baseUrl}}/api/employees`
   - **2. GET Employee by ID**: `GET {{baseUrl}}/api/employees/{{employeeId}}`
   - **3. POST Employee**: `POST {{baseUrl}}/api/employees` (with JSON body)
   - **4. PUT Employee**: `PUT {{baseUrl}}/api/employees/{{employeeId}}` (with JSON body)
   - **5. DELETE Employee**: `DELETE {{baseUrl}}/api/employees/{{employeeId}}`
   - **6. GET Search & Filter**: `GET {{baseUrl}}/api/employees?search=Rahul&department=Engineering`
   - **7. GET Health Check**: `GET {{baseUrl}}/api/health`

---

## MongoDB Details
Employee records are persisted directly in **MongoDB Atlas**:
- **Database**: Configured via connection string (default database: `test`)
- **Collection**: `employees`
- **Schema Reference**: Refer to [`database-schema.md`](database-schema.md) for full field definitions, types, and constraints.

---

## GitHub Safety Instructions
- **Never commit `.env`**: The real `.env` file contains sensitive cloud database credentials and must never be pushed to version control.
- **Verify `.gitignore`**: Ensure `.env` and `node_modules/` are included in `.gitignore`.
- **Use `.env.example`**: Always share only the placeholder template `backend/.env.example` with teammates or evaluators.
- **Before pushing**: Run `git status` to verify that `.env` is listed under untracked files or ignored completely.

---

## Troubleshooting Common Errors

### 1. `MongooseServerSelectionError: connect ECONNREFUSED` / Timeout
- **Cause**: MongoDB Atlas Network Access is blocking your IP address.
- **Fix**: Go to MongoDB Atlas > Network Access > click **Add IP Address** > choose **Allow Access from Anywhere (`0.0.0.0/0`)** for development.

### 2. `Database is not connected` API response
- **Cause**: Missing or incorrect `MONGODB_URI` in `backend/.env`.
- **Fix**: Check `backend/.env` and ensure the connection string format matches:
  `MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.../test?retryWrites=true&w=majority`

### 3. Port 5000 Already in Use (`EADDRINUSE`)
- **Cause**: Another node process or service is occupying port 5000.
- **Fix**: Terminate the existing process:
  ```powershell
  # Windows PowerShell
  Stop-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess -Force
  ```

### 4. CORS Errors When Opening `index.html` Locally
- **Cause**: Running frontend from a different port or file protocol.
- **Fix**: Open `http://localhost:5000` directly in the browser so frontend and API are served from the same origin, or rely on the enabled CORS middleware in `server.js`.

---

## Screenshots Deliverables Note
> ℹ️ **Important Note:**
> All final project screenshots (`01-create.png`, `02-read.png`, `03-update.png`, `04-delete.png`, and `05-mongodb.png`) will be captured and added manually by the developer/author into the `screenshots/` directory during live project demonstration. No automated or placeholder images are used.

