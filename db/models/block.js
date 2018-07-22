const { hashBlock } = require('../../src/helpers');

module.exports = (sequelize, DataTypes) => {
  const Block = sequelize.define('Block', {
    index: DataTypes.INTEGER,
    data: DataTypes.STRING,
    hash: DataTypes.STRING,
    timestamp: DataTypes.DATE,
    previousHash: DataTypes.STRING
  }, {
    tableName: 'Blockchain',
    timestamps: false    
  });

  Block.prototype.convertToJSON = function () {
    const {
      index, hash, timestamp, previousHash
    } = this;
    return {
      index, hash, timestamp, previousHash, data: JSON.parse(this.data)
    };
  };

  Block.beforeCreate = (block, fn) => {
    console.log(user.password);
    fn(null, block)
  }

  Block.hook('beforeCreate', (block, fn) => {
    const t = 0;
    fn(null, block)

    // block.hash = hashBlock(block);
    // block.data = JSON.stringify(block.data);
  });

  return Block;
};
