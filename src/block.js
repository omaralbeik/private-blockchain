/**
 *                          Block class
 *  The Block class is a main component into any Blockchain platform, 
 *  it will store the data and act as a dataset for your application.
 *  The class will expose a method to validate the data... The body of
 *  the block will contain an Object that contain the data to be stored,
 *  the data should be stored encoded.
 */

const SHA256 = require('crypto-js/sha256');
const hex2ascii = require('hex2ascii');

class Block {
    /**
     * Constructor - argument data will be the object containing the transaction data.
     */
    constructor(data) {
        this.hash = null;
        this.height = 0;
        this.body = Buffer.from(JSON.stringify(data)).toString('hex');
        this.time = 0;
        this.previousBlockHash = null;
    }

    /**
     * Validate if the block has been tampered or not. Been tampered means that someone
     * from outside the application tried to change values in the block data as a consecuence
     * the hash of the block should be different.
     */
    async validate() {
        // Get current hash
        const currentHash = this.hash;

        // Create a clone of the block removing the hash property.
        const clone = {
            ...this,
            hash: null,
        };

        // Create a hash from the clone.
        const newHash = SHA256(JSON.stringify(clone)).toString();

        // Make sure current hash is valid.
        return currentHash === newHash;
    }

    /**
     * Auxiliary method to return the block data.
     */
    getBData() {
        // Make sure block is not the genesis block.
        if (!this.previousBlockHash) {
            throw new Error('Unable to get data for the genesis block');
        }

        // Get body.
        const body = this.body;

        // Decode body.
        const decodedBody = hex2ascii(body);

        // Return parsed body.
        return JSON.parse(decodedBody);
    }

}

module.exports.Block = Block;
