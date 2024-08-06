import winston from "winston"

const { combine, timestamp, printf, colorize, json } = winston.format

// Definir formato de mensaje
const myFormat = printf(({ level, message, timestamp, ...meta }) => {
    const metaData = Object.keys(meta).length ? JSON.stringify(meta, (key, value) => {
        if (value && value._doc) {
            return value._doc
        }
        return value
    }, 2) : ''
    return `${timestamp} ${level}: ${message} ${metaData}`
})

const levels = {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    http: 4,
    debug: 5
}

const colors = {
    fatal: 'grey',
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue'
}

winston.addColors(colors)

const createDevelopmentLogger = () => {
    return winston.createLogger({
        levels,
        level: process.env.LOG_LEVEL || "debug",
        format: combine(
            timestamp(),
            colorize(),
            myFormat
        ),
        transports: [
            new winston.transports.Console(),
            new winston.transports.File({ filename: "error.log", level: "error" }),
        ],
        exceptionHandlers: [
            new winston.transports.File({ filename: 'exceptions.log' })
        ]
    })
}

const createProductionLogger = () => {
    return winston.createLogger({
        levels,
        level: process.env.LOG_LEVEL || "info",
        format: combine(
            timestamp(),
            json()
        ),
        transports: [
            new winston.transports.Console(),
            new winston.transports.File({ filename: "combined.log" }),
            new winston.transports.File({ filename: "error.log", level: "error" }),
        ],
        exceptionHandlers: [
            new winston.transports.File({ filename: 'exceptions.log' })
        ]
    })
}

const logger = process.env.NODE_ENV === "production" ? createProductionLogger() : createDevelopmentLogger()

export default logger