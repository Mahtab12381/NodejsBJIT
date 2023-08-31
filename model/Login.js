const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const env = require("dotenv");
env.config();

const time = () => {
    return `${new Date().getHours() > 12 ? (new Date().getHours() - 12) : new Date().getHours()}:${new Date().getMinutes() < 10 ? "0" + new Date().getMinutes() : new Date().getMinutes()}:${new Date().getSeconds() < 10 ? "0" + new Date().getSeconds() : new Date().getSeconds()} ${new Date().getHours() >= 12 ? "PM" : "AM"} (${(new Date().getMonth() + 1)}/${new Date().getDate()}/${new Date().getFullYear()})`;
}
const sendMail = async (email, otp,username) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: process.env.ETHEREAL_USER,
            pass: process.env.ETHEREAL_PASS
        }
    });

    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: '"Mahtab Sani" <mahtab.sani@example.com>', // sender address
        to: `${email}`, // list of receivers
        subject: "Reset Password", // Subject line
        html: `<!DOCTYPE html>
        <html>
        <head>
        </head>
        <body>
            <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
                <h2>Your One-Time Password (OTP)</h2>
                <h3>Dear ${username},</h3>
                <p>Your OTP for verification is:</p>
                <h3 style="background-color: #007bff; color: #fff; padding: 10px; text-align: center;">${otp}</h3>
                <p>This OTP is valid for a single use only and should be used within a short period of time.</p>
                <p>If you did not request this OTP, please ignore this email.</p>
                <p>Thank you for using our services!</p>
            </div>
        </body>
        </html>
        `, // html body
    });
    return info;
}
const emailExist = async (email) => {
    return fs.promises.readFile(path.join(__dirname, "..", "data", "user.json"), { encoding: "utf-8" })
        .then((data) => {
            const user = JSON.parse(data);
            const filtered = user.find(item => item.email === email)
            if (filtered !== undefined) {
                return {
                    flag: true,
                    data: filtered.username
                }
            }
            else {
                return {
                    flag: false,
                }
            }
        })
}
class Login {
    async createAccount(credentials) {
        const error = [];
        if (!credentials.username || credentials.username === "" || credentials.username.length < 3) {
            error.push("username is required and must be 3 characters long");
        }
        if (!credentials.password || credentials.password === "" || credentials.password.length < 8) {
            error.push("password is required and must be 8 characters long");
        }
        if (!credentials.name || credentials.name === "") {
            error.push("name is required");
        }
        if (!credentials.address || credentials.address === "") {
            error.push("address is required");
        }
        if (!credentials.email || credentials.email === "") {
            error.push("email is required");
        }
        if (error.length > 0) {
            return {
                flag: false,
                error: error
            }
        }
        else {
            return fs.promises.readFile(path.join(__dirname, "..", "data", "user.json"), { encoding: "utf-8" })
                .then((data) => {
                    let error = [];
                    const user = JSON.parse(data);
                    const filtered = user.find(item => item.username === credentials.username)
                    const filteredemail = user.find(item => item.email === credentials.email)
                    if (filtered !== undefined) {
                        error.push("username already exist");
                    }
                    if (filteredemail !== undefined) {
                        error.push("email already exist");
                    }
                    if (error.length > 0) {
                        return {
                            flag: false,
                            error: error
                        }
                    }
                    else {
                        const newUser = {...credentials, item: []}
                        user.push(newUser);
                        return fs.promises.writeFile(path.join(__dirname, "..", "data", "user.json"), JSON.stringify(user))
                            .then(() => {
                                return {
                                    flag: true,
                                    data: { "created account": credentials.username }
                                }
                            })
                            .catch(() => {
                                return {
                                    flag: false,
                                    error: ["failed to create account"]
                                }
                            })

                    }

                })
                .catch((error) => {
                    console.log(error);
                })
        }

    }

    async login(credentials) {
        const error = [];
        if (!credentials.username || credentials.username === "") {
            error.push("username is required");
        }
        if (!credentials.password || credentials.password === "") {
            error.push("password is required");
        }
        if (error.length > 0) {
            return {
                flag: false,
                error: error
            }
        }
        else {
            return fs.promises.readFile(path.join(__dirname, "..", "data", "user.json"), { encoding: "utf-8" })
                .then((data) => {
                    const parsedData = JSON.parse(data);
                    const filtered = parsedData.find(item => item.username === credentials.username)
                    if (filtered !== undefined) {
                        if (filtered.password === credentials.password) {
                            return fs.promises.readFile(path.join(__dirname, "..", "data", "token.json"), { encoding: "utf-8" })
                                .then((data) => {
                                    const tokenList = JSON.parse(data);
                                    const newToken = {
                                        username: credentials.username,
                                        token: Math.random().toString(36).substr(2, 9),
                                        time: time(),
                                        status: "valid"
                                    }
                                    tokenList.push(newToken);
                                    setTimeout(() => {
                                        const findIndex = tokenList.findIndex(item => item.token === newToken.token);
                                        tokenList[findIndex].status = "invalid";
                                        return fs.promises.writeFile(path.join(__dirname, "..", "data", "token.json"), JSON.stringify(tokenList))
                                            .then(() => {
                                                console.log("Token updated");
                                            })
                                            .catch(() => {
                                                console.log("token failed to update");
                                            })
                                    }, 120000);
                                    return fs.promises.writeFile(path.join(__dirname, "..", "data", "token.json"), JSON.stringify(tokenList))
                                        .then(() => {
                                            console.log("Token created");
                                            return {
                                                flag: true,
                                                data: { newToken }
                                            }
                                        })
                                        .catch(() => {
                                            console.log("token creation to update");
                                        })
                                })
                                .catch((error) => {
                                    console.log(error);
                                })
                        }
                        else {
                            return {
                                flag: false,
                                error: ["password is incorrect"]
                            }
                        }

                    }
                    else {
                        return {

                            flag: false,
                            error: ["Username Does not exist"]
                        }
                    }

                })

        }
    }

    async forgotPassword(credentials) {
        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpData = {
            email: credentials.email,
            otp: otp,
            timestamp: Date.now(),
            expirationDuration: 60,
        };
        const emailvalid = await emailExist(credentials.email);
        if (emailvalid.flag) {
            const info = await sendMail(credentials.email, otp, emailvalid.data);
            return fs.promises.readFile(path.join(__dirname, "..", "data", "otp.json"), { encoding: "utf-8" })
                .then((data) => {
                    const parsedData = JSON.parse(data);
                    const filtered = parsedData.findIndex(item => item.email === credentials.email);
                    if (filtered === -1) {
                        parsedData.push(otpData);
                    }
                    else{
                        parsedData[filtered].otp = otp;
                    }
                    return fs.promises.writeFile(path.join(__dirname, "..", "data", "otp.json"), JSON.stringify(parsedData))
                        .then(() => {
                            return {
                                flag: true,
                            }
                        })
                        .catch(() => {
                            console.log("otp failed to update");
                            return {
                                flag: false

                            }
                        })
                });
        }
        else {
            return {
                flag: false,
                error: ["Email does not exists"]
            }
        }
    }

    async resetPassword(body) {

        return fs.promises.readFile(path.join(__dirname, "..", "data", "otp.json"), { encoding: "utf-8" })
        .then((data) =>
        {
            const parsedData = JSON.parse(data);
            const filtered = parsedData.find(item => item.email === body.email && item.otp === body.otp);
            if (filtered !== undefined) {
                if (Date.now() - filtered.timestamp > filtered.expirationDuration * 1000) {
                    return {
                        flag: false,
                        error: ["OTP expired"]
                    }
                }
                return fs.promises.readFile(path.join(__dirname, "..", "data", "user.json"), { encoding: "utf-8" })
                .then((data) => {
                    const user = JSON.parse(data);
                    const index = user.findIndex(item => item.email === body.email);
                    user[index].password = body.new_password;
                    return fs.promises.writeFile(path.join(__dirname, "..", "data", "user.json"), JSON.stringify(user))
                    .then(() => {
                        return {
                            flag: true,
                        }
                    })
                    .catch(() => {

                        return {
                            flag: false,
                            error: ["Failed to update password"]
                        }

                    })
                })
                .catch(() => {
                    return {
                        flag: false,
                        error: ["Failed to update password"]
                    }
                })

            }
            else{
                return {
                    flag: false,
                    error: ["OTP or email is incorrect"]
                }
            }
        })
    }
}
module.exports = new Login();