function error405(req, res, next) {
    const error = new Error();
    error.status = 405;
    next(error)
}

module.exports = function (app) {
    for(let i = 0; i < app._router.stack.length; i++) {
        if (app._router.stack[i].route) {
            app._router.stack[i].route.all(error405);
        }
    }
};