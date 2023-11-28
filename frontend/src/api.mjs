// function send(method, url, data){
//     console.log(method, url, data)
//     return fetch(url, {
//         method: method,
//         headers: {"Content-Type": "application/json"},
//         body: (data)? JSON.stringify(data): null,
//     })
//     .then(x => x.json())
// }

// function send(method, url, data){
//     return fetch(`${process.env.NEXT_PUBLIC_BACKEND}${url}`, {
//         method: method,
//         headers: {"Content-Type": "application/json"},
//         body: (data)? JSON.stringify(data): null,
//     })
//     .then(x => x.json())
// }

function send(method, url, data){
  return fetch(`http://localhost:4000${url}`, {
      method: method,
      headers: {"Content-Type": "application/json"},
      body: (data)? JSON.stringify(data): null,
  })
  .then(x => x.json())
}



function sendFiles(method, url, data, callback) {
    const formdata = new FormData();
    Object.keys(data).forEach(function (key) {
      const value = data[key];
      formdata.append(key, value);
    });
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      if (xhr.status !== 200)
        callback("[" + xhr.status + "]" + xhr.responseText, null);
        else callback(null, JSON.parse(xhr.responseText));
      };
      xhr.open(method, url, true);
      xhr.send(formdata);
}

export function getUsername() {
    return document.cookie.replace(
      /(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/,
      "$1",
    );
}

// ------------ Signin/ Singnup -----------------
export function signin(username, password, callback) {
  console.log("helllllllppp");
    send("POST", "/signin/", { username, password }, function(err, res){
      if (err) return callback(err);
      else return callback(res);
    },
)};

export function signup(username, password, email, callback) {
    send("POST", "/signup/", { username, password , email}, callback);
}

export function getAllAccounts(userId, callback){
  send("GET", "/api/jas/" + userId + "/", function(err, res){
    if (err) return callback(err);
    else return callback(res);
  },
)};

export function joinAccUser(joinAccId, callback){
  send ("POST", "/api/join/" + joinAccId + "/", callback);
}

export function defaultUser(userId, callback){
  send ("POST", "/api/user/" + userId + "/", callback);
}

// ------------------ Budget ----------------------
export function addBudget(userId, userType, category, amt, callback) {
    send("POST", "/api/budget/" + userId + "/" + userType + "/", { category: category, amount: amt }, function (err, res) {
      if (err) return callback(err);
      else return callback(res);
    },
  )};

  export function getBudget(userId){
    return send ("GET", "/api/budgets/" + userId + "/", null)
  }

// ----------------- Expense ----------------------
export function addExpense(userId, userType, category, amt, description, callback) {
    send("POST", "/api/expense/" + userId + "/" + userType + "/", { description: description, category: category, amount: amt }, function (err, res) {
      if (err) return callback(err);
      else return callback(res);
    },
  )};



  export function getExpenses(userId){
    return send ("GET", "/api/expenses/" + userId + "/", null)
  }


// ----------------- Notification -----------------
export function addNotif(userId, userType, category, content, callback) {
    send("POST", "/api/notif/" + userId + "/"+ userType + "/", { category: category, content: content}, function (err, res) {
      if (err) return callback(err);
      else return callback(res);
    },
  )};

export function getNotif(id) {
  return send("GET", "/api/notifs/" + id + "/", null);
}

export function deletenotif(id){
  return send("DELETE", "/api/notifs/" + id + "/", null);
};

// ----------------- Upcoming Payment -----------------
export function addPayment(userId, userType, category, amt, end_date, frequency , callback) {
    send("POST", "/api/payment/" + userId + "/"+ userType + "/", { category: category, amt: amt , end_date: end_date, frequency: frequency}, function (err, res) {
      if (err) return callback(err);
      else return callback(res);
    },
  )};

export function getUpcomingPayment(userId) {
  send("GET", "/api/upcomingPayments/" + userId + "/", null);
}