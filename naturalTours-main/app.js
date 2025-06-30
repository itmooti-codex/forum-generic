const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// const catchAsync = fn =>{
//   return async (req, res,next) =>{
//     fn(req, res).catch(err=>next(err))
//   }
// }

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log('Hello from the middleware 👋');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.use('*', function(req, res, next) {
  // const err = new Error(`Could not find ${req.originalUrl} on the server.`);
  // err.statusCode = err.statusCode;
  // err.status = 'fail';
  // next(err);
  next(new AppError(`Cannot find ${req.originalUrl} on the server.`, 404));
});

app.use(globalErrorHandler);
// a quick note we made a global error route and then made an error up in there and then we used
//app.use downwards and then  assigned the status code and status there. Finally, we responsed
//with status: fail and error message there.  This is a use of global error handling middleware,

module.exports = app;
