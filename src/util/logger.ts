import * as winston from 'winston'

export const createLogger = (moduleName: string) => { return winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.label({ label: moduleName }),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console({
            level: process.env.CLOUDAGENT_LOG_LEVEL_CONSOLE ? process.env.CLOUDAGENT_LOG_LEVEL_CONSOLE : 'debug'
        })
    ]
    })
}