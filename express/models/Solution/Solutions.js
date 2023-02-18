module.exports = (sequelize, DataTypes) => {
    Solution = sequelize.define("solutions", {
        solutionId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        icon: {
            type: DataTypes.STRING(500),
            allowNull: true
        },
        text: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        tag: {
            type: DataTypes.STRING(500),
            allowNull: true,
            get() {
                return this.getDataValue('tag').split(',')
            },
            set(val) {
               this.setDataValue('tag',val.join(','));
            }
        }
    }, {
        timestamps: false
    })
    return Solution
}