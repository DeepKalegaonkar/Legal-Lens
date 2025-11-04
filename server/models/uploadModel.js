const mongoose = require('mongoose')

const uploadSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fileName: String,
  filePath: String,
  analysisResult: Object,
  uploadedAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Upload', uploadSchema)
