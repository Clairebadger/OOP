class Member {
  #savingsAccount;
  #checkingAccount;
  constructor(name) {
    this.name = name
  };
  set setSavings(savings){
    this.#savingsAccount = savings
  }

  set setChecking(checking){
    this.#checkingAccount = checking;
  }
};

class BankAccount {
  #balance;
  #transactions;

  constructor(member) {
    this.#transactions = [];
    this.#balance = 0;
    this.member = member;
  };

  get getBalance(){
    return this.#balance
  }

  set setBalance(newBalance){
    this.#balance = newBalance;
  }

  credit(moneyAmount) {
    this.#balance += moneyAmount;
    this.#transactions.push(`+ ${moneyAmount}`)
  };
  debit(money) {
    this.#balance -= money
    this.#transactions.push(`-${money}`)
  };
  checkBalance() {
    return `The current balance is ${this.#balance}`;
  };

  static retrieveTransactions(account){
      return account.#transactions
  };
};

class CheckingAccount extends BankAccount {

  constructor(member) {
      super(member);
      member.setChecking = this;
  };

  debit(money){

    let futureBalance = this.getBalance-money;

    if (futureBalance < 0){
      console.log("you have overdrafted your account")
      console.log("you have to pay a $40 fine")
      super.debit(40);
    }
    else{
      super.debit(money);
    }

    if (this.getBalance < 50){
        console.log("you have to pay a $40 fine. your funds are under $50")
        super.debit(40);
    }
  }
}

class SavingsAccount extends BankAccount {
  #checking;
  constructor(member) {
    super(member);
    member.setSavings = this;
    this.debitTransactions = 0;
  };
  linkChecking (checking){
    this.#checking = checking;
  }
  transferToChecking(amount){
    if (this.debitTransactions >= 10){
        console.log("you have exceeded 10 transactions, you incur a $40 fee");
        this.debit(40)
    }
    else{
      this.#checking.credit(amount);
      this.debit(amount);
      this.debitTransactions++;
    }
  }
}

const distributeEvenly = (accounts, amount) => {
  let distributeAmount = Math.floor(amount/accounts.length);
  for (x of accounts){
    x.credit(distributeAmount)
  }
};
const distributeToSavings = (accounts, amount) => {
  const savingsaccount = accounts.filter(x => x instanceof SavingsAccount)
  let distributeAmount = Math.floor(amount/savingsaccount.length);
  for (x of savingsaccount){
    x.credit(distributeAmount)
  }
};

//test functionality down here

let member1 = new Member('Claire');
let account = new BankAccount(member1);
//Test each of the functions of the bank account
account.setBalance = 500;
console.log(account.getBalance);
account.credit(50);
console.log(account.getBalance);
account.debit(100);
console.log(account.getBalance);
 
console.log(BankAccount.retrieveTransactions(account));
console.log(account.checkBalance());

//test functions of checking account. includes to see if base class methods have same functionality and extending class as unique functionality
let account2 = new CheckingAccount(member1);
account2.setBalance = 500; 
console.log(account2.checkBalance());
account2.credit(50);
console.log(account2.getBalance);
account2.debit(600);
console.log(account2.getBalance);
account2.debit(470);
console.log(BankAccount.retrieveTransactions(account2));
console.log(account2.getBalance);


//test functions of savings account
let account3 = new SavingsAccount(member1);
account3.setBalance = 500;
console.log(account2.checkBalance());
account3.credit(50);
console.log(account2.getBalance);
account3.debit(400);
console.log(BankAccount.retrieveTransactions(account3));
account3.linkChecking(account2)


for (let i = 0; i < 10; i++){
  account3.transferToChecking(10);
  console.log("savings:")
  console.log(account3.getBalance);
  console.log("checking:")
  console.log(account2.getBalance)
}

//should get alert here 
account3.transferToChecking(10);
console.log("savings:")
console.log(account3.getBalance);
console.log("checking:")
console.log(account2.getBalance)

//check the polymorphism functions
let account4 = new SavingsAccount(member1);
let account5 = new CheckingAccount(member1);
let account6 = new SavingsAccount(member1);
let account7 = new CheckingAccount(member1);
let accountlist = [account4, account5, account6, account7];
distributeEvenly(accountlist, 200);
console.log(account4.getBalance);
console.log(account5.getBalance);
console.log(account6.getBalance);
console.log(account7.getBalance);

distributeToSavings(accountlist, 200);
console.log(account4.getBalance);
console.log(account5.getBalance);
console.log(account6.getBalance);
console.log(account7.getBalance);