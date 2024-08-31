const csv = require('csv-parser');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { Readable } = require('stream');
const Request = require('../models/request.schema');
const Product = require('../models/product.schema');
const imageProcessorQueue = require('../workers/imageProcessor');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('file');

exports.uploadCSV = async (req, res) => {
 upload(req, res, async (err) => {
  if (err) {
   return res.status(500).json({ error: 'File upload failed' });
  }

  const requestId = uuidv4();
  const request = new Request({ requestId });
  await request.save();

  const results = [];

  try {
   // Convert buffer to a readable stream
   const stream = new Readable();
   stream.push(req.file.buffer);
   stream.push(null); // Indicate the end of the stream

   // Pipe the stream to csv-parser
   stream
    .pipe(csv())
    .on('data', (data) => {
     console.log('Parsed Data:', data); // Log each row

     // Clean up the 'Input Image Urls' field
     const sanitizedUrls = data['Input Image Urls']
      .replace(/\n/g, '')
      .split(',');

     // Ensure that all required fields are present
     if (data['S. No.'] && data['Product Name'] && sanitizedUrls.length > 0) {
      results.push({
       requestId,
       serialNumber: data['S. No.'], // Assuming 'S. No.' is the serial number
       productName: data['Product Name'],
       inputImageUrls: sanitizedUrls,
      });
     } else {
      console.warn('Missing required fields:', data);
     }
    })
    .on('end', async () => {
     try {
      if (results.length > 0) {
       const products = await Product.insertMany(results);

       products.forEach((product) => {
        imageProcessorQueue.add({ productId: product._id });
       });

       res.status(200).json({ requestId });
      } else {
       res.status(400).json({ error: 'No valid data to process' });
      }
     } catch (dbError) {
      console.error('Error inserting products into database:', dbError);
      res.status(500).json({ error: 'Error processing the CSV file' });
     }
    })
    .on('error', (parseError) => {
     console.error('Error parsing CSV:', parseError);
     res.status(500).json({ error: 'Error parsing the CSV file' });
    });
  } catch (fileError) {
   console.error('Error reading file:', fileError);
   res.status(500).json({ error: 'Error reading the uploaded file' });
  }
 });
};
