import express from 'express'
const swpackagesRouter = express.Router()
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const crypto = require('crypto');
const path = require('path');

import { findAllSWPackages, addNewSWPackage } from '../controller/swpackges'

// Create storage engine for SDK upload
const storage = new GridFsStorage({
    url: 'mongodb://localhost:27017/cloudguard-swpkg-database',
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, async (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'softwarePackges'
                };
                await resolve(fileInfo);
            });
        });
    }
});

const upload = multer({ storage })


swpackagesRouter.get('/', findAllSWPackages) // get all SDK's
swpackagesRouter.route('/uploadswpackage').post( upload.single('file'), addNewSWPackage) //upload SDK


export default swpackagesRouter
