export class CreateAccountDto {
  accountName: string;
}

export class DepositDto {
  amount: number;
}

export class TransactionDto {
  type: string;
  amount: number;
  transactionDate: Date;
}

export class TransferDto {
  recipientAccountId: string;
  amount: number;
}

export class WithdrawDto {
  amount: number;
}
