import mongoose from 'mongoose'
import initswPkgDatabaseConnection from "../database/swpackgesdb"

const swpkgdb_instance = initswPkgDatabaseConnection()
let gfs;

swpkgdb_instance.once('open', () => {
    // initialize stream
    gfs = new mongoose.mongo.GridFSBucket(swpkgdb_instance.db, {
        bucketName: "softwarePackges"
    });

});

interface ISWPackges extends mongoose.Document {
    swPackage_name: string,
    swPackage_version: string
    filename: string
}

interface SWPackgesModel extends mongoose.Model<ISWPackges> {
    format(swpackages: ISWPackges): any
}

const swpackagesSchema = new mongoose.Schema({
    swPackage_name: {
        type: String,
        unique: true
    },
    swPackage_version: {
        type: String,
        required: true,
    },
    filename: {
        type: String,
        required: true,
    }
})

swpackagesSchema.statics.format = (swpackages: ISWPackges) => {
    return {
        swPackage_name: swpackages.swPackage_name,
        swPackage_version: swpackages.swPackage_version,
        filename: swpackages.filename,
    }
}

//here we will use sw_packages databse instace to fetch collections instead of using global mongoose instance
const SWPackages = swpkgdb_instance.model<ISWPackges, SWPackgesModel>('SWPackages', swpackagesSchema)

export { SWPackages }