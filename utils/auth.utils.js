const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

class AuthUtils {
  static async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }

  static async comparePasswords(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static generateToken(payload) {
    // Include all relevant user data in token
    const tokenPayload = {
      userId: payload.userId,
      registrationType: payload.registrationType,
      bagType: payload.bagType,
      operatorType: payload.operatorType
    };

    return jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
  }

  static verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}

module.exports = AuthUtils;