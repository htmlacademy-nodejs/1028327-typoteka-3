'use strict';

class UserService {
  constructor(sequelize) {
    this._User = sequelize.models.User;
  }

  async create(userData) {
    const existAdmin = await this._User.findOne({
      where: {
        isAdmin: true,
      },
    });

    if (!existAdmin) {
      userData.isAdmin = true;
    }

    const user = await this._User.create(userData);
    return user.get();
  }

  async findByEmail(email) {
    const user = await this._User.findOne({
      where: {email},
    });

    return user && user.get();
  }
}

module.exports = UserService;
