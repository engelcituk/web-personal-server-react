const bcrypt = require("bcrypt-nodejs");
//const jwt = require("")
const User = require("../models/user");

function signUp(req, res) {
    console.log('Endpoint de signup');
}

module.exports = {
    signUp
};