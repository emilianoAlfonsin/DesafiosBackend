import winston from "winston"

const { combine, timestamp, printf, colorize } = winston.format

// Definir formato de mensaje
const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`
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

const createLogger = (env) => {
    if (env === "production") {
        return winston.createLogger({
            levels,
            level: "info",
            format: combine(
                timestamp(),
                colorize(),
                myFormat
            ),
            transports: [
                new winston.transports.Console()
            ]
        })
    } else {
        return winston.createLogger({
            levels,
            level: "debug",
            format: combine(
                timestamp(), 
                colorize(), 
                myFormat
            ),
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({ filename: "error.log", level: "error" }),            
            ]
        })
    }
}

const logger = createLogger(process.env.NODE_ENV || "development")

export default logger