const catchAsync = (func) => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    };
    // retorna func com um catch injetado, e passa o erro pro express
};
export default catchAsync;
