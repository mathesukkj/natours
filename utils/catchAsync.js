const catchAsync = (func) => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    };
    // recebe a função como parametro
    // e retorna essa mesma função, com um .catch injetado
};
export default catchAsync;
