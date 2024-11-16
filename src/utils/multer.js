const multer = require("multer");
const crypto=require("crypto");
const path = require("path"); 
const fs=require("fs");

if (!fs.existsSync("uploads/")) {
    fs.mkdirSync("uploads/")
    console.log(fs.existsSync("uploads/"));
  }
  const createDirIfNot = (dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }
  }

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueString = Date.now() + "_" + path.extname(file.originalname);
        cb(null, uniqueString);
    },
});


const upload = multer({storage: storage})




module.exports = {
    upload
}