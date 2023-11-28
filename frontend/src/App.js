import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LogorsignPage from "./Pages/LogOrSign/logorsign";
import SignUpPage from "./Pages/Signup/signup";
// import SetbudgetPage from "./Pages/SetBudget/setbudget";
import LoginPage from "./Pages/Login/login";
import DashboardPage from "./Pages/Dashboard/dashboard";
import ExpensesPage from "./Pages/Expenses/expenses";
import BudgetPage from "./Pages/Budget/budget";
import ChatPage from "./Pages/Chat/chat";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LogorsignPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/expenses" element={<ExpensesPage />} />
        <Route path="/budget" element={<BudgetPage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
