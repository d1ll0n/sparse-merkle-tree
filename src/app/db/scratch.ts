import MemDown from 'memdown'
// import { AbstractLevelDOWN } from 'abstract-leveldown';
import { BaseDB, DEFAULT_PREFIX_LENGTH, isNotFound } from './db';
import { K, V, DB } from '../../types-needed';
import { getLogger } from '../../utils';

const log = getLogger('db:scratch')

export class ScratchDB extends BaseDB {
  private _upstream: DB;

  constructor(
    upstreamDB: DB,
    prefixLength: number = DEFAULT_PREFIX_LENGTH
  ) {
    let inMemDb = new MemDown() as any;
    super(inMemDb, prefixLength);
    this._upstream = upstreamDB;
  }

  copy(): ScratchDB {
    const scratch = new ScratchDB(this._upstream, this.prefixLength)
    scratch.db = this.db
    return scratch
  }

    /**
   * Similar to `DB.get`, but first searches in-memory
   * scratch DB, if key not found, searches upstream DB.
   */
  get(key: K): Promise<V> {
    return new Promise<V>((resolve, reject) => {
      this.db.get(key, (err, value) => {
        if (err) {
          if (isNotFound(err)) {
            log.debug(`Key ${key.toString('hex')} not found.`)
            this._upstream.get(key)
              .then(res => resolve(res))
              .catch(err => reject(err))
            return;
          }
          reject(err)
          log.error(
            `Error getting key ${key.toString('hex')}: ${err.message}, ${
              err.stack
            }`
          )
          return
        }
        resolve(value)
      })
    })
  }
}