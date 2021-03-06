class BlockchainController {

    constructor(app, blockchainObj) {
        this.app = app;
        this.blockchain = blockchainObj;
        this.getBlockByHeight();
        this.requestOwnership();
        this.submitStar();
        this.getBlockByHash();
        this.getStarsByOwner();
        this.validateChain();
    }

    // Enpoint to Get a Block by Height (GET Endpoint)
    getBlockByHeight() {
        this.app.get("/block/height/:height", async (req, res) => {
            if (req.params.height) {
                const height = parseInt(req.params.height);
                let block = await this.blockchain.getBlockByHeight(height);
                if (block) {
                    return res.status(200).json(block);
                } else {
                    return res.status(404).json({
                        "error": "block not found"
                    });
                }
            } else {
                return res.status(500).json({
                    "error": "block not found, review request parameters"
                });
            }
        });
    }

    // Endpoint that allows user to request Ownership of a Wallet address (POST Endpoint)
    requestOwnership() {
        this.app.post("/requestValidation", async (req, res) => {
            if (req.body.address) {
                const address = req.body.address;
                const message = await this.blockchain.requestMessageOwnershipVerification(address);
                if (message) {
                    return res.status(200).json(message);
                } else {
                    return res.status(500).json({
                        "error": "unknown"
                    });
                }
            } else {
                return res.status(500).json({
                    "error": "review request parameters"
                });
            }
        });
    }

    // Endpoint that allow Submit a Star, yu need first to `requestOwnership` to have the message (POST endpoint)
    submitStar() {
        this.app.post("/submitStar", async (req, res) => {
            if (req.body.address && req.body.message && req.body.signature && req.body.star) {
                const address = req.body.address;
                const message = req.body.message;
                const signature = req.body.signature;
                const star = req.body.star;
                try {
                    const block = await this.blockchain.submitStar(address, message, signature, star);
                    if (block) {
                        return res.status(200).json(block);
                    } else {
                        return res.status(500).json({
                            "error": "unknown"
                        });
                    }
                } catch (error) {
                    return res.status(500).json({
                        "error": error.toString()
                    });
                }
            } else {
                return res.status(500).json({
                    "error": "review request parameters"
                });
            }
        });
    }

    // This endpoint allows you to retrieve the block by hash (GET endpoint)
    getBlockByHash() {
        this.app.get("/block/hash/:hash", async (req, res) => {
            if (req.params.hash) {
                const hash = req.params.hash;
                let block = await this.blockchain.getBlockByHash(hash);
                if (block) {
                    return res.status(200).json(block);
                } else {
                    return res.status(404).json({
                        "error": "block not found"
                    });
                }
            } else {
                return res.status(500).json({
                    "error": "block not found, review request parameters"
                });
            }
        });
    }

    // This endpoint allows you to request the list of Stars registered by an owner
    getStarsByOwner() {
        this.app.get("/block/:address", async (req, res) => {
            if (req.params.address) {
                const address = req.params.address;
                try {
                    let stars = await this.blockchain.getStarsByWalletAddress(address);
                    if (stars) {
                        return res.status(200).json(stars);
                    } else {
                        return res.status(404).json({
                            "error": "block not found"
                        });
                    }
                } catch (error) {
                    return res.status(500).json({
                        "error": error.toString()
                    });
                }
            } else {
                return res.status(500).json({
                    "error": "blocks not found, review request parameters"
                });
            }
        });
    }

    // Enpoint to validate the chain (GET Endpoint)
    validateChain() {
        this.app.get("/validateChain", async (req, res) => {
            const errors = await this.blockchain.validateChain();
            if (errors.length === 0) {
                return res.status(200).json({
                    "info": "chain is valid"
                });
            } else {
                return res.status(500).json({
                    "errors": errors.map(e => e.toString())
                });
            }
        });
    }
    

}

module.exports = (app, blockchainObj) => (new BlockchainController(app, blockchainObj));
