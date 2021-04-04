# Private Blockchain

A simple Blockchain application built using Javascript and node for the [Blockchain Developer Nanodegree](https://www.udacity.com/course/blockchain-developer-nanodegree--nd1309)

## Problem

Your employer is trying to make a test of concept on how a Blockchain application can be implemented in his company.
He is an astronomy fans and he spend most of his free time on searching stars in the sky, that's why he would like
to create a test application that will allows him to register stars, and also some others of his friends can register stars too but making sure the application know who owned each star.

---

## Run the project

###### Install dependencies
```sh
yarn install
```

###### Run local server
```sh
yarn start
```

---

## REST API

You should see in your terminal a message indicating that the server is listening in port 8000:

### Request validation

###### Endpoint
```
localhost:8000/requestValidation
```

###### Body
```json
{
    "address": "{{WALLET_ADDRESS}}"
}
```

### Submit a new star

###### Endpoint
```
localhost:8000/submitStar
```

###### Body
```json
{
    "address": "{{WALLET_ADRESS}}",
    "message": "{{MESSAGE_FROM_REQ_VALIDATION}}",
    "signature": "{{MESSAGE_SIGNATURE}}",
    "star": {
        "dec": "...",
        "ra": "...",
        "story": "..."
    }
}
```

### Get a star by its block height
> Use 0 to get the Genesis Block.

###### Endpoint
```
localhost:8000/block/height/{{HEIGHT}}
```

### Get a star by its block hash

###### Endpoint
```
localhost:8000/block/{{HASH}}
```

### Get stars owned by a wallet address

###### Endpoint
```
localhost:8000/block/{{WALLET_ADDRESS}}
```
### Validate the chain

###### Endpoint
```
localhost:8000/validateChain
```
