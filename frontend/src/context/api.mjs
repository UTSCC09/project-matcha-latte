// function send(method, url, data){
//     console.log(method, url, data)
//     return fetch(url, {
//         method: method,
//         headers: {"Content-Type": "application/json"},
//         body: (data)? JSON.stringify(data): null,
//     })
//     .then(x => x.json())
// }

function send(method, url, data) {
  return fetch(`${process.env.NEXT_PUBLIC_BACKEND}${url}`, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: data ? JSON.stringify(data) : null,
  }).then((x) => x.json());
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
    "$1"
  );
}

// ------------ Signin/ Singnup -----------------
export function signin(username, password, callback) {
  send("POST", "/signin/", { username, password }, callback);
}

export function signup(username, password, callback) {
  send("POST", "/signup/", { username, password }, callback);
}

// ------------------ Budget ----------------------
export function addBudget(userId, category, amt, callback) {
  send(
    "POST",
    "/api/budget/" + userId + "/",
    { category: category, amount: amt },
    function (err, res) {
      if (err) return callback(err);
      else return callback(res);
    }
  );
}

// ----------------- Expense ----------------------
export function addExpense(userId, category, amt, description, callback) {
  send(
    "POST",
    "/api/expense/" + userId + "/",
    { description: description, category: category, amount: amt },
    function (err, res) {
      if (err) return callback(err);
      else return callback(res);
    }
  );
}

// ----------------- Notification -----------------
export function addNotif(userId, category, content, callback) {
  send(
    "POST",
    "/api/notif/" + userId + "/",
    { category: category, content: content },
    function (err, res) {
      if (err) return callback(err);
      else return callback(res);
    }
  );
}

// ----------------- Upcoming Payment -----------------
export function addPayment(
  userId,
  category,
  amt,
  end_date,
  frequency,
  callback
) {
  send(
    "POST",
    "/api/payment/" + userId + "/",
    { category: category, amt: amt, end_date: end_date, frequency: frequency },
    function (err, res) {
      if (err) return callback(err);
      else return callback(res);
    }
  );
}
