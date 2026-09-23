# Database Schema Documentation: Employee Management System

## 1. Overview
The **Employee Management System** uses **MongoDB Atlas**, a cloud-hosted NoSQL document database, with **Mongoose ODM** (Object Data Modeling) in Node.js. 

Because MongoDB is a schema-flexible document database, relational SQL migrations (such as `.sql` migration files) are not required. Instead, the document schema, validation rules, and default constraints are strictly defined and enforced at the application level via the Mongoose model in `backend/models/Employee.js`.

---

## 2. Database & Collection Details
- **Database Engine**: MongoDB Atlas (v7.0+)
- **Database Name**: Configured via connection URI (defaults to `test` or `employee_management`)
- **Collection Name**: `employees` (auto-pluralized by Mongoose from `Employee`)

---

## 3. Employee Document Schema

| Field Name | BSON / Mongoose Type | Required | Default / Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Yes (System) | Auto-generated 12-byte identifier | Unique identifier for each employee document. |
| `name` | `String` | Yes | `trim: true` | Employee's full name (e.g. `"Rahul Kumar"`). |
| `department`| `String` | Yes | `trim: true` | Department name (e.g. `"Engineering"`, `"Finance"`, `"HR"`). |
| `role` | `String` | Yes | `trim: true` | Employee's job title or designation (e.g. `"Software Developer"`). |
| `salary` | `Number` | Yes | `min: 1` | Monthly or annual salary. Must be a valid positive number. |
| `joinDate` | `String` | Yes | `trim: true`, ISO Date format (`YYYY-MM-DD`) | Date the employee joined the company. |
| `createdAt`| `Date` | Yes (System) | Auto-generated ISO Timestamp | Managed automatically by Mongoose `{ timestamps: true }`. |
| `updatedAt`| `Date` | Yes (System) | Auto-updated ISO Timestamp | Managed automatically by Mongoose `{ timestamps: true }`. |
| `__v` | `Number` | Yes (System) | Default `0` | Internal Mongoose document version key. |

---

## 4. Sample MongoDB Document
```json
{
  "_id": "6ab39a8f32f25f0b1227646d",
  "name": "Vaibhav Bajantri",
  "department": "Engineering",
  "role": "Software Engineer",
  "salary": 1000000,
  "joinDate": "2026-09-23",
  "createdAt": "2026-09-23T09:23:27.210Z",
  "updatedAt": "2026-09-23T09:23:27.210Z",
  "__v": 0
}
```

---

## 5. Mongoose Model Code (`backend/models/Employee.js`)
```javascript
const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Full Name is required'],
      trim: true,
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true,
    },
    salary: {
      type: Number,
      required: [true, 'Salary is required'],
      min: [1, 'Salary must be a valid positive number'],
    },
    joinDate: {
      type: String,
      required: [true, 'Join Date is required'],
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

module.exports = mongoose.model('Employee', employeeSchema);
```

---

## 6. How to Explain in an Interview
- **Why MongoDB?**: Document-based databases allow storing employee profiles in JSON-like BSON documents. If an employee record needs additional contact information or emergency contacts in the future, the schema can evolve without costly table alteration locks.
- **Validation Layers**: Validation occurs on two levels:
  1. **Frontend validation**: Immediate user feedback in the browser for empty inputs and numeric types.
  2. **Backend & ODM validation**: Express route handlers reject malformed JSON with `400 Bad Request`, and Mongoose enforces type integrity and positive number bounds before writing to the database.
- **Timestamps**: By passing `{ timestamps: true }`, Mongoose automatically records when the document was initially created and when any field was last modified.
