const fs = require("fs");
const path = require("path");

class Token {
    async ValidateTokens(token) {
        const error = [];
        return fs.promises.readFile(path.join(__dirname, "..", "data", "token.json"), { encoding: "utf-8" })
            .then((data) => {
                const loglist = JSON.parse(data);
                const filtered = loglist.filter(item => item.token === token)[0];
                if (filtered !== undefined) {
                    if (filtered.status === "valid") {
                        return {
                            flag: true,
                            username: filtered.username
                        }
                    }
                    else {
                        error.push("Token is not valid");
                        return {
                            flag: false,
                            error: error
                        }
                    }
                }
                else {
                    error.push("Token is not Found");
                    return {
                        flag: false,
                        error: error
                    }
                }

            })
            .catch(() => {
                return {
                    flag: false
                }
            });
    }

    async updateToken(token) {
        return fs.promises.readFile(path.join(__dirname, "..", "data", "token.json"), { encoding: "utf-8" })
            .then((data) => {
                const loglist = JSON.parse(data);
                const filtered = loglist.filter(item => item.token === token)[0];
                const findIndex = loglist.findIndex(item => item.token === token);
                if (filtered !== undefined) {
                    filtered.status = "invalid";
                    loglist[findIndex] = filtered;
                    return fs.promises
                        .writeFile(
                            path.join(__dirname, "..", "data", "token.json"),
                            JSON.stringify(loglist)
                        )
                        .then(() => {
                            return {
                                flag: true,
                                data: filtered.username
                            };
                        })
                        .catch(() => {
                            return {
                                flag: false
                            };
                        });
                }
            })
            .catch(() => {
                return {
                    flag: false
                }
            })
    }
}

module.exports = new Token();