// handler will take a callback as argument which is going to be an express middleware
// it will try to run it and if there is any error that happened, will be thrown to
// express's global error handler from where certain kinds of errors could be handled

module.exports = (fn) => (req, res, next) => fn(req, res, next).catch(next);
