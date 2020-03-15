import { SparseMerkleTreeImpl } from './merkle-tree';
import { DB, HashFunction } from './types-needed';
import { keccak256 } from './utils';
import { ScratchDB } from './app/db/scratch';

export class CheckpointTree extends SparseMerkleTreeImpl {
  _mainDB: DB
  _scratch: ScratchDB | null
  _checkpoints: Buffer[]

  constructor(
    db: DB,
    height: number = 160,
    hashFunction: HashFunction = keccak256
  ) {
    super(db, height, hashFunction)
    this._mainDB = this.db
    this._scratch = null
    this._checkpoints = []
  }

  /**
   * Is the trie during a checkpoint phase?
   */
  get isCheckpoint() {
    return this._checkpoints.length > 0
  }

  /**
   * Creates a checkpoint that can later be reverted to or committed.
   * After this is called, no changes to the trie will be permanently saved
   * until `commit` is called. Calling `putRaw` overrides the checkpointing
   * mechanism and would directly write to db.
   */
  checkpoint() {
    const wasCheckpoint = this.isCheckpoint
    const copy: Buffer = Buffer.alloc(this.root.hash.length)
    this.root.hash.copy(copy)
    this._checkpoints.push(copy)

    // Entering checkpoint mode is not necessary for nested checkpoints
    if (!wasCheckpoint && this.isCheckpoint) {
      this._enterCpMode()
    }
  }

  /**
   * Enter into checkpoint mode.
   * @private
   */
  _enterCpMode() {
    this._scratch = new ScratchDB(this._mainDB)
    this.db = this._scratch
  }

  /**
   * Exit from checkpoint mode.
   * @private
   */
  _exitCpMode(commitState: boolean, cb: Function) {
    const scratch = this._scratch as ScratchDB
    this._scratch = null
    this.db = this._mainDB

    if (commitState) {

      // this._createScratchReadStream(scratch)
      //   .pipe(WriteStream(this.db._leveldb))
      //   .on('close', cb)
    } else {
      async.nextTick(cb)
    }
  }

  copy() {

  }
}