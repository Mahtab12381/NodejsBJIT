const Token = require('../model/Token');
const LogClass = require('../model/LogClass');
const {failure} = require('../utility/common');
const time = () => {
    return `${new Date().getHours() > 12 ? (new Date().getHours() - 12) : new Date().getHours()}:${new Date().getMinutes() < 10 ? "0" + new Date().getMinutes() : new Date().getMinutes()}:${new Date().getSeconds() < 10 ? "0" + new Date().getSeconds() : new Date().getSeconds()} ${new Date().getHours() >= 12 ? "PM" : "AM"} (${(new Date().getMonth() + 1)}/${new Date().getDate()}/${new Date().getFullYear()})`;
}
class validation{
    async authenticate(req, res,next){
        const authorizationHeader = req.headers["authorization"];
        if (authorizationHeader) {
            const token = authorizationHeader.replace(/^Bearer\s+/i, '');
            const tokenValid = await Token.ValidateTokens(token);
            if (!tokenValid.flag) {
                await LogClass.writeLog({
                    success: true,
                    msg: `Tried to access without login`,
                    time: time()
                });
                    return res.status(401).send(failure("unauthorized access", tokenValid.error));
            }
            else {
                next();
            }
        }
        else {
            await LogClass.writeLog({
                success: true,
                msg: `Tried to access without login`,
                time: time()
            });
            return res.status(404).send(failure("Token Not Provided"));
        }
    }

    async dataValidation(req, res, next) {
        const product = req.body;
        const error = [];
    if (!product.name || product.name === "") {
      error.push("Name is required");
    } else {
      if (product.name.length < 3) {
        error.push("Name must be at least 3 characters");
      }
    }
    if ((product.price !== 0 && !product.price) || product.price === "") {
      error.push("price is required");
    } else {
      if (product.price <= 0) {
        error.push("price must be positive and not 0");
      }
    }
    if (!product.author || product.author === "") {
      error.push("author is required");
    } else {
      if (product.author.length < 3) {
        error.push("author must be at least 3 characters");
      }
    }
    if (product.id) {
      error.push("ID can not be provided here");
    }
    if ((product.stock !== 0 && !product.stock) || product.stock === "") {
      error.push("stock is required");
    } else {
      if (product.stock <= 0) {
        error.push("stock must be positive and not 0");
      }
    }
    if (error.length > 0) {
        return res.status(400).send(failure("Invalid data", error));
    } else {
        next();
    }
}
}

module.exports = new validation();