const authenticate = async (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).send({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, 'y_secret_key_1234567890');
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).send({ error: 'Invalid token' });
    }
};

module.exports = authenticate;