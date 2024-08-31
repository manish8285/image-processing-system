# Image Processing System

### Overview

This system efficiently processes image data from CSV files by accepting CSV
files, validating data, processing images asynchronously, storing processed
images and product information in a database, and providing APIs to track
processing status. Installation Clone the repository: git clone
https://github.com/your-username/image-processing-system.git Install
dependencies: npm install Set environment variables:
MONGO_URI=mongodb://localhost:27017/test: npm run dev: Start the server in
development mode

## API Endpoints

Upload API: POST /api/upload Accepts CSV file and returns a unique request ID
Request Body: file (CSV file) Response: requestId (string)

Status API: GET /api/status/:requestId Returns processing status for the given
request ID Path Parameters: requestId (string) Response: status (string)

Webhook Endpoint: POST /api/webhook Called by the image processing service after
processing all images Request Body: data (object) Database Schema products
table: id (primary key, integer) name (string) input_image_urls (string,
comma-separated) output_image_urls (string, comma-separated) processing_requests
table: id (primary key, integer) request_id (string) status (string) Environment
Variables DB_HOST: database host DB_USER: database username DB_PASSWORD:
database password DB_NAME: database name License MIT License Note: Replace the
contents of this README.md file according to your project's specific details and
implementation.
