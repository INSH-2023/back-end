module.exports = (sequelize, DataTypes) => {
    Solution = sequelize.define("step_solutions", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        step: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        step_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        image_name: {
            type: DataTypes.STRING(100),
            allowNull: true
        }
    }, {
        timestamps: false
    })
    return Solution
}