module.exports = (sequelize, DataTypes) => {
    return sequelize.define("requests", {
        requestId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        full_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            isEmail: true
        },
        group_work: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        service_type: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        subject: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        status: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        req_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        assign: {
            type: DataTypes.STRING(100),
            allowNull: false
        }
    }, {
        timestamps: false
    })
}