import mongoose from 'mongoose'
import { createLogger } from '../util/logger'
const logger = createLogger('credentialManagementController')

const databaseConfiguration = {
    database: `${process.env.CLOUDGUARD_SWPKG_DB_NAME || 'mongodb://localhost:27017/cloudguard-swpkg-database'}?retryWrites=${String(process.env.CLOUDGUARD_DB_ENABLE_RETRY_WRITES).toLowerCase() == 'true' ? 'true' : 'false'}`,
    username: process.env.CLOUDGUARD_DB_USERNAME || null,
    password: process.env.CLOUDGUARD_DB_PASSWORD || null
}

const mongooseOptions = {
    user: databaseConfiguration.username,
    pass: databaseConfiguration.password,
    useNewUrlParser: true,
    useUnifiedTopology: true
}

const initswPkgDatabaseConnection = () => {

    try {
        logger.debug(`Establishing MongoDB connection to Software Packages database`)
        var swpkgdb_instance = mongoose.createConnection(databaseConfiguration.database, mongooseOptions)
        logger.info(`MongoDB connection established to Software Packages database`)
    } catch (error) {
        logger.error(`MongoDB connection failed to Software Packages database: ${error}`)
        setTimeout(initswPkgDatabaseConnection, 5000)
    }
    return swpkgdb_instance

}

export default initswPkgDatabaseConnection