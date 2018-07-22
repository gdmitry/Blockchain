module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Blockchain', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    index: {
      type: Sequelize.INTEGER
    },
    data: {
      type: Sequelize.STRING
    },
    hash: {
      type: Sequelize.STRING
    },
    timestamp: {
      type: Sequelize.DATE
    },
    previousHash: {
      type: Sequelize.STRING
    }
  }),
  down: queryInterface => queryInterface.dropTable('Blockchain')
};
