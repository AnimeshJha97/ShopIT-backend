module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Internal Server Error';

    if (process.env.NODE_ENV === 'PRODUCTION') {
        res
            .status(err.statusCode)
            .json({
                status: 'fail',
                message: err.message
            })
    }

    if (process.env.NODE_ENV === 'DEVELOPMENT') {
        res
            .status(err.statusCode)
            .json({
                status: 'fail',
                error: err,
                message: err.message,
                stack: err.stack
            })
    }

}