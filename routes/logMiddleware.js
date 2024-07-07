const winston = require('winston');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Importar el modelo de usuario

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

const logMiddleware = async (req, res, next) => {
    const startTime = Date.now();
    const { method, url, headers, body } = req;

    logger.info(`Request: ${method} ${url}`, {
        metadata: {
            headers,
            body,
        },
    });

    // Verificar token y establecer req.user
    const token = req.header('Authorization');
    if (token) {
        try {
            const decoded = jwt.verify(token, 'y_secret_key_1234567890');
            const user = await User.findByUsername(decoded.username);
            if (user) {
                req.user = user;
            }
        } catch (err) {
            // Si hay un error al verificar el token, no establecer req.user
        }
    }

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