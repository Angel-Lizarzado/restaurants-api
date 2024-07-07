const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.printf(info => {
        return `${info.level}: ${info.message} ${info.responseTime ? `(${info.responseTime}ms)` : ''}\n`;
    }),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/requests.log' }),
    ],
});

const logMiddleware = (req, res, next) => {
    const startTime = Date.now();
    const { method, url, headers, body } = req;

    logger.info(`Request: ${method} ${url}`, {
        metadata: {
            headers,
            body,
        },
    });

    res.on('finish', () => {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        const { statusCode, statusMessage } = res;

        logger.info(`Response: ${statusCode} ${statusMessage}`, {
            metadata: {
                responseTime,
            },
        });

        logger.info('----------------------------------------------------');
    });

    next();
};

module.exports = logMiddleware;