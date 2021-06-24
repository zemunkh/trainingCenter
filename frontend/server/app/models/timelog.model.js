const { sequelize } = require("../config/db.config");

module.exports = (sequelize, Sequelize) => {
    const TimeLog = sequelize.define('timelog', {
        customerId: {
            type: Sequelize.STRING,
        },
        entryTime: {
            type: Sequelize.DATE,
        },
        exitTime: {
            type: Sequelize.DATE,
        },
        roomId: {
            type: Sequelize.STRING,
        },
        lockerNumber: {
            type: Sequelize.STRING,
        },
        isActive: {
            type: Sequelize.BOOLEAN
        }
    });

    return TimeLog;
}