This repository was forked from [Pigi](https://github.com/karlfloersch/pigi), which was published under the MIT license.

**TODO** Finish README, add function definitions & use guide

## Sparse Merkle Trees
[Original paper describing how to implemenet a sparse merkle tree efficiently.](https://eprint.iacr.org/2016/683.pdf)

A sparse merkle tree is a merkle tree of intractable size, i.e. a tree which is so large that it would be impossible to actually store all of its leaf nodes.

The essential idea which makes a sparse merkle tree possible is the pre-calculation of a default node for each level in the tree: if the default value of a leaf node is `D1 = 0`, then the default value for the second level is `D2 = h(h(0) ++ h(0))`, the default value for the third level is `D3 = h(D1 ++ D1)`, etc. This allows you to efficiently calculate the root hash without actually having to hash every node in the tree.

Sparse merkle trees make it possible to have a merkle tree with a leaf node for every possible output value a hash algorithm can produce. It also makes it very simple to produce append-only merkle trees where a node for every possible index in some integer range is initialized with a default value.

## TypeScript
This repo has a typescript implementation of a sparse merkle tree which can be found in `src/merkle-tree.ts`.

SparseMerkleTree uses `memdown` for its database.

#### Modifications
The modifications to the code from Pigi were primarily to minimize dependencies on non-essential libraries, since the Pigi code was part of a large monorepo.

**TODO**
- [ ] Add checkpoint functionality to the tree
    - Can use some code from [merkle-patricia-tree](https://github.com/ethereumjs/merkle-patricia-tree).
- [ ] Add bitfield for missing default hashes in proof function.

## Contracts
This repo has a Solidity implementation of a sparse merkle tree, including verification and storage/production.

#### Modifications
<!-- * Separation of the storage functionality from the verification of proofs. -->
**Addition of `verifyAndUpate` function**
This is a pure function which takes a standard merkle proof `(rootHash, leafValue, leafIndex, siblings)` and an additional parameter `newValue`. It calculates the merkle root from the provided leaf, index and siblings, and calculates a second root `newRootHash` through the same process but using `newValue` instead of `leafValue`. It returns a tuple of `(valid, newRootHash)` where `valid` is a boolean stating whether the calculated root hash (using `leafValue`) matches the `rootHash` parameter that was provided for comparison.

**TODO**
- [ ] Add bitfield for missing default hashes in proof verification function.
