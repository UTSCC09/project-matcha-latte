import express from "express";
// import Mongodb from "mongodb";
// import multer from "multer";
import {dbo} from "./connection.mjs";
import User from "./models/User.mjs";
import Budget from "./models/Budget.mjs";
import Expense from "./models/Expense.mjs";
// import Notification from "./models/Notification.mjs";
// import UpcomingPayment from "./models/UpcomingPayment.mjs";
import JA from "./models/JointAccount.mjs";
import { getData } from './excel.mjs';
// import { MongoClient } from "mongodb"
import cron from 'node-cron';
// import { rmSync } from "fs";
import session from "express-session";
import { parse, serialize } from "cookie";
import { compare, genSalt, hash } from "bcrypt";
import { addUser, addBudget, addExpense, addNotif, getNotif, addPayment, getUpcomingPayments, addJA, getAllAccounts, deleteNotification} from "./mongoUtils.mjs";

//const upload = multer({ dest: ("uploads") });

import { createServer } from "http";

const PORT = 4000;
const app = express();

app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.status(200).end();
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("static"));

app.use(
  session({
    secret: "changed",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});

app.use(function (req, res, next) {
  req.username = req.session.username ? req.session.username: null;
  console.log("HTTPS request", req.username, req.method, req.url, req.body);
  next();
});

function isAuthenticated(req, res, next) {
  if (!req.session.username) return res.status(401).end("access denied");
  next();
}

// ---------------- User ------------------

app.post("/signup/", async function (req, res, next) {
  try {
    const { username, password, email, monthly_income, picture } = req.body;

    // Check if the username or email already exists
    const existingUser = await User.findOne({ $or: [{ username: username }, { email: email }] });

    if (existingUser) {
      const conflictField = existingUser.username.toLowerCase === username.toLowerCase ? 'Username' : 'Email';
      const conflictValue = existingUser.username.toLowerCase === username.toLowerCase ? existingUser.username : existingUser.email;
      return res.status(409).end(`${conflictField} '${conflictValue}' already in use.`);
    }    

    // Generate a new salt and hash
    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    // Use the addUser function to add the new user
    const savedUser = await addUser(username, email, hashedPassword, monthly_income, picture);

    // Start a session
    req.session.username = savedUser.username;

    // Initialize cookie
    res.setHeader(
      "Set-Cookie",
      serialize("username", savedUser.username, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      })
    );
    return res.json(savedUser.username);
  } catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// app.post("/signin/", async function (req, res, next) {
//   console.log("req", req.body);
//   try {
//     const { username, password } = req.body;

//     // Check if the user exists
//     const user = await User.findOne({ username: username });

//     if (!user) {
//       return res.status(401).end("Invalid username or password");
//     }

//     // Check if the password is correct
//     const passwordMatch = await compare(password, user.password);

//     if (!passwordMatch) {
//       return res.status(401).end("Invalid username or password");
//     }

//     // Start a session
//     req.session.username = user.username;

//     // Initialize cookie
//     res.setHeader(
//       "Set-Cookie",
//       serialize("username", user.username, {
//         path: "/",
//         maxAge: 60 * 60 * 24 * 7,
//       })
//     );

//     return res.json(user.username);
//   } catch (error) {
//     console.error("Error during signin:", error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// });
// const signinHandler = async function (req, res, next) {
//   try {
//     const { username, password } = req.body;

//     // Check if the user exists
//     const user = await User.findOne({ username: username });

//     if (!user) {
//       return res.status(401).end("Invalid username");
//     }

//     // Check if the password is correct
//     const passwordMatch = await compare(password, user.password);

//     if (!passwordMatch) {
//       return res.status(401).end("Invalid password");
//     }

//     // Start a session
//     req.session.username = username;

//     console.log("HELLLOOOOOO", req.session.username);

//     // Initialize cookie
//     res.setHeader(
//       "Set-Cookie",
//       serialize("username", username, {
//         path: "/",
//         maxAge: 60 * 60 * 24 * 7,
//       })
//     );

//     return res.json(username);
//   } catch (error) {
//     console.error("Error during signin:", error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// // Use the signinHandler function as the route handler
// app.post("/signin/", async function (req, res, next) {
//   try {
//     await signinHandler(req, res, next);
//   } catch (error) {
//     console.error("Error during signin route handling:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

const signinHandler = async function (req, res, next) {
  try {
    const { username, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ username: username });

    if (!user) {
      return res.status(401).end("Invalid username");
    }

    // Check if the password is correct
    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).end("Invalid password");
    }

    // Start a session
    req.session.username = username;

    // Initialize cookie
    res.setHeader(
      "Set-Cookie",
      serialize("username", req.session.username, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      })
    );

    // Log session information
    console.log("HELLOOOOOO", req.session.username);

    return res.json(req.session.username);
  } catch (error) {
    console.error("Error during signin:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Use the signinHandler function as the route handler
app.post("/signin/", async function (req, res, next) {
  try {
    await signinHandler(req, res, next);
    console.log("------------------------------Session after signin:", req.session);
  } catch (error) {
    console.error("Error during signin route handling:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.post("/signout/", function (req, res) {
  try {
    // Clear the session
    req.session.destroy();

    // Clear the username cookie
    res.clearCookie("username", { path: "/" });

    return res.status(200).end("Signed out successfully");
  } catch (error) {
    console.error("Error during sign-out:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/signout/", function (req, res, next) {
  try {
    // Clear the session
    req.session.destroy();

    // Clear the username cookie
    res.setHeader(
      "Set-Cookie",
      serialize("username", "", {
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 week in number of seconds
      })
    );

    res.redirect("/");
  } catch (error) {
    console.error("Error during sign-out:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// ---------------- Joint Account ----------------

app.post("/ja/signup/", async function (req, res, next) {
  try {
    const { user_id1, user_id2 } = req.body;

    // Check if a join account with the given pair of user IDs already exists
    const existingJA = await JA.findOne({
      $or: [
        { $and: [{ user1: user_id1 }, { user2: user_id2 }] },
        { $and: [{ user1: user_id2 }, { user2: user_id1 }] },
      ],
    });

    if (existingJA) {
      return res.status(409).end('Join account already exists for these users.');
    } 

    const newJA = await addJA(user_id1, user_id2);
    res.status(201).json(newJA);

    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
});

app.get("/api/jas/:userId/", async function (req, res, next) {
  const { userId } = req.params;
  try {
    const accounts = await getAllAccounts(userId);
    return res.json(accounts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// when the user clicks on the join account, call this. 
app.post("/api/join/:accountId/", isAuthenticated, function (req, res) {
  const { accountId } = req.params;
  req.session.userId = accountId;
  res.status(200).json({ message: "User session updated successfully", userId: req.session.userId });
});

// when the user clicks on their own account, call this.
app.post("/api/user/:userId/", isAuthenticated, function (req, res) {
  const { userId } = req.params;
  req.session.userId = userId;
  res.status(200).json({ message: "User session updated successfully", userId: req.session.userId });
});


// ---------------- Budget ----------------

app.post("/api/budget/:userId/:userType/", async function (req, res, next) {
  const { userId, userType } = req.params;
  const { category, amount } = req.body;

  try {
    const result = await addBudget(userId, userType, category, amount);
    return res.json(result);
  } catch (error) {
    console.error("Error adding budget:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/budgets/:userId", async function (req, res, next) {
  //res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  try {
    const userId = req.params.userId;
    const budgets = await Budget.find({ user: userId });

    // Create an array of objects with category names and budget assigned
    const formattedBudgets = budgets.map((budget) => ({
      [budget.category]: budget.amount,
    }));

    res.status(200).json(formattedBudgets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
// ---------------- Expense ----------------

//curl -X POST -H "Content-Type: application/json" -d '{"category": "Food", "amount": 1000000000, "description":"this is testing!!"}' http://localhost:4000/api/expense/655186ae38a6ded67206d572
app.post("/api/expense/:userId/:userType/", async function (req, res, next) {
  const { userId, userType } = req.params;
  const { description, category, amount } = req.body;

  try {
    const result = await addExpense(userId, userType, description, category, amount);
    return res.json(result);
  } catch (error) {
    console.error("Error adding expense:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// ---------------- Notification ----------------

app.post("/api/notif/:userId/:userType/", async function (req, res, next) {
  const { userId, userType } = req.params;
  const { content, category } = req.body;

  try {
    const result = await addNotif(userId, userType, content, category);
    return res.json(result);
  } catch (error) {
    console.error("Error adding notif:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/notifs/:id/", async function (req, res, next) {
  try {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 20;
    const items = await getNotif(req.params.id, page, limit);
    return res.json(items);
  } catch (error) {
    console.error("Error getting notifications:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/api/notifs/:notifId/", async function (req, res, next) {
  try {
    const notifId = req.params.notifId;
    const result = await deleteNotification(notifId);
    return res.json({ message: "Notification deleted successfully", result });
  } catch (error) {
    console.error("Error deleting notification:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// ---------------- Payment ----------------

//curl -X POST -H "Content-Type: application/json" -d '{"frequency": "monthly", "amt": 100, "end_date": "'"$(date -I)"'", "category": "Food"}' http://localhost:4000/api/payment/655c69379c60f76c90e03045/
app.post("/api/payment/:userId/:userType/", async function (req, res, next) {
  const { userId, userType} = req.params;
  const { frequency, amt, end_date, category } = req.body;

  try {
    const result = await addPayment(userId, userType, frequency, category, amt, end_date);
    return res.json(result);
  } catch (error) {
    console.error("Error adding payment:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/upcomingPayments/:userId", async function (req, res, next) {
  try {
    const userId = req.params.userId;
    const items = await getUpcomingPayments(userId);
    return res.json(items);
  }catch (error) {
    console.error("Error getting upcoming payments:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// ------------------------------ old ----------------------

// Route to get all expenses for a specific user
app.get("/expenses/:userId/", async function (req, res, next) {
  //res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  try {
    const userId = req.params.userId;
    const expenses = await Expense.find({ user: userId });
    // Create an object with aggregated amounts for each category
    const aggregatedExpenses = expenses.reduce((result, expense) => {
      const { category, amount } = expense;

      // If the category already exists, add the amount; otherwise, create a new entry
      result[category] = (result[category] || 0) + amount;

      return result;
    }, {});

    // Convert the aggregated object into an array of objects with [category_name]: [amount] format
    const formattedExpenses = Object.entries(aggregatedExpenses).map(([category, amount]) => ({
      [category]: amount,
    }));

    res.status(200).json(formattedExpenses);
    //console.log("These are the expences: ", expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

cron.schedule('*/10 * * * * *', async () => {
  getData();
});

// app.get("/budgets/:userId", async (req, res) => {
//   res.header("Access-Control-Allow-Origin", "http://localhost:3000");
//   try {
//     const userId = req.params.userId;
//     const budgets = await Budget.find({ user: userId });

//     // Create an array of objects with category names and budget assigned
//     const formattedBudgets = budgets.map((budget) => ({
//       [budget.category]: budget.amount,
//     }));

//     res.status(200).json(formattedBudgets);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

const httpServer = createServer(app).listen(PORT, (err) => {
    if (err) console.log(err);
    else console.log("HTTP server on http://localhost:%s", PORT);
  
    // perform a database connection when server starts
    dbo.connectToServer((err) => {
      if (err) console.error(err);
    });
  });

  