# Project 2: Screenshots Directory

This directory stores the deliverables and screenshots required for the **Task 2: CRUD Employee Management System** internship submission.

## Required Screenshots

```text
screenshots/
├── 01-create.png       # Add Employee Modal Form & successful creation notification
├── 02-read.png         # Employee Directory table displaying records, search, & department filter
├── 03-update.png       # Edit Employee Modal Form with pre-filled employee data
├── 04-delete.png       # Delete Employee confirmation dialog modal
└── 05-mongodb.png      # MongoDB Atlas dashboard showing stored documents in test.employees
```

## How to Capture the Screenshots

1. **Start the backend server**:
   ```bash
   cd backend
   npm start
   ```
2. **Open the application**:
   Navigate to `http://localhost:5000` in Google Chrome or Microsoft Edge.

3. **Capture each stage**:
   - **`01-create.png`**: Click **"Add Employee"**, fill in the form fields, click **"Save Employee"**, and capture the screen showing the modal and the success alert banner.
   - **`02-read.png`**: Capture the full dashboard showing the employee directory table, search bar, and department dropdown.
   - **`03-update.png`**: Click the **"Edit"** button on any employee row to show the pre-filled modal form.
   - **`04-delete.png`**: Click the **"Delete"** button on any row to show the confirmation dialog modal.
   - **`05-mongodb.png`**: Open your [MongoDB Atlas](https://cloud.mongodb.com) cluster dashboard, navigate to **Database > Browse Collections > test > employees**, and capture the collection view showing the documents.
