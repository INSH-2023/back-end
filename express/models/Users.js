module.exports = (sequelize, DataTypes) => {
    return sequelize.define("users", {
        userId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        emp_code: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        },
        full_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },
        role: {
            type: DataTypes.ENUM('user','admin'),
            allowNull: false
        },
        group_work: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        office: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        status: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        position: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            isEmail: true
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
        },
        updatedAt: {
            type: DataTypes.DATE,
        }
    }, {
    scopes: {
        withoutPassword: {
          attributes: { exclude: ['password'] },
        }
    }
    })
}