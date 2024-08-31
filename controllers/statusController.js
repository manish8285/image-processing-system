const Request = require('../models/request.schema');
const Product = require('../models/product.schema');

exports.getStatus = async (req, res) => {
 const { requestId } = req.params;
 const request = await Request.findOne({ requestId });
 if (!request) {
  return res.status(404).json({ error: 'Request ID not found' });
 }

 const products = await Product.find({ requestId });
 res.status(200).json({
  requestId: request.requestId,
  status: request.status,
  products,
 });
};
