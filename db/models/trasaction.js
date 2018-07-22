module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    from: DataTypes.INTEGER,
    to: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    createdAt: DataTypes.DATE
  });

  return Transaction;
};
