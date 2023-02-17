module.exports = (sequelize, DataTypes) => {
    return sequelize.define("problems", {
        problemId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        problem: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        icon: {
            type: DataTypes.STRING(500),
            allowNull: false,
        }
    }, {
        timestamps: false
    })
}