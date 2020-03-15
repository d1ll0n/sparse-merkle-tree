export type RollupTransition =
  | SwapTransition
  | TransferTransition
  | CreateAndTransferTransition

export interface SwapTransition {
  stateRoot: string
  senderSlotIndex: number
  uniswapSlotIndex: number
  tokenType: number
  inputAmount: number
  minOutputAmount: number
  timeout: number
  signature: string
}

export interface TransferTransition {
  stateRoot: string
  senderSlotIndex: number
  recipientSlotIndex: number
  tokenType: number
  amount: number
  signature: string
}

export interface CreateAndTransferTransition extends TransferTransition {
  createdAccountPubkey: string
}