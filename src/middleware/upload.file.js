const multer = require('multer');
const path = require('path');
module.exports.uploadFile = () => {
  return multer({
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb) => {
      let ext = path.extname(file.originalname); 
      file.tail=ext.substr(1);
      if (file.fieldname == "image") {
        file.resource_type="image";
        if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png" ) {
            cb(new Error("File type is not supported"), false);
            return;
        } 
      }
      cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 } 
  });
}