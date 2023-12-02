import express from "express";
import {dbo} from "./connection.mjs";
import User from "./models/User.mjs";
import Budget from "./models/Budget.mjs";
import Expense from "./models/Expense.mjs";
import JA from "./models/JointAccount.mjs";
import Request from "./models/Request.mjs";
import { getData } from './excel.mjs';
import cron from 'node-cron';
import session from "express-session";
import { parse, serialize } from "cookie";
import { compare, genSalt, hash } from "bcrypt";
import cookieParser from "cookie-parser";
import cors from 'cors';
import { addUser, addBudget, addExpense, addNotif, getNotif, addPayment, getUpcomingPayments, addJA, getAllAccounts, deleteNotification} from "./mongoUtils.mjs";
import { createServer } from "http";

const PORT = 4000;
const app = express();

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("static"));

app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000',
}));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Origin, Content-Type, X-Requested-With, Accept");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});

app.use(
  session({
    secret: 'changed',
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true, //false
      secure: false, // Set to true if using HTTPS // false
      sameSite: 'strict' //strict
    },
  })
);

app.use(function (req, res, next) {
  console.log("HTTPS request", req.session.username, req.method, req.url, req.body);
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
    req.session.userID = savedUser._id;
    req.session.userType = "UserColl";

    // Initialize cookies
    const cookies = [
      serialize("username", username, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      }),
      serialize("userID", savedUser._id, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      }),
      serialize("userType", "UserColl", {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      }),
    ];

    // Set the "Set-Cookie" header with the array of cookies
    res.setHeader("Set-Cookie", cookies);

    // Return the response
    return res.json({
      username: savedUser.username,
      userID: savedUser._id,
      userType: "UserColl",
    });

    
  } catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/signin/", async function (req, res, next) {
  console.log("req", req.body);
  try {
    const username = req.body.username;
    const password = req.body.password;

    // Check if the user exists
    const user = await User.findOne({ username: username });

    if (!user) {
      return res.status(401).end("Invalid username or password");
    }

    // Check if the password is correct
    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).end("Invalid username or password");
    }


    // Start a session
    req.session.username = username;
    req.session.userID = user._id;
    req.session.userType = "UserColl";

    // Initialize cookies
    const cookies = [
      serialize("username", username, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      }),
      serialize("userID", user._id, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      }),
      serialize("userType", "UserColl", {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      }),
    ];

    // Set the "Set-Cookie" header with the array of cookies
    res.setHeader("Set-Cookie", cookies);

    // Return the response
    return res.json({
      username: user.username,
      userID: user._id,
      userType: "UserColl",
    });


  } catch (error) {
    console.error("Error during signin:", error);
    return res.status(500).json({ error: "Internal Server Error" });
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

    // Clear the cookies
    const cookies = [
      cookie.serialize("username", "", {
        path: "/",
        maxAge: 0, // Set maxAge to 0 to expire the cookie immediately
      }),
      cookie.serialize("userID", "", {
        path: "/",
        maxAge: 0,
      }),
      cookie.serialize("userType", "", {
        path: "/",
        maxAge: 0,
      }),
    ];

    res.setHeader("Set-Cookie", cookies);

    res.redirect("/");
  } catch (error) {
    console.error("Error during sign-out:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create a route for getting all users
app.get("/api/users/", isAuthenticated, async function (req, res, next) {
  try {
    
    const users = await User.find({});
  
    if (users.length === 0) {
      return res.status(404).json({ message: "No users in the db." });
    }
    //console.log("These are the users: ", users);
    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/api/user/:userName/sendRequest", async function (req, res, next) {
  const loggedInUserId = req.session.username;
  const requestedUserId = req.params.userName;
  let existingRequest;
  try {
    existingRequest = await Request.findOne({
      $or: [
        { from: loggedInUserId, to: requestedUserId },
        { from: requestedUserId, to: loggedInUserId },
      ]
    })


    if (existingRequest) {
      return res.status(400).json({error: "Request already sent or received"});
    }

    const newRequest = new Request({
      from: loggedInUserId,
      to: requestedUserId,
    });

    // Save the request to the database
    const req = await newRequest.save();

    res.status(201).json(req);
  } catch (error) {
    //console.error("Error creating request:", error);
    res.status(500).json({error:"Error creating request"});
  }
});



app.get("/api/user/:userName/requests/", async function (req, res, next) {
  const userName = req.params.userName;

  try {
    // Find requests where the user is either the sender or receiver
    const allRequests = await Request.find({ $or: [{ from: userName }, { to: userName }] });

    // Create a hashmap to organize the data
    const requestMap = {
      sent: allRequests.filter(request => request.from === userName && request.to !== undefined).map(request => request.to),
      received: allRequests.filter(request => request.to === userName && request.from !== undefined).map(request => request.from),
    };
    res.json(requestMap);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// app.delete("/api/user/:userName/requests/:requestId", async function (req, res, next){
//   const userName = req.params.userName;
//   const requestId = req.params.requestId;

//   console.log("this is request id", requestId);

//   try {
//     // Find and remove the request from the database
//     const deletedRequest = await Request.findOneAndRemove({
//       $or: [
//         { $and: [{ from: userName }, { to: requestId }] },
//         { $and: [{ to: userName }, { from: requestId }] },
//       ],
//     });

//     if (!deletedRequest) {
//       return res.status(404).json({ error: 'Request not found' });
//     }

//     console.log(`Request deleted successfully: ${deletedRequest}`);

//     // You can also send a success response if needed
//     res.status(200).json({ message: 'Request deleted successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

app.delete("/api/user/:userName/requests/:requestId", async function (req, res, next){
  const userName = req.params.userName;
  const requestId = req.params.requestId;

  console.log("this is request id", requestId);

  try {
    // Find and remove the request from the database
    const deletedRequest = await Request.findOneAndDelete({
      $or: [
        { $and: [{ from: userName }, { to: requestId }] },
        { $and: [{ to: userName }, { from: requestId }] },
      ],
    });

    if (!deletedRequest) {
      return res.status(404).json({ error: 'Request not found' });
    }

    console.log(`Request deleted successfully: ${deletedRequest}`);

    // You can also send a success response if needed
    res.status(200).json({ message: 'Request deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
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

app.get("/api/budgets/:userId", async function (req, res, next) {
  try {
    const userId = req.params.userId;
    const budgets = await Budget.find({ userRef: userId });
  
    if (budgets.length === 0) {
      return res.status(404).json({ message: "No budgets found for the user." });
    }
  
    const formattedBudgets = budgets.map((budget) => ({
      [budget.category]: budget.amount,
    }));
  
    return res.status(200).json(formattedBudgets);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
  
});
// ---------------- Expense ----------------
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

app.get("/api/expenses/:userId", async function (req, res, next) {
  try {
    const userId = req.params.userId;
    const { page, pageSize } = req.query;

    let query = { userRef: userId };

    if (page && pageSize) {
      const skip = (page - 1) * pageSize;
      query = { ...query, skip, limit: parseInt(pageSize) };
    }

    const expenses = await Expense.find(query);

    if (expenses.length === 0) {
      return res.status(404).json({ message: "No expenses found for the user." });
    }

    const formattedExpenses = expenses.map((expense) => ({
      [expense.category]: [expense.amount, expense.description, expense.date]
    }));

    return res.status(200).json(formattedExpenses);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
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


const httpServer = createServer(app).listen(PORT, (err) => {
    if (err) console.log(err);
    else console.log("HTTP server on http://localhost:%s", PORT);
  
    // perform a database connection when server starts
    dbo.connectToServer((err) => {
      if (err) console.error(err);
    });
  });

  