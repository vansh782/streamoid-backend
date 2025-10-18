# Product Management API

This project is a backend service to manage products via CSV uploads. It allows sellers to upload products, validate them, store valid products in a database, and provide APIs to list and search/filter products.

---

## Features

- Upload CSV file of products
- Validate product data:
  - `price ≤ mrp`
  - `quantity ≥ 0`
  - Required fields: `sku`, `name`, `brand`, `mrp`, `price`
- Store valid products in MongoDB
- List products with pagination
- Search and filter products by:
  - Brand
  - Color
  - Price range

---

## Tech Stack

- Node.js & Express
- MongoDB Atlas
- Mongoose
- Multer (for file upload)
- csv-parser
- CORS

---

## Folder Structure

project/
├── index.js
├── Models/
│ └── productDetails.js
├── Routes/
│ ├── getProduct.js
│ └── uploadProduct.js
├── Uploads/ ← folder to temporarily store CSV uploads
├── package.json
└── README.md

yaml
Copy code

---

## Installation & Setup

1. Clone the repository:

```bash
git clone <repo_url>
cd <project_folder>
Install dependencies:

bash
Copy code
npm install
Create Uploads folder in the root directory:

bash
Copy code
mkdir Uploads
Update MongoDB connection in index.js:

js
Copy code
mongoose.connect("mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority")
Replace <username>, <password>, <cluster>, and <database> with your MongoDB Atlas details.

Make sure your IP is whitelisted in MongoDB Atlas Network Access.

Start the server:

bash
Copy code
node index.js
Or with nodemon:

bash
Copy code
nodemon index.js
Server runs on http://localhost:5000.

API Endpoints
1. Upload Products
POST /upload

Accepts a CSV file (file) via multipart/form-data

Validates data and stores valid products

Returns summary of valid and invalid rows

Sample Response:

json
Copy code
{
  "message": "File processed successfully",
  "totalRows": 20,
  "validCount": 18,
  "invalidCount": 2,
  "invalidData": [
    {
      "sku": "TSHIRT-XYZ",
      "name": "",
      "brand": "StreamThreads",
      "reason": "Missing required field(s)"
    }
  ]
}
2. List Products with Pagination
GET /products?page=1&limit=10

page → page number (default 1)

limit → number of products per page (default 10)

Sample Response:

json
Copy code
{
  "page": 1,
  "limit": 10,
  "total": 20,
  "totalPages": 2,
  "products": [
    {
      "sku": "TSHIRT-RED-001",
      "name": "Classic Cotton T-Shirt",
      "brand": "StreamThreads",
      "color": "Red",
      "size": "M",
      "mrp": 799,
      "price": 499,
      "quantity": 20
    }
  ]
}
3. Search / Filter Products
GET /products/search?brand=StreamThreads&color=Red&minPrice=500&maxPrice=2000

Filters are optional

Returns all products matching criteria

Sample Response:

json
Copy code
{
  "total": 2,
  "products": [
    {
      "sku": "TSHIRT-RED-001",
      "name": "Classic Cotton T-Shirt",
      "brand": "StreamThreads",
      "color": "Red",
      "size": "M",
      "mrp": 799,
      "price": 499,
      "quantity": 20
    }
  ]
}
CSV File Format
CSV must have columns:

arduino
Copy code
sku,name,brand,color,size,mrp,price,quantity
TSHIRT-RED-001,Classic Cotton T-Shirt,StreamThreads,Red,M,799,499,20
Notes
Uploaded files are deleted after processing.

Make sure the Uploads folder exists.

MongoDB Atlas requires your IP to be whitelisted in Network Access.

Dependencies
express

mongoose

cors

multer

csv-parser

nodemon (dev)

Install with:

bash
Copy code
npm install express mongoose cors multer csv-parser
npm install -D nodemon