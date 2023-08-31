const fs = require("fs");
const path = require("path");
const Product = require("./ProductClass");

class User {
    async addItemToUser(username, item_id) {
        console.log(username, item_id);
        return fs.promises
            .readFile(path.join(__dirname, "..", "data", "user.json"), {
                encoding: "utf-8",
            })
            .then((data) => {
                const parsedData = JSON.parse(data);
                const filtered = parsedData.filter((item) => item.username === username)[0];
                const findIndex = parsedData.findIndex((item) => item.username === username);
                console.log(filtered, findIndex);
                if (filtered !== undefined) {
                    const modifiedUser = { ...filtered, item: [...filtered.item] }
                    filtered.item.push(Number(item_id));
                    parsedData[findIndex] = filtered;
                    return fs.promises
                        .writeFile(
                            path.join(__dirname, "..", "data", "user.json"),
                            JSON.stringify(parsedData)
                        )
                        .then(() => {
                            return {
                                flag: true
                            };
                        })
                        .catch((error) => {
                            console.log(error);
                            return {
                                flag: false,
                            };
                        });
                }
                else {
                    return {
                        flag: false,
                        error: "User not found"
                    }
                }
            })
            .catch((error) => {
                console.log(error);
                return {
                    flag: false,
                };
            });
    }
    async orderList(username) {
        return fs.promises
            .readFile(path.join(__dirname, "..", "data", "user.json"), {
                encoding: "utf-8",
            })
            .then((data) => {
                const parsedData = JSON.parse(data);
                const filtered = parsedData.filter((item) => item.username === username)[0];
                if (filtered !== undefined) {
                    console.log(filtered);
                    return fs.promises
                        .readFile(path.join(__dirname, "..", "data", "data.json"), {
                            encoding: "utf-8",
                        })
                        .then((data) => {
                            const parsedData = JSON.parse(data);
                            const myProduct = parsedData.filter((item) => filtered.item.includes(item.id));
                            return {
                                flag: true,
                                data: myProduct
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                            return {
                                flag: false,
                            };
                        });
                }
                else {
                    return {
                        flag: false,
                        error: "User not found"
                    }
                }
            })
            .catch((error) => {
                console.log(error);
                return {
                    flag: false,
                };
            });

    }
    // async getWithProducts(){
    //     return fs.promises
    //     .readFile(path.join(__dirname, "..", "data", "user.json"), {
    //         encoding: "utf-8",
    //     })
    //     .then((data) => {
    //         const parsedData = JSON.parse(data);
    //         return {
    //             flag:true,
    //             data:populatedUserData
    //         }
    //     })
    //     .catch((error) => {
    //         console.log(error);
    //         return {
    //             flag: false,
    //         };
    //     });
    // }

}

module.exports = new User();