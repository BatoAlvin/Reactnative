import { sql } from "../config/db.js";

export async function getTransactionsByUserId(req, res) {
  try {
    const {userId} =  req.params;
    console.log(userId);

    const transactions = await sql `
    SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC
    `;
  } catch (e) {
console.log("Error getting transactions", e);
return res.status('500').json({ message: "Internal server error"});
  }
}

export async function createTransaction(req, res) {
try
{
const {title, amount, category, user_id} = req.body
if (!title || !category || !user_id || amount === undefined) {
  return res.status('400').json({ message: "All fields are required" });
}
const transactions = await sql`
INSERT INTO transactions(user_id,title,amount,category)
VALUES (${user_id}, ${title}, ${amount}, ${category})
RETURNING *
`;
console.log(transactions);
res.status(201).json(transactions[0]);
} catch(error){
console.log("All fields are required", error);
return res.status('500').json({ message: "Internal server error"});
}
}


export async function deleteTransaction(req, res) {
  try {
    const {id} = req.params;
    //Since in our params its a string, we need to convert it to a number so that we can delete successfully e.g dsa,12, this prevents our server from crashing
    if(isNaN(parseInt(id))) {
      return res.status(400).json({message: "Invalid transaction ID"})
    }
    const result = await sql `
    DELETE FROM transactions WHERE id = ${id} RETURNING *
    `
    if (result.length == 0) {
      return res.status(404).json({message: "Unable to find a record to delete"});
    }
    res.status(201).json({message: "Record deleted successfully"});
  } catch (e) {
    console.log("Error deleting a record", e);
    return res.status(500).json({message: "Internal server error"});
  }

}

export async function summaryTransaction(req, res) {
  try {
    const {userId} = req.params;
    // So we get total amount ifnot their we get 0, then we call it balance 
    //Income +, expenses -, so income >0 and expenses <0
    const balanceResult = await sql `
    SELECT COALESCE(SUM(amount), 0) as balance FROM transactions WHERE user_id = ${userId}
    `

    const incomeResult = await sql `
    SELECT COALESCE(SUM(amount), 0) as income FROM transactions WHERE user_id = ${userId} AND amount > 0
    `

    const expensesResult = await sql `
    SELECT COALESCE(SUM(amount), 0) as expenses FROM transactions WHERE user_id = ${userId} AND expenses < 0
    `

    res.status(200).json({
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expenses: expensesResult[0].expenses,
    })
  } catch (e) {

  }

}