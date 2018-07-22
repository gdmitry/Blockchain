const express = require('express');
const { proofOfWork, hashBlock, consensus } = require('./helpers');
const { Block, Transaction, sequelize } = require('../db/models');
const winston = require('../winston');

const router = express.Router();

const miner_address = '-random-public-key-a-alkjdflakjfewn204ij';
const peer_nodes = [];
const minerReward = 2;

// Add genesis block if needed
addGenesisBlock();

async function addGenesisBlock() {
  const numOfBlocks = await Block.count();
  if (numOfBlocks === 0) {
    Block.create({
      index: 0,
      timestamp: Date.now(),
      data: {
        'proof-of-work': 9,
        transactions: []
      },
      previousHash: '0'
    });
  }
  return null;
}

async function isChainValid() {
  const blockchain = await Block.findAll({ raw: true });
  for (let i = 1; i < blockchain.length; i += 1) {
    const currentBlock = blockchain[i];
    const previousBlock = blockchain[i - 1];

    if ((currentBlock.previousHash !== previousBlock.hash)
     || (currentBlock.hash !== hashBlock(currentBlock))) {
      return false;
    }
  }

  return true;
}

async function getBalance(publicKey) {
  let inBalance = await Transaction.find({
    where: { to: publicKey },
    attributes: ['id', [sequelize.fn('sum', sequelize.col('amount')), 'balance']],
    group: ['to']
  });
  let outBalance = await Transaction.find({
    where: { from: publicKey },
    attributes: ['id', [sequelize.fn('sum', sequelize.col('amount')), 'balance']],
    group: ['from']
  });

  inBalance = +((inBalance && inBalance.get('balance')) || 0);
  outBalance = +((outBalance && outBalance.get('balance')) || 0);

  return inBalance - outBalance;
}

router.get('/mine', async (req, res) => {
  try {
    let lastBlock = await Block.find({
      order: [['timestamp', 'DESC']],
      limit: 1
    });
    lastBlock = lastBlock.convertToJSON();

    const lastProof = lastBlock.data['proof-of-work'];
    const pendingTransactions = await Transaction.findAll({ raw: true });
    const data = {
      'proof-of-work': proofOfWork(lastProof),
      transactions: pendingTransactions
    };

    const block = await Block.create({
      index: lastBlock.index + 1,
      timestamp: Date.now(),
      data,
      previousHash: lastBlock.hash
    });

    await Transaction.destroy({
      where: {},
      truncate: true
    });
    await Transaction.create({ from: 'network', to: miner_address, amount: minerReward });

    res.status(200).json(block.convertToJSON());
  } catch (e) {
    winston.error(e);
  }
});

router.post('/transaction', async (req, res) => {
  try {
    const { from, to, amount } = req.body;
    const balance = await getBalance(from);

    if (balance < amount) {
      throw new Error('There are no enougn coins on your account');
    }

    const new_txion = { from, to, amount };
    const tx = await Transaction.create(new_txion);

    winston.info('New transaction');
    winston.info(`FROM: ${new_txion.from}`);
    winston.info(`TO: ${new_txion.to}`);
    winston.info(`AMOUNT: ${new_txion.amount}`);

    res.status(200).send(tx);
  } catch (e) {
    winston.error(e);
    res.status(500).send(e.message);
  }
});

router.get('/blocks', async (req, res) => {
  let blockchain = await Block.findAll();
  blockchain = blockchain.map(block => block.convertToJSON());
  res.status(200).json(blockchain);
});

module.exports = router;
