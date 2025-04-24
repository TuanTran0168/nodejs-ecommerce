"use strict"

const asyncHandleError = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}

module.exports = {
    asyncHandleError
}