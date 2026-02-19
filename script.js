
function register() {

    let username = document.getElementById("regUsername").value;
    let email = document.getElementById("regEmail").value;
    let password = document.getElementById("regPassword").value;
    let confirm = document.getElementById("confirm").value;

    if (!username || !email || !password || !confirm) {
        alert("Please fill all fields");
        return;
    }

    if (password !== confirm) {
        alert("Passwords do not match");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let userExists = users.find(user => user.email === email);

    if (userExists) {
        alert("User already exists");
        return;
    }

    users.push({ username, email, password });

    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("loggedInUser", username);

    window.location.href = "dashboard.html";
}



function login() {

    let email = document.getElementById("loginEmail").value;
    let password = document.getElementById("loginPassword").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let validUser = users.find(user =>
        user.email === email && user.password === password
    );

    if (validUser) {
        localStorage.setItem("loggedInUser", validUser.username);
        window.location.href = "dashboard.html";
    } else {
        alert("Invalid email or password");
    }
}



function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
}




function protectDashboard() {

    let currentUser = localStorage.getItem("loggedInUser");

    if (!currentUser) {
        window.location.href = "login.html";
        return;
    }

    let welcome = document.getElementById("welcomeUser");
    if (welcome) {
        welcome.innerText = "Welcome " + currentUser;
    }
}




let products = JSON.parse(localStorage.getItem("products")) || [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let editIndex = null;



function displayDashboardProducts(list = products) {

    let tableBody = document.querySelector("#dashboardTable tbody");
    if (!tableBody) return;

    tableBody.innerHTML = "";

    list.forEach((p, index) => {

        let row = document.createElement("tr");

        row.innerHTML = `
            <td>${p.name}</td>
            <td>${p.id}</td>
            <td>${p.quantity}</td>
            <td>${p.price}</td>
            <td>
                <button onclick="editProduct(${index})">Edit</button>
                <button onclick="deleteProduct(${index})">Delete</button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}



let form = document.getElementById("productForm");

if (form) {
    form.addEventListener("submit", function (e) {

        e.preventDefault();

        let product = {
            name: document.getElementById("productName").value,
            id: document.getElementById("productId").value,
            quantity: parseInt(document.getElementById("quantity").value),
            price: document.getElementById("price").value
        };

        if (editIndex !== null) {
            products[editIndex] = product;
            editIndex = null;
        } else {
            products.push(product);
        }

        localStorage.setItem("products", JSON.stringify(products));

        displayDashboardProducts();
        this.reset();
    });
}



function editProduct(index) {

    let product = products[index];

    document.getElementById("productName").value = product.name;
    document.getElementById("productId").value = product.id;
    document.getElementById("quantity").value = product.quantity;
    document.getElementById("price").value = product.price;

    editIndex = index;
}



function deleteProduct(index) {

    if (confirm("Delete this product?")) {

        products.splice(index, 1);
        localStorage.setItem("products", JSON.stringify(products));
        displayDashboardProducts();
    }
}



// SEARCH
function searchProduct() {

    let input = document.getElementById("searchInput").value.toLowerCase();

    let filtered = products.filter(p =>
        p.name.toLowerCase().includes(input)
    );

    displayDashboardProducts(filtered);
}



// ================= PAGE LOAD =================

window.onload = function () {

    // If dashboard page exists → protect it
    if (document.getElementById("dashboardTable")) {
        protectDashboard();
    }

    displayDashboardProducts();
};
