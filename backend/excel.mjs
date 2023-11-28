import google from "googleapis";
import User from "./models/User.mjs";
import axios from "axios";
import Expense from "./models/Expense.mjs";

export async function getData() {
  const spreadsheetId = '113wmQmY6N0zzM2iZY5AzA0TvX2BV4JeAe1ViY8HvYJc';
  const range = 'SheetQR!A:F';
  const apiKey = 'AIzaSyA_Espv5PiD_-6fgQj1nDyX8wb5e-kytp4';

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;

  //https://sheets.googleapis.com/v4/spreadsheets/113wmQmY6N0zzM2iZY5AzA0TvX2BV4JeAe1ViY8HvYJc/values/SheetQR!C:C?key=AIzaSyA_Espv5PiD_-6fgQj1nDyX8wb5e-kytp4

  try {
    const response = await axios.get(url);
    const values = response.data.values;

    if (values.length) {

      for (const row of values) {
        const user = await User.findOne({ username: row[2] });

        if (user != null) {
            const existingExpense = await Expense.findOne({ 
                user: user, 
                description: row[4],
                amount: row[5], 
                category: row[3], 
                date: row[0] 
            });
    
            if (existingExpense == null) {
                const newExpense = new Expense({
                    user: user._id, 
                    description: row[4],
                    amount: row[5],
                    category: row[3],
                    date: row[0]
                });
                
                await newExpense.save();
                //console.log('New Expense:', newExpense);
            } else {
                //console.log('Expense already exists:', existingExpense);
            }
        }
    }

    } else {
      console.log('No data found.');
    }
    
  } catch (error) {
    console.error('Error retrieving data:', error.response ? error.response.data : error.message);
  }

}

// getData();