const LogClass = require('../model/LogClass');
const Login = require("../model/Login");
const Token = require("../model/Token");
const User = require("../model/User");
const Product = require("../model/ProductClass");
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

class ProductController {

    async getAll(req, res) {
        try {
            const products = await Product.getAll();
            if (products.flag) {
                return res.status(200).send(success("Success fully received all product", JSON.parse(products.data)));
            }
            else {
                return res.status(500).send(failure("Internal Server Error", products.error));
            }
        }
        catch (e) {
            return res.status(500).send(failure("Internal Server Error", e));
        }

    }

    async getOne(req, res) {
        try {
            const { id } = req.params;
            const product = await Product.getById(Number(id));
            if (product.flag && product.data) {
                return res.status(200).send(success(`Product with id ${id} retrived successfully`, product.data));
            }
            else if (product.flag && !product.data) {
                return res.status(404).send(failure(`Id ${id} not found`));
            }
            else {
                return res.status(500).send(failure("Internal Server Error", product.error));
            }
        }
        catch (e) {
            return res.status(500).send(failure("Internal Server Error", e));
        }

    }

    async create(req, res) {
        try {
            const bodydata = req.body;
            const product = await Product.add(bodydata);
            if (product.flag) {
                return res.status(200).send(success("Product added successfully", product.data));
            }
            else {
                return res.status(500).send(failure("Can not add product", product.error));
            }
        }
        catch (e) {
            console.log(e);
            return res.status(500).send(failure("Internal Server Error", e));
        }
    }

    async update(req, res) {
        try {
            const { id } = req.query;
            const bodydata = req.body;
            const product = await Product.update(Number(id), bodydata);
            if (product.flag) {
                return res.status(200).send(success(`Product updated successfully for ${id}`, product.data));
            }
            else {
                return res.status(500).send(failure("Can not update product", product.error));
            }
        }
        catch (e) {
            console.log(e);
            return res.status(500).send(failure("Internal Server Error", e));
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const product = await Product.deleteById(Number(id));
            if (product.flag) {
                await LogClass.writeLog({
                    success: true,
                    msg: `Deleted product info for id ${id}`,
                    deletedItem: product.data,
                    time: time()
                });
                return res.status(200).send(success(`Product deleted successfully for ${id}`, product.data));
            }
            if (!product.flag) {
                return res.status(404).send(failure(`Product with id ${id} not found`));
            }
            else {
                return res.status(500).send(failure("Internal Server Error", product.error));
            }
        }
        catch (e) {
            console.log(e);
            return res.status(500).send(failure("Internal Server Error", e));
        }

    }

    async restore(req, res) {
        try {
            const { id } = req.params;
            const restoredProduct = await LogClass.readLog(Number(id));
            if (restoredProduct.flag) {
                const product = await Product.restoreProduct(restoredProduct.data.deletedItem);
                if (product.flag) {
                    await LogClass.writeLog({
                        success: true,
                        msg: `Restored product info for id ${id}`,
                        time: time()
                    });
                    return res.status(200).send(success(`Product restored successfully for ${id}`, product.data));
                }
            }
            else {
                return res.status(404).send(failure(`Product with id ${id} not found to restore`));
            }
        }
        catch (e) {
            console.log(e);
            return res.status(500).send(failure("Internal Server Error", e));
        }
    }

    async sortByStock(req, res) {
        try {
            const allProducts = await Product.getAll();
            let alldata = JSON.parse(allProducts.data)
            alldata = alldata.sort((a, b) => a.stock - b.stock)
            if (allProducts.flag) {
                return res.status(200).send(success("Success fully received all product sorted", alldata));
            }
            else {
                return res.status(500).send(failure("Internal Server Error", allProducts.error));
            }
        }
        catch (e) {
            return res.status(500).send(failure("Internal Server Error", e));
        }
    }

    async buyProduct(req, res){
        try {
            const { id } = req.params;
            const { quantity } = req.params;
            const product = await Product.getById(Number(id));
            if (product.flag && product.data) {
                if (product.data.stock >= quantity) {
                    const updatedProduct = await Product.update(Number(id), {stock: product.data.stock - quantity});
                    if (updatedProduct.flag) {
                        const token = req.headers.authorization;
                        const modifiedtoken = token.replace(/^Bearer\s+/i, '');
                        const username = await getusername(modifiedtoken);
                        const user = await User.addItemToUser(username, id);
                        if (user.flag) {
                            return res.status(200).send(success(`Thanks for you purchase`, {
                                Name: updatedProduct.data.name,
                                Author: updatedProduct.data.author,
                                Price: updatedProduct.data.price,
                                Quantity: quantity
                            }));
                        } 
                        else{
                            return res.status(500).send(failure("Internal Server Error", user.error));
                        }
                    }
                    else {
                        return res.status(500).send(failure("Internal Server Error", updatedProduct.error));
                    }
                }
                else {
                    return res.status(400).send(failure(`Product with id ${id} has only ${product.data.stock} stock`));
                }
            }
            else if (product.flag && !product.data) {
                return res.status(404).send(failure(`Id ${id} not found`));
            }
            else {
                return res.status(500).send(failure("Internal Server Error", product.error));
            }
        }
        catch (e) {
            return res.status(500).send(failure("Internal Server Error", e));
        }

    }

}

module.exports = new ProductController();