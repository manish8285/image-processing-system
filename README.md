# Image Processing System

### Overview

This system efficiently processes image data from CSV files by accepting CSV
files, validating data, processing images asynchronously, storing processed
images and product information in a database, and providing APIs to track
processing status.
### Installation 
1. Clone the repository:  
   git clone https://github.com/manish8285/image-processing-system.git   
3. Install dependencies:  
   npm install  
3. Set environment variables:  
   MONGO_URI=mongodb://localhost:27017/test  
   (place the above line in .env file)  
5. Run in Development mode   
npm run dev: Start the server in development mode   

### Depedencies
1. Redis
2. Mongodb

## API Endpoints

1. Upload API:
   POST /api/upload Accepts CSV file and returns a unique request ID
   Request Body: file (CSV file) Response: requestId (string) 

3. Status API: GET /api/status/:requestId Returns processing status for the given
   request ID Path Parameters: requestId (string) Response: status (string) 

4. Webhook Endpoint: POST /api/webhook
   Called by the image processing service after processing all images
   Request Body: data (object) Database Schema products
   table: id (primary key, integer) name (string) input_image_urls (string,
   comma-separated) output_image_urls (string, comma-separated) processing_requests
   table: id (primary key, integer) request_id (string) status (string)

## Documentation    
For Database Design check out this doc  
https://docs.google.com/document/d/1-KQtOYxajZbiAkYBnoAfcat8EkXMzZUMSc60J7C5b-Y/edit?usp=sharing



