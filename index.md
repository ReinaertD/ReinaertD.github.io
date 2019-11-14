(The parts with code will be done with slides, /////FIRST THIS//// will appear first, and under that part of code ///FIRST THIS/// will be the dialog,
////SECOND THIS//// will be added to the slide after I've talked about the previous part of the code)

This will also be dumbed down because of the lack of time in the presentation but should still be correct however



----- DOC
Table of contents

1. What is blockchain?
2. P2P network
3. Mining


1. What is blockchain?
The purpose of a blockchain is to allow digital information to be recorded, distributed but NOT edited.
While Bitcoin made it popular it existed years before that and was called Digital Timestamps.
It's a file consisting of data blocks where each block that gets added to it receives a unique fingerprint AND the fingerprint of the last added block. 
Still very ambiguous so I'll try to explain it a bit by using some code to make a simplified blockchain.

We start first with the building block of the blockchain, the block. What is a block exactly and what does it contain? It's a container of a couple of things. 
It consists of 2 parts. The block header and the block body. 
	You can compare it to an HTML file, the head contains the metadata and the body the content.

	The block body contains the data.(in case of Bitcoin it is a list of transactions);
	The block header must at least have 
				1) hash of the previous block
				2) hash of the current block(a hash is encrypted information);
				but in every use of blockchain it has much more items inside the header.

Let's pretend that BeCode assigns the coaches evaluate us and they want to use blockchain so information can't be changed to avoid students trying to bribe the coaches. So first we make a class called Block.
============================================================================
////SECOND THIS//////////
const SHA256 = require('crypto-js/sha256');
//////////FIRST THIS/////////
class Block{
    constructor(index, timestamp, data, previousHash = ''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();

    }
////////THIRD THIS/////////
    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}
//////FIRST THIS TEXT//////
To make the block we use a constructor and give it requirements to what it needs to be created.
We have 	an index, just to know the location in the chain.
		a timestamp, to see WHEN the block was added.
		data, in this case evaluation of the class.
		previousHash, it's an encrypted string of the previous block.
		hash, the hash of the current black.
Most of this is self-evident, except the hash. Hash it just a way of encrypting information.
////SECOND THIS/////
We have to import javascript stuff to be able to encrypt. 
In the block we also make a function to calculate the hash. As you can see it takes the parameters including the previous hash and makes it a new hash.

==============================================================================
We made the blueprint of the block and now it is time for the chain. We'll call it Blockchain just to be original.
////////////////////////////////FIRST THIS//////////////////////////////////
class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock(){
        // Genesis block has no previous block so the 'previous hash' can be anything
        return new Block(0, "10/11/2019", "Genesis block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }
//////////////////////////////////////////////////////SECOND THIS////////////////////////
    isChainValid(){
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }
///////////////////////////////////////////THIRD THIS///////////////////////////////////
            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }
        return true;
    }
}

//////////////////////FIRST THIS//////////////////
So inside the class Blockchain we make a couple of functions.
First, again, is the constructor. We tell it that when a blockchain gets the GenesisBlock should be the first block in it.
What is the GenesisBlock? It is the first block of a chain and it is automaticaly created. It's unique because it doesn't have a previous hash. That''s why it must be created first. 
Then we have a function which calls the last added block of the chain.
And finally the addBlock function. In this we have the possibility to add blocks to our chain.
It gets the hash from the last added block and uses it to calculate the new hash. When the hash is calculated it gets added to the chain.

Let''s create the blockchain evaluation now.
	let evaluationChain = new Blockchain();
The chain has been created but only contains the genesisblock with no evaluation data in it, so let''s add a couple of blocks.

evaluationChain.addBlock(new Block(1,"12/11/2019", { greatestPersonInClass: "Reinaert" } ));

evaluationChain.addBlock(new Block(2,"13/11/2019", { leastFunnyPersonInClass: "Nijst" } ));

evaluationChain.addBlock(new Block(3,"15/11/2019", { javaMeister: "Claas"  } ));

The hashes are made in the functions so the only parameters we need to add is the index, timestamp, and the evaluationdata.

////// SHOW THE RESULT OF CONSOLE LOG 
console.log(JSON.stringify(evaluationChain, null, 4));
/////
///////////////////SECOND THIS////////////
Nijst found out about this evaluation, so he decides to change it.
He doesn't want to be known as the least funny person so he use his hackerman skills by typing this
        evaluationChain.chain[2].data = { leastFunnyPersonInClass: "Erin"};
---
Q: What happens?
Nothing, so we make a function that recalculates the hash of a block when called upon and compares it to the existing hash.
        console.log('Is blockchain valid? ' + evaluationChain.isChainValid());
Q: And now?
It returns false because the content has been changed inside so when you recalculate the hash it shows a different one.
---
Ofcourse this Nijst person is smart, so he also recalculates and change the hash.
---
evaluationChain.chain[2].hash = evaluationChain.chain[2].calculateHash();
        console.log('Is blockchain valid? ' + evaluationChain.isChainValid());
---
It returns true. So that's no good either. That's why we'll add a bit more code to the isChainValid function
////////////////////////////////////////THIRD THIS////////////////////////////:
Now that it's added let's check it again!
        console.log('Is blockchain valid? ' + evaluationChain.isChainValid());
It isn't valid again! Hooray!
=======================================================================================

2. P2P Network
It'll still be possible to change data but you'll have to recalculate every hash of every block that comes after the one you changed.
As an extra security measure you can make use of a P2P network.
In the case of bitcoin everyone is free to join it, and you can become a node. There are different kind of nodes and for the sake of brevity I will keep it simple. Every node on the network is equal to one another. It doesn't matter if you just joined or if you're the oldest node.
To qualify as a node you need to have a copy from the blockchain(243GB atm). After that you become a part of the network.
What this network does is make it safer
(1) since it's a decentralized system. If 1 node goes down there will still be a lot of other nodes.
(2) if a node is corrupted it will be ignored till it's correct again.

To be able to force a change you'll need to have control of more than 50% of the nodes. This is referred to as a 51% attack. 

=========================================================================================
3. Mining
(in case of bitcoin)
The purpose of mining is to reach a secure, tamper-resistant consensus and to introduce new bitcoins to the system.
Data, or in this case transactions, aren't automatically added. They are passed through all the nodes and if they are invalid they get ignored.
If they're valid they stay in the node till a block is mined. 
To avoid blocks being added every second 2 things are added, a difficulty(called the target) and a nonce(variable that gets changed). The difficulty gets changed so that each block will be added at the same interval. 
A difficulty is a variable that decides what the hash of a block needs to have to be added to the chain.
To make a simple example. 
 The target(difficulty) for the 100,000th block of Bitcoin was:
 	000000000004864c000000000000000000000000000000000000000000000000

 
We need to be under that number. So we can try it.

HASH GENERATOR : https://passwordsgenerator.net/sha256-hash-generator/

The bitcoin network at that time required around 10 minutes to find that hash. So it takes a lot of computing power.
------------------------------------
What I described in P2P and Mining is for the consensus model of Proof-of-work.
I won't go any further except that there are others, but this one is the most used and the most basic.
The way of doing the mining isn't exactly eco-friendly.




MEH CLOSE ENOUGH
