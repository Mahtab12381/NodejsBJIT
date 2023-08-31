const LogClass = require('../model/LogClass');
const Login = require("../model/Login");
const Token = require("../model/Token");
const Product = require("../model/ProductClass");
const User = require("../model/User");
const { success, failure } = require('../utility/common');
const time = () => {
    return `${new Date().getHours() > 12 ? (new Date().getHours() - 12) : new Date().getHours()}:${new Date().getMinutes() < 10 ? "0" + new Date().getMinutes() : new Date().getMinutes()}:${new Date().getSeconds() < 10 ? "0" + new Date().getSeconds() : new Date().getSeconds()} ${new Date().getHours() >= 12 ? "PM" : "AM"} (${(new Date().getMonth() + 1)}/${new Date().getDate()}/${new Date().getFullYear()})`;
}
const getusername = async (token) => {
    const tokenValid = await Token.ValidateTokens(token);
    if (tokenValid.flag) {
        return tokenValid.username;
    }  
}

class UserController  {

    async getOrderList(req, res) {
         try {
            const headertoken = req.headers.authorization;
            const token = headertoken.replace(/^Bearer\s+/i, '');
            const username = await getusername(token);
            const orderlist = await User.orderList(username);
            if (orderlist.flag) {
                return res.status(200).send(success("Success fully received all order list", orderlist.data));
            }
            else {
                return res.status(500).send(failure("Internal Server Error", orderlist.error));
            }
        }
        catch (e) {
            return res.status(500).send(failure("Internal Server Error", e));
        }

     }

     async getwithProducts(req, res) {
            try {
                const users = await User.getWithProducts();
                if (users.flag) {

                    return res.status(200).send(success("Success fully received all user with products", users.data));
                }
                else {
                    return res.status(500).send(failure("Internal Server Error", users.error));
                }
                
            }
            catch (e) {
                return res.status(500).send(failure("Internal Server Error", e));
            }
    
     }

}

module.exports = new UserController();