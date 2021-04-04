/**
 *                          Blockchain Class
 *  The Blockchain class contain the basics functions to create a private blockchain.
 *  It uses libraries like `crypto-js` to create the hashes for each block and `bitcoinjs-message` 
 *  to verify a message signature. The chain is stored in the array `this.chain = [];`.
 *  Of course each time you run the application the chain will be empty because and array
 *  isn't a persisten storage method.
 */

const SHA256 = require('crypto-js/sha256');
const bitcoinMessage = require('bitcoinjs-message');

const BlockClass = require('./block.js');

class Blockchain {

    /**
     * Constructor - you will need to setup your chain array and the height
     * of your chain (the length of your chain array).
     * Also everytime you create a Blockchain class you will need to initialized
     * the chain creating the Genesis Block.
     */
    constructor() {
        this.chain = [];
        this.height = -1;
        this._initializeChain();
    }

    /**
     * Utility method that return the height of the chain.
     */
    async getChainHeight() {
        return this.height;
    }

    /**
     * The requestMessageOwnershipVerification method will allow you to request a message
     * that you will use to sign it with your Bitcoin Wallet (Electrum or Bitcoin Core).
     */
    async requestMessageOwnershipVerification(address) {
        const date = new Date().getTime().toString().slice(0, -3);
        return `${address}:${date}:starRegistry`;
    }

    /**
     * The submitStar method will allow users to register a new Block with the star object into the chain.
     */
    async submitStar(address, message, signature, star) {
        // Time from message sent as a parameter.
        const messageTime = parseInt(message.split(':')[1]);

        // Current time
        const currentTime = parseInt(new Date().getTime().toString().slice(0, -3));

        // Verify message was sent during the last 5 minutes.
        if (currentTime - messageTime > 5 * 60) {
            throw new Error('Message timed out.');
        }

        // Vertify message address and signature.
        if (!bitcoinMessage.verify(message, address, signature)) {
            throw new Error('Unable to verify message');
        }

        // Create a new block.
        const newBlock = new BlockClass.Block({ data: star, owner: address });

        // Add newly created block to the chain.
        await this._addBlock(newBlock);

        // Return the block.
        return newBlock;
    }

    /**
     * Search on the chain for a block that has the given hash.
     */
    async getBlockByHash(hash) {
        return this.chain.find((block) => block.hash === hash) || null;
    }

    /**
     * Search on the chain for a block that has the given height.
     */
    async getBlockByHeight(height) {
        return this.chain.find((block) => block.height === height) || null;
    }

    /**
     * Returns an array of Stars objects existing in the chain that belongs to the owner
     * with the wallet address passed as parameter.
     */
    async getStarsByWalletAddress(address) {
        return this.chain
            .map((block) => {
                if (!block.previousBlockHash) { // Ignore genesis block.
                    return null;
                }
                const data = block.getBData();
                return data.owner === address ? data : null;
            })
            .filter(Boolean); // Ignore nulls.
    }

    /**
     * Returns a list of errors when validating the chain.
     */
    async validateChain() {
        let errors = [];
        for (let i = 0; i < this.height; i++) {
            const block = this.chain[i];
            if (!block.validate()) { // Invalid block.
                errors.push(new Error(`Invalid block hash detected ${block.hash}`));
            }

            if (i > 0) { // Block is not the genesis block.
                const prevBlock = this.chain[i - 1];
                if (block.previousBlockHash !== prevBlock.hash) { // Invalid `previousBlockHash`.
                    errors.push(new Error(`Invalid previousBlockHash deteched ${block.hash}`));
                }
            }
        }
        return errors;
    }

    /**
     * Private method to check for the height of the chain and if there isn't a genesis block create one.
     */
    async _initializeChain() {
        if (this.height === -1) {
            let block = new BlockClass.Block({ data: 'Genesis Block' });
            await this._addBlock(block);
        }
    }

    /**
     * Private method _addBlock(block) will store a block in the chain.
     */
    async _addBlock(block) {
        // Make sure chain is valid before adding any new blocks.
        const validationErrors = await this.validateChain();
        if (validationErrors.length > 0) {
            throw new Error('Can not add blocks to an invalid chain.');
        }

        // Increase chain height.
        this.height += 1;

        // Set block height.
        block.height = this.height;

        // Set block time.
        block.time = new Date().getTime().toString().slice(0, -3);

        // Set `previousBlockHash` if block is not the genesis block.
        if (this.height > 0) {
            block.previousBlockHash = this.chain[this.height - 1].hash;
        }

        // Create and set `hash` for block after setting `previousBlockHash` and other properties.
        block.hash = SHA256(JSON.stringify(block)).toString();

        // Add the block to the chain.
        this.chain.push(block);
    }

}

module.exports.Blockchain = Blockchain;