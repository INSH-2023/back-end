module.exports = (sequelize, DataTypes) => {
    return sequelize.define("items", {
        itemId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        number: {
            type: DataTypes.STRING(100),
            allowNull: false,
            isEmail: true
        },
        SL: {
            type: DataTypes.STRING(15),
            allowNull: false
        },
        SW: {
            type: DataTypes.STRING(13),
            allowNull: false
        },
        sent_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        note: {
            type: DataTypes.STRING(100),
            allowNull: false
        }
    }, {
        timestamps: false
    })
}