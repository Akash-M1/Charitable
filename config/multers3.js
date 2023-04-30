const multer = require('multer');
const multers3 = require('multer-s3');
const path = require('path')
const {S3Client} = require('@aws-sdk/client-s3');

const clientS3 = new S3Client({
    credentials:{
        accessKeyId:process.env.awsAccessKey,
        secretAccessKey:process.env.awsSecretKey
    },
    region:'us-east-1'
});

const storage = multers3({
    s3:clientS3,
    bucket:"bucketfromnodejs",
    acl: "public-read",
    metadata: (req, file, cb) => {
        cb(null, {fieldname: file.fieldname})
    },
    key: (req, file, cb) => {
        const fileName = Date.now() + "_" + file.fieldname + "_" + file.originalname;
        cb(null, fileName);
    }
});

function sanitizeFile(file, cb) {
    
    const fileExts = [".png", ".jpg", ".jpeg", ".gif"];

    const isAllowedExt = fileExts.includes(
        path.extname(file.originalname.toLowerCase())
    );

    const isAllowedMimeType = file.mimetype.startsWith("image/");

    if (isAllowedExt && isAllowedMimeType) {
        return cb(null, true);
    } else {
        cb("Error: File type not allowed!");
    }
}

const uploadImage = multer({
    storage:storage,
    fileFilter:function(req,file,cb){
        sanitizeFile(file,cb);
    },
    limits:{
        fileSize:1024*1024*2
    }
});

module.exports = uploadImage;