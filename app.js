const express = require('express');
const errorMiddleware = require('./middlewares/errorMiddleware')
const errorHandler = require('./utils/errorHandler');
const cookieParser = require('cookie-parser');
const app = express();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.use(express.json());
app.use(cookieParser());

//IMPORT ALL ROUTES
const products = require('./routes/productRouter');
const users = require('./routes/userRouter');

app.use('/api/v1', products)
app.use('/api/v1', users)

//Middlewares
app.all('*', (req, res, next) => {
    next(new errorHandler(`Can't find ${req.originalUrl} url in the server!!`, 404))
})

app.use(errorMiddleware);

module.exports = app;