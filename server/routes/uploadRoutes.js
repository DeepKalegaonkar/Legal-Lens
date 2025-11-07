import express from "express"
import multer from "multer"
import path from "path"
import fs from "fs"
import jwt from "jsonwebtoken"
import Upload from "../models/uploadModel.js"

const router = express.Router()

// ✅ Ensure upload folder exists
const uploadDir = path.join(process.cwd(), "server", "uploads")
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

// ✅ Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, "_").replace(/[^\w.-]/g, "")
    cb(null, `${Date.now()}-${safeName}`)
  },
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") cb(null, true)
  else cb(new Error("Only PDF files are allowed!"), false)
}

const upload = multer({ storage, fileFilter })

// ✅ Verify JWT Middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json({ error: "No token provided." })

  const token = authHeader.split(" ")[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch {
    res.status(401).json({ error: "Invalid token." })
  }
}

// ✅ Upload Endpoint
router.post("/", verifyToken, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded!" })

    const newUpload = new Upload({
      userId: req.user.id,
      fileName: req.file.originalname,
      filePath: `/uploads/${req.file.filename}`,
      analysisResult: {},
    })

    await newUpload.save()

    res.status(200).json({
      message: "✅ File uploaded successfully!",
      upload: newUpload,
    })
  } catch (err) {
    console.error("Upload error:", err)
    res.status(500).json({ error: "Server error during upload." })
  }
})

export default router
