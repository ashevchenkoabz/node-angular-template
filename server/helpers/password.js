"use strict";

const bcrypt = require('bcrypt-nodejs');
class Password {
    static hash (password) {
        return bcrypt.hashSync(password);
    }
    
    static compare (password, hashedPassword){
        return bcrypt.compareSync(password, hashedPassword);
    }
}
module.exports = Password;
