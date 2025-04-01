# npm install express mssql body-parser cors multer dotenv

# API Guide

This guide provides information on the available API endpoints, including sample requests and payloads.

## NGROK Routing Command

**Ngrok Url**

```
https://outgoing-troll-neatly.ngrok-free.app
```

**Ngrok Start Routing Command**

```
ngrok http --url=outgoing-troll-neatly.ngrok-free.app 3000
```

**Ngrok Secure Start Routing Command**

```
ngrok http --url=outgoing-troll-neatly.ngrok-free.app 3000 --basic-auth="username:password"
```

## Sql to get Table Schema

```
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Users'
```

## Endpoints

### 1. Test Query Endpoint

**Endpoint:** `POST /test`

**Description:** Run sql on database.

**Sample Request:**

```
POST http://localhost:3000/test
Content-Type: application/json

{
  "query": "SELECT * FROM dbo.Complaint WHERE CONVERT(DATE, created_at) <= CONVERT(DATE, GETDATE())"
}

```

### 2. Login

**Endpoint:** `POST /user/login`

**Description:** User Login.

**Sample Request:**

```
POST http://localhost:3000/user/login
Accept: application/json
Content-Type: application/json

{
"username": "admin",
"password": "password123"
}

```

### 3. Create a New Complaint

**Endpoint:** `POST /complaints`

**Description:** Inserts a new complaint into complaint table, resolution table, resolution_history table.

**Sample Request:**

```
POST http://localhost:3000/complaints
Content-Type: application/json

{
  "newspaper_name": "EENADU",
  "publication_date": "2025-03-28",
  "issue_category": "HEALTH",
  "issue_description": "Recent studies highlight the importance of mental health awareness in rural communities.",
  "deadline_dt": "2025-04-04"
}
```

### 4. Update Resolution Data

**Endpoint:** `PUT /resolutions`

**Description:** Update resolution and inserts a new history.

**Sample Request:**

```
PUT http://localhost:3000/resolutions
Content-Type: application/json

{
  "complaint_id": 61,
  "status": "Resolved",
  "action_taken": "Description of the action taken",
  "resolution_date": "2023-01-02",
  "resolution_proof_path": "/path/to/proof"
}
```

### 5. Upload Files

**Endpoint:** `POST /uploads/upload`

**Description:** Uploads files to the server.

**Sample Request:**

```
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Create an instance of FormData
const formData = new FormData();

// Append files to the form data
formData.append('files', fs.createReadStream(path.resolve('C:/Users/sanjay/Downloads/enhanced_full_hd.jpg')));
formData.append('files', fs.createReadStream(path.resolve('C:/Users/sanjay/Downloads/image.jpg')));

// Make a POST request to the /upload endpoint
axios.post('http://localhost:3000/uploads/upload', formData, {
    headers: {
        ...formData.getHeaders(),
    },
})
    .then(response => {
        console.log('Files uploaded successfully:', response.data);
    })
    .catch(error => {
        console.error('Error uploading files:', error);
    });

```

**Sample Response:**

```json
[
  {
    "url": "http://localhost:3000/uploads/1615467891234_file1.jpg",
    "name": "file1.jpg"
  },
  {
    "url": "http://localhost:3000/uploads/1615467895678_file2.jpg",
    "name": "file2.jpg"
  }
]
```


