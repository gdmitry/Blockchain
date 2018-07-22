const axios = require('axios');
const CryptoJS = require('crypto-js');

function proofOfWork(lastProof) {
  let incrementor = lastProof + 1;
  while (incrementor % 9 !== 0 || incrementor % lastProof !== 0) {
    incrementor += 1;
  }
  return incrementor;
}

async function findNewChains(peer_nodes) {
  return Promise.all(peer_nodes.map(nodeUrl => axios.get(`${nodeUrl}/blocks`)))
    .then(data => {
      console.log(data);
      return data;
    });
}

async function consensus(peer_nodes, blockchain) {
  const other_chains = await findNewChains(peer_nodes);
  let longest_chain = blockchain;
  other_chains.forEach(chain => {
    if (chain.length > blockchain.length) {
      longest_chain = chain;
    }
  });
  return longest_chain;
}

function hashBlock({
  index, timestamp, data, previousHash
}) {
  const sha = CryptoJS.SHA256(index + timestamp + JSON.stringify(data) + previousHash);
  return CryptoJS.enc.Hex.stringify(sha);
}

module.exports = {
  consensus, findNewChains, proofOfWork, hashBlock
};
