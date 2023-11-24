import User from "./models/User.mjs";
import Budget from "./models/Budget.mjs";
import Expense from "./models/Expense.mjs";
import Notification from "./models/Notification.mjs";
import UpcomingPayment from "./models/UpcomingPayment.mjs";
import JA from "./models/JointAccount.mjs";



export async function addUser(username, email, password, monthly_income, picture) {
  try {
    const user = new User({
      username: username,
      email: email,
      password: password,
      monthly_income: monthly_income,
      picture: picture
    });

    const result = await user.save();
    return result;
  } catch (error) {
    throw error;
  }
}

export async function getUser(userId, userType) {
    try {
      const UserModel = (userType === 'UserColl') ? User : JA;
  
      const user = await UserModel.findById(userId);
  
      return user;
    } catch (error) {
      throw error;
    }
  }

export async function addBudget(userId, userType, category, amount) {
    try {
      const user = await getUser(userId, userType);
  
      if (!user) {
        throw new Error("User not found");
      }
  
      const budget = new Budget({
        userRef: userId,
        userType: userType,
        category: category,
        amount: amount,
      });
  
      await budget.save();
  
      return { message: "Budget added successfully" };
    } catch (error) {
      console.error("Error adding budget:", error);
      throw error; // Rethrow the error for the route handler to catch
    }
  }

export async function addExpense(userId, userType, description, category, amt) {
  try {
    const user = await getUser(userId, userType);
  
    if (!user) {
        throw new Error("User not found");
    }
    const expense = new Expense({ userRef: userId, userType: userType, description: description, category: category, amount: amt });
    const result = await expense.save();
    return result;
  } catch (error) {
    throw error;
  }
}

export async function addNotif(userId, userType, content, category) {
  try {
    const user = await getUser(userId, userType);
  
    if (!user) {
        throw new Error("User not found");
    }
    const notif = new Notification({ userRef: userId, userType: userType, content: content, category: category });
    const result = await notif.save();
    return result;
  } catch (error) {
    throw error;
  }
}

export async function addPayment(userId, userType, frequency, category, amount, end_date) {
  try {
    const user = await getUser(userId, userType);
    if (!user) {
      throw new Error("User not found");
    }
    const payment = new UpcomingPayment({ userRef: userId, userType: userType, frequency: frequency, category: category, amount: amount, end_date: end_date });
    const result = await payment.save();
    return result;
  } catch (error) {
    throw error;
  }
}

export async function addJA(user1, user2) {
  try {
    const joinAccount = new JA({
      user1: user1,
      user2: user2
    });

    const result = await joinAccount.save();
    return result;
  } catch (error) {
    throw error;
  }
}

export async function getUpcomingPayments(userId) {
  const today = new Date();
  const fifteenDaysLater = new Date();
  fifteenDaysLater.setDate(today.getDate() + 15);

  UpcomingPayment.find({
    user: userId,
    start_date: { $gte: today },
    end_date: { $lte: fifteenDaysLater }
  })
  .populate('user') 
  .exec((err, upcomingPayments) => {
    if (err) {
      console.error(err);
      callback(err, null);
    } else {
      callback(null, upcomingPayments);
    }
  });
}

export async function getNotif(userId, page, limit) {
    limit = Math.max(5, limit ? parseInt(limit) : 5);
    page = page || 0;
  
    try {
      const notifs = await Notification
        .find({ userRef: userId })
        .sort({ createdAt: -1 })
        .skip(page * limit)
        .limit(limit)
        .exec();
        
        console.log("Result:", notifs);
      return notifs;
    } catch (error) {
      throw error;
    }
  }

  export async function getAllAccounts(userId) {
    try{
        const accounts = await JA.find({ $or: [{ user1: userId }, { user2: userId }] })
        const joinAccountIds = accounts.map(account => account._id);
        // also send the user ids
        joinAccountIds.push(userId);
        return joinAccountIds;
    } catch (error) {
        throw error;
    }
  }

  export async function deleteNotification(notificationId) {
    try {
      const result = await Notification.findOneAndDelete({ _id: notificationId });
  
      return result;
    } catch (error) {
      throw error;
    }
  }
  