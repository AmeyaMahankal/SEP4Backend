const jwt = require('jsonwebtoken');
const PassModel = require('../model/PassModel');

class PassService {
    constructor(secretKey) {
        this.secretKey = secretKey;
    }

    async login(password) {
        try {
            const foundPassword = await PassModel.findOne({ password });

            if (foundPassword) {
                const token = this.generateToken(foundPassword.password);

                return {
                    message: 'Login successful',
                    token,
                    protectedData: { password: foundPassword.password }
                };
            } else {
                throw new Error('Invalid Password');
            }
        } catch (error) {
            throw error;
        }
    }

    async updatePassword(oldPassword, newPassword) {
        try {
            const foundPassword = await PassModel.findOne({ password: oldPassword });

            if (!foundPassword) {
                throw new Error('Invalid Old Password');
            }

            foundPassword.password = newPassword;
            await foundPassword.save();

            return { message: 'Password updated successfully' };
        } catch (error) {
            throw error;
        }
    }

    generateToken(data) {
        return jwt.sign({ password: data }, this.secretKey, { expiresIn: '1h' });
    }

    verifyToken(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, this.secretKey, (err, decoded) => {
                if (err) {
                    reject('Unauthorized');
                } else {
                    resolve(decoded);
                }
            });
        });
    }
}

module.exports = PassService;
