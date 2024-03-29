import './budget.css';
import '../theme.css';
import '../../partials/sidebar.css';
import '../../partials/Cards/cards.css';
import Sidebar from '../../partials/sidebar';
import Card from '../../partials/Cards/cards';
import React, { useEffect, useState } from "react";
import { getUserID, getBudget, getExpenses, addBudget, getUserType, updateBudget , addNotif} from "../../api.mjs";
import Pie from '../../partials/PieChart/pie';

const allCategories = ["Food", "Groceries", "Shopping", "Personal Care", "Insurance", "Tuition", "Transportation", "Entertainment", "Utilities", "Miscellaneous"];

export const BudgetPage = () => {
  const userID = getUserID();
  const userType = getUserType();
  const [budget, setBudget] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});
  const [newBudgetCategory, setNewBudgetCategory] = useState('');
  const [newBudgetAmount, setNewBudgetAmount] = useState('');
  const [newChangeBudgetCategory, setNewChangeBudgetCategory] = useState('');
  const [newChangeBudgetAmount, setNewChangeBudgetAmount] = useState('');
  

  useEffect(() => {
    getBudget(userID)
      .then((budgetData) => {
        setBudget(budgetData);
      })
      .catch((error) => {
        console.error("Error fetching budget:", error);
      });
  }, [userID]);

  useEffect(() => {
    getExpenses(userID)
      .then((ExpenseData) => {
        setExpenses(ExpenseData);
      })
      .catch((error) => {
        console.error("Error fetching expenses:", error);
      });
  }, [userID]);

  useEffect(() => {
    const createCategoryMap = () => {
      const map = {};

      if (!Array.isArray(budget)) {
        return map; // or handle it appropriately
      }

      budget.forEach((item) => {
        
        const category = Object.keys(item)[0];
        const amount = Object.values(item)[0];
        const spent = calculateExpensesTotal(category);
        const budgetId = item.budgetId;
        const remaining = amount - spent;

        map[category] = [spent, remaining, budgetId];
      });

      setCategoryMap(map);
    };

    const calculateExpensesTotal = (category) => {
      if(Array.isArray(expenses)){
        return expenses.reduce((total, expense) => {
          if (Object.keys(expense)[0] === category) {
            return total + Object.values(expense)[0][0];
          }
          return total;
        }, 0);
      }else{
        return 0;
      }
    };

    createCategoryMap();
  }, [budget, expenses]);

  // const handleAddBudget = async (e) => {
  //   e.preventDefault();
  
  //   try {
  //     const result = await addBudget(userID, userType, newBudgetCategory, parseFloat(newBudgetAmount));
  
  //     const updatedBudget = await getBudget(userID);
  //     setBudget(updatedBudget);
  
  //     setNewBudgetCategory('');
  //     setNewBudgetAmount('');
  //     const content = `Added ${newBudgetCategory} budget for \$${newBudgetAmount}!`;
  //     const notif = await addNotif(userID, userType, newBudgetCategory, content );

  //   } catch (error) {
  //     console.error("Error adding budget:", error);
  //   }
  // };

  const handleAddBudget = async (e) => {
    e.preventDefault();
  
    try {
      const result = await addBudget(userID, userType, newBudgetCategory, parseFloat(newBudgetAmount));
  
      setBudget([...budget, { [newBudgetCategory]: parseFloat(newBudgetAmount) }]);
  
      setNewBudgetCategory('');
      setNewBudgetAmount('');
  
      const content = `Added ${newBudgetCategory} budget for \$${newBudgetAmount}!`;
      const notif = await addNotif(userID, userType, newBudgetCategory, content);
    } catch (error) {
      console.error("Error adding budget:", error);
    }
  };
  

  const handleChangeBudget = async (e) => {
    e.preventDefault();

    try {
      await updateBudget(userID, userType, newChangeBudgetCategory, parseFloat(newChangeBudgetAmount));

      const updatedBudget = await getBudget(userID);
      setBudget(updatedBudget);

      setNewChangeBudgetCategory('');
      setNewChangeBudgetAmount('');

      const content = `Updated ${newChangeBudgetCategory} budget to \$${newChangeBudgetAmount}!`;
      const notif = await addNotif(userID, userType, newChangeBudgetCategory, content );
    } catch (error) {
      console.error("Error changing budget:", error);
    }
  };

  const nonBudgetCategories = allCategories.filter(category => !categoryMap[category]);
  const budgetCategories = Object.keys(categoryMap);

  const [isBudgetDeleted, setIsBudgetDeleted] = useState(false);

  const handleBudgetDelete = () => {
    // Perform any actions you want upon budget deletion
    setIsBudgetDeleted(true);
  };

  useEffect(() => {
    getBudget(userID)
      .then((budgetData) => {
        setBudget(budgetData);
      })
      .catch((error) => {
        console.error("Error fetching budget:", error);
      });
  }, [isBudgetDeleted]);

  return (
    <div className="screen">
      <div className="page">
        <div className="center">
          <Sidebar />
          <div className="middle m-6">
            <Card>
              <div className="container grid place-items-center h-screen">
                <h2 className="category">Add Budget</h2>
                <form className="center bg-white p-4 rounded">
                  <label className="block mb-2">
                    Category:
                    <select
                      className="input-field"
                      value={newBudgetCategory}
                      onChange={(e) => setNewBudgetCategory(e.target.value)}
                    >
                      <option value="">Select a category</option>
                      {nonBudgetCategories.map((category, index) => (
                        <option key={index} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block mb-2">
                    Amount:
                    <input
                      className="input-field"
                      type="number"
                      value={newBudgetAmount}
                      onChange={(e) => setNewBudgetAmount(e.target.value)}
                    />
                  </label>
                  <button
                    className="next py-2 rounded-md"
                    type="submit"
                    onClick={handleAddBudget}
                  >
                    Add Budget
                  </button>
                </form>
              </div>
            </Card>
            <Card>
              <div className="container grid place-items-center h-screen">
                <h2 className="category">Change Budget</h2>
                <form className="center bg-white p-4 rounded" onSubmit={handleChangeBudget}>
                  <label className="block mb-2">
                    Category:
                    <select
                      className="input-field"
                      value={newChangeBudgetCategory}
                      onChange={(e) => setNewChangeBudgetCategory(e.target.value)}
                    >
                    <option value="">Select a category</option>
                    {budgetCategories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                  </label>
                  <label className="block mb-2">
                    Amount:
                    <input
                      className="input-field"
                      type="number"
                      value={newChangeBudgetAmount}
                      onChange={(e) => setNewChangeBudgetAmount(e.target.value)}
                    />
                  </label>
                  <button
                    className="next py-2 rounded-md"
                    
                  >
                    Change Budget
                  </button>
                </form>
              </div>
            </Card>
            {Object.entries(categoryMap).map(([category, [spent, remaining, budgetId]], index) => (
              <div key={index}> 
                <Pie category={category} spent={spent} remaining={remaining} budgetId={budgetId} onBudgetDelete={handleBudgetDelete} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetPage;
