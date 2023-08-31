const Login = require("../model/Login");
const Token = require("../model/Token");
const { success, failure } = require('../utility/common');

class LoginController {

    async login(req, res) {
        try {
            const bodydata = req.body;
            const login = await Login.login(bodydata);
            if (login.flag) {
                return res.status(200).send(success("login successful", login.data));
            }
            else {
                return res.status(401).send(failure("login failed", login.error));
            }
        }
        catch (e) {
            console.log(e);
            return res.status(500).send(failure("Internal Server Error", e));
        }
    }
    async logout(req, res) {
        try {
            const headertoken = req.headers.authorization;
            const token = headertoken.replace(/^Bearer\s+/i, '');
            const logout = await Token.updateToken(token);
            if (logout.flag) {
                return res.status(200).send(success(`logout successful for ${logout.data}`));
            }
            else {
                return res.status(401).send(failure("logout failed", logout.error));
            }
        }
        catch (e) {
            console.log(e);
            return res.status(500).send(failure("Internal Server Error", e));
        }
    }
    async signup(req, res) {
        try {
            const bodydata = req.body;
            const signup = await Login.createAccount(bodydata);
            if (signup.flag) {
                return res.status(200).send(success("signup successful", signup.data));
            }
            else {
                return res.status(401).send(failure("signup failed", signup.error));
            }
        }
        catch (e) {
            console.log(e);
            return res.status(500).send(failure("Internal Server Error", e));
        }
    }
    async forgotpassword(req, res) {
        try {
            const bodydata = req.body;
            const forgotpassword = await Login.forgotPassword(bodydata);
            if (forgotpassword.flag) {
                return res.status(200).send(success("OTP sent successfully"));
            }
            else {
                return res.status(401).send(failure("OTP sending failed", forgotpassword.error));
            }
        }
        catch (e) {
            console.log(e);
            return res.status(500).send(failure("Internal Server Error", e));
        }
    }
    async resetpassword(req, res) {
        try {
            const bodydata = req.body;
            const resetpassword = await Login.resetPassword(bodydata);
            if (resetpassword.flag) {
                return res.status(200).send(success("Password reset successfully"));
            }
            else {
                return res.status(401).send(failure("Password reset failed", resetpassword.error));
            }
        }
        catch (e) {
            console.log(e);
            return res.status(500).send(failure("Internal Server Error", e));
        }
    }
}

module.exports = new LoginController();