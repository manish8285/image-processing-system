const Request = require('../models/request.schema');

exports.handleWebhook = async (req, res) => {
 const { requestId, status } = req.body;

 const request = await Request.findOne({ requestId });
 if (!request) {
  return res.status(404).json({ error: 'Request ID not found' });
 }

 request.status = status;
 await request.save();

 res.status(200).json({ message: 'Status updated' });
};
