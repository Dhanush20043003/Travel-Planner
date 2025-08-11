const cloudinary = require('../utils/cloudinary');

exports.uploadImage = async (req, res) => {
  // Expect base64 or file (frontend can send base64 or FormData)
  const { image } = req.body;
  if (!image) return res.status(400).json({ message: 'No image' });
  const result = await cloudinary.uploader.upload(image, { folder: 'travel-planner' });
  res.json({ url: result.secure_url, public_id: result.public_id });
};
