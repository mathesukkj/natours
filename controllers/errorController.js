export default (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;

    res.status(err.statusCode).send({
        message: err.message,
    });
};
