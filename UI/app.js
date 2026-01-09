// ui/app.js

let accessToken = localStorage.getItem("accessToken");;
let refreshToken = localStorage.getItem("refreshToken");;

const responseDiv = document.getElementById('response');

// Signup
async function signup() {
    const username = document.getElementById('signupUsername').value;
    const password = document.getElementById('signupPassword').value;

    const res = await fetch('http://localhost:4000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (data.access_token && data.refresh_token) {
        accessToken = data.access_token;
        refreshToken = data.refresh_token;


        localStorage.setItem("accessToken", data.access_token);
        localStorage.setItem("refreshToken", data.refresh_token);
    }
    if (res.ok) {
        alert("Signup successful. Please login.");
        window.location.href = "login.html"; // 👈 redirect
    } else {
        responseDiv.innerText = data.error || "Signup failed";
    }
    responseDiv.innerText = JSON.stringify(data, null, 2);
};

// Login
async function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    const res = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    responseDiv.innerText = JSON.stringify(data, null, 2);

    if (res.ok) {
        window.location.href = "index.html"; // 👈 redirect
    } else {
        responseDiv.innerText = data.error || "Signup failed";
    }
};

// Get Posts
async function getPosts() {
    if (!accessToken) { alert("Login first!"); return; }

    let res = await fetch('http://localhost:3000/posts', {
        headers: { 'Authorization': 'Bearer ' + accessToken }
    });

    if (res.status === 401 || res.status === 403) {
        // responseDiv.innerText = "Access denied. Try refreshing token.";
        // return;
        await refreshtoken(); // refresh
        res = await fetch('http://localhost:3000/posts', {
            headers: { Authorization: 'Bearer ' + accessToken }
        });
    }

    const text = await res.text();
    responseDiv.innerText = text;
};

async function refreshtoken() {
    let res = await fetch('http://localhost:4000/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken })
    });
    const data = await res.json();
    accessToken = data.access_token

    // signup()

}

// Logout
async function logout() {
    console.log(refreshToken)
    if (!refreshToken) { alert("Login first!"); return; }

    await fetch('http://localhost:4000/logout', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken })
    });

    accessToken = null;
    refreshToken = null;
    responseDiv.innerText = "Logged out successfully";
};
