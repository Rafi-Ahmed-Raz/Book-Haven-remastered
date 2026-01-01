// =========================================
// 1. UPDATED BOOK INVENTORY (Real Images)
// =========================================
let books = [
    { 
        id: 1, 
        title: "The Great Gatsby", 
        author: "F. Scott Fitzgerald", 
        price: "$12.99", 
        image: "https://covers.openlibrary.org/b/id/8432047-L.jpg" 
    },
    { 
        id: 2, 
        title: "To Kill a Mockingbird", 
        author: "Harper Lee", 
        price: "$14.99", 
        image: "https://covers.openlibrary.org/b/id/12617789-L.jpg" 
    },
    { 
        id: 3, 
        title: "1984", 
        author: "George Orwell", 
        price: "$11.99", 
        image: "https://covers.openlibrary.org/b/id/7222246-L.jpg" 
    },
    { 
        id: 4, 
        title: "Pride and Prejudice", 
        author: "Jane Austen", 
        price: "$10.99", 
        image: "https://covers.openlibrary.org/b/id/8259449-L.jpg" 
    },
    { 
        id: 5, 
        title: "The Catcher in the Rye", 
        author: "J.D. Salinger", 
        price: "$13.99", 
        image: "https://covers.openlibrary.org/b/id/8258668-L.jpg" 
    },
    { 
        id: 6, 
        title: "Lord of the Flies", 
        author: "William Golding", 
        price: "$12.49", 
        image: "https://covers.openlibrary.org/b/id/10578679-L.jpg" 
    }
];

// ... (Keep the USERS object and Init variables as they were) ...

const USERS = {
    client: { email: "user01@gmail.com", password: "user.123", name: "Valued Client", role: "client" },
    admin: { email: "Admin01@gmail.com", password: "Admin.123", name: "System Administrator", role: "admin" }
};
let currentUser = null;
let cart = [];

document.addEventListener('DOMContentLoaded', function() {
    window.contentDiv = document.getElementById('content');
    updateCartCount();
    changeContent('home');
});

// =========================================
// 2. UPDATED HOME PAGE BANNER
// =========================================
function changeContent(page) {
    const contentDiv = window.contentDiv;
    if (!contentDiv) return;

    switch(page) {
        case 'home':
            contentDiv.innerHTML = `
                <h2>Welcome to Book Haven!</h2>
                <p>Discover your next favorite read in our curated collection of books.</p>
                
                <div style="text-align:center; margin-top:30px;">
                    <!-- New High Quality Library Banner -->
                    <img src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                         alt="Library Banner" 
                         style="width:100%; height:300px; object-fit:cover; border-radius:8px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">
                    
                    <div style="margin-top:30px;">
                        <button class="btn-checkout" onclick="changeContent('books')">Shop Collection</button>
                    </div>
                </div>
            `;
            break;
            
        // ... (Keep the rest of your cases: books, cart, login, etc. EXACTLY the same) ...
        
        case 'books':
            const isAdmin = currentUser && currentUser.role === 'admin';
            contentDiv.innerHTML = `
                <h2>Our Book Collection ${isAdmin ? '<span style="background:#e91e63; color:white; padding:2px 5px; font-size:0.6em; border-radius:4px; vertical-align:middle;">ADMIN MODE</span>' : ''}</h2>
                <div id="dynamic-book-store" class="book-store-grid"></div>
            `;
            displayBooks(document.getElementById('dynamic-book-store'));
            break;
            
        case 'cart':
            renderCartPage();
            break;

        case 'payment':
            renderPaymentPage();
            break;

        case 'about':
            contentDiv.innerHTML = `
                <h2>About Book Haven</h2>
                <p>Book Haven is an independent bookstore dedicated to connecting readers with great literature.</p>
                <img src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                     style="width:100%; height:250px; object-fit:cover; border-radius:8px; margin-top:20px;">
                <p style="margin-top:20px;">Founded in 2020, we've been serving book lovers in our community with carefully curated selections.</p>
            `;
            break;

        case 'login':
            contentDiv.innerHTML = `
                <div class="login-container">
                    <h2 style="text-align:center;">Login</h2>
                    <div id="login-error" style="color:red; display:none; margin-bottom:10px; text-align:center;">Invalid Credentials</div>
                    <form id="login-form">
                        <div class="form-group"><label>Email:</label><input type="email" id="login-email" required></div>
                        <div class="form-group"><label>Password:</label><input type="password" id="login-pass" required></div>
                        <button type="submit" class="add-cart-btn" style="background:#4caf50;">Sign In</button>
                    </form>
                    <div style="margin-top:20px; font-size:0.8em; background:#f4f4f4; padding:15px; border-radius:4px; line-height:1.6;">
                        <strong>Demo Accounts:</strong><br>
                        Client: user01@gmail.com / user.123<br>
                        Admin: Admin01@gmail.com / Admin.123
                    </div>
                </div>
            `;
            document.getElementById('login-form').addEventListener('submit', handleLogin);
            break;

        case 'client-dashboard':
            if (!currentUser || currentUser.role !== 'client') return changeContent('login');
            contentDiv.innerHTML = `
                <h2>Client Dashboard</h2>
                <div style="background:#e8f5e9; padding:20px; border-radius:8px; margin-top:20px;">
                    <h3>My Profile</h3>
                    <p><strong>Name:</strong> ${currentUser.name}</p>
                    <p><strong>Email:</strong> ${currentUser.email}</p>
                    <p><strong>Status:</strong> Gold Member</p>
                    <hr style="margin:20px 0; border:0; border-top:1px solid #ccc;">
                    <div style="display:flex; gap:10px;">
                        <button class="btn-continue" onclick="changeContent('books')">Browse Books</button>
                        <button class="btn-checkout" onclick="changeContent('cart')">View Cart (${cart.length})</button>
                    </div>
                </div>
            `;
            break;

        case 'admin-dashboard':
            if (!currentUser || currentUser.role !== 'admin') return changeContent('login');
            contentDiv.innerHTML = `
                <h2>Admin Dashboard</h2>
                <div style="background:#fff3e0; padding:20px; border-radius:8px; margin-bottom:20px;">
                    <h3 style="color:#e65100;">Add New Book</h3>
                    <form id="add-book-form">
                        <div class="form-group"><input type="text" id="new-title" placeholder="Title" required></div>
                        <div class="form-group"><input type="text" id="new-author" placeholder="Author" required></div>
                        <div class="form-group"><input type="text" id="new-price" placeholder="Price ($15.00)" required></div>
                        <button type="submit" class="add-cart-btn">Add to Inventory</button>
                    </form>
                </div>
            `;
            document.getElementById('add-book-form').addEventListener('submit', handleAddBook);
            break;

        default: contentDiv.innerHTML = '<h2>404 Page Not Found</h2>';
    }
}

// ... (Keep the rest of your logic functions: displayBooks, addToCart, etc. exactly the same) ...

function displayBooks(container) {
    if (!container) return;
    container.innerHTML = '';
    
    books.forEach(book => {
        const div = document.createElement('div');
        div.className = 'book-item';
        
        let actionButton = '';
        if (currentUser && currentUser.role === 'admin') {
            actionButton = `<button class="delete-btn" onclick="deleteBook(${book.id})">Delete Item</button>`;
        } else {
            actionButton = `<button class="add-cart-btn" onclick="addToCart(${book.id})">Add to Cart</button>`;
        }

        // Using book.image here which now has the Real URL
        div.innerHTML = `
            <img src="${book.image}" alt="${book.title}">
            <div style="padding: 0 10px 10px;">
                <h3>${book.title}</h3>
                <p>${book.author}</p>
                <p class="price">${book.price}</p>
                ${actionButton}
            </div>
        `;
        container.appendChild(div);
    });
}

function addToCart(bookId) {
    const book = books.find(b => b.id === bookId);
    if (book) {
        cart.push(book);
        updateCartCount();
        alert(`${book.title} added to cart!`);
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCount();
    renderCartPage(); 
}

function updateCartCount() {
    const countSpan = document.getElementById('cart-count');
    if (countSpan) countSpan.innerText = `(${cart.length})`;
}

function renderCartPage() {
    if (cart.length === 0) {
        window.contentDiv.innerHTML = `
            <h2>Your Cart</h2>
            <div style="text-align:center; padding:50px;">
                <p style="font-size:1.2em; color:#777;">Your cart is currently empty.</p>
                <button class="btn-continue" onclick="changeContent('books')" style="margin-top:20px;">Start Shopping</button>
            </div>
        `;
        return;
    }

    let total = 0;
    let tableRows = cart.map((item, index) => {
        let priceNum = parseFloat(item.price.replace('$', ''));
        total += priceNum;
        
        return `
            <tr>
                <td><img src="${item.image}" style="width:50px; height:75px; object-fit:cover; border-radius:4px;"></td>
                <td><strong>${item.title}</strong><br><span style="font-size:0.9em; color:#666;">${item.author}</span></td>
                <td>${item.price}</td>
                <td><span class="remove-link" onclick="removeFromCart(${index})">Remove</span></td>
            </tr>
        `;
    }).join('');

    window.contentDiv.innerHTML = `
        <h2>Your Shopping Cart</h2>
        <table class="cart-table">
            <thead>
                <tr>
                    <th width="10%">Cover</th>
                    <th width="50%">Book Title</th>
                    <th width="20%">Price</th>
                    <th width="20%">Action</th>
                </tr>
            </thead>
            <tbody>${tableRows}</tbody>
        </table>

        <div class="cart-summary">
            <strong>Total: $${total.toFixed(2)}</strong>
        </div>

        <div class="cart-actions">
            <button class="btn-continue" onclick="changeContent('books')">Continue Shopping</button>
            <button class="btn-checkout" onclick="initiateCheckout()">Proceed to Checkout</button>
        </div>
    `;
}

function initiateCheckout() {
    if (cart.length === 0) return;
    if (!currentUser) {
        alert("Please login to complete your purchase.");
        changeContent('login');
        return;
    }
    changeContent('payment');
}

function renderPaymentPage() {
    let total = 0;
    cart.forEach(item => total += parseFloat(item.price.replace('$', '')));

    window.contentDiv.innerHTML = `
        <h2>Checkout & Payment</h2>
        <div class="checkout-container">
            
            <div class="checkout-section">
                <h3>1. Shipping Details</h3>
                <form id="payment-form">
                    <div class="form-group">
                        <label>Full Name</label>
                        <input type="text" value="${currentUser.name}" required>
                    </div>
                    <div class="form-group">
                        <label>Phone Number</label>
                        <input type="tel" placeholder="017xxxxxxxx" required>
                    </div>
                    <div class="form-group">
                        <label>Shipping Address</label>
                        <textarea rows="3" placeholder="House #, Road #, Area..." required></textarea>
                    </div>

                    <h3>2. Payment Method</h3>
                    <div class="payment-methods">
                        <label class="payment-option">
                            <input type="radio" name="payment_method" value="bkash" onchange="togglePaymentDetails()">
                            <div class="payment-card bkash">
                                <span class="payment-logo">💳</span>
                                bKash
                            </div>
                        </label>

                        <label class="payment-option">
                            <input type="radio" name="payment_method" value="cod" onchange="togglePaymentDetails()" checked>
                            <div class="payment-card cod">
                                <span class="payment-logo">🚚</span>
                                Cash On Delivery
                            </div>
                        </label>
                    </div>

                    <div id="bkash-fields" class="bkash-details">
                        <h4>bKash Payment</h4>
                        <p class="bkash-instruction">Please Send Money to <strong>01700-000000</strong></p>
                        <div class="form-group">
                            <label>Your bKash Number</label>
                            <input type="text" id="bkash-number" placeholder="01xxxxxxxxx">
                        </div>
                        <div class="form-group">
                            <label>Transaction ID (TrxID)</label>
                            <input type="text" id="bkash-trx" placeholder="e.g. 8H3KJ9L">
                        </div>
                    </div>

                    <button type="submit" class="place-order-btn">Confirm Order</button>
                </form>
            </div>

            <div class="checkout-section checkout-summary" style="height:fit-content;">
                <h3>Order Summary</h3>
                <p>Items: ${cart.length}</p>
                ${cart.map(item => `
                    <div class="summary-row">
                        <span>${item.title}</span>
                        <span>${item.price}</span>
                    </div>
                `).join('')}
                <div class="summary-row summary-total">
                    <span>Total Amount</span>
                    <span>$${total.toFixed(2)}</span>
                </div>
                <button class="btn-continue" type="button" onclick="changeContent('cart')" style="margin-top:20px; width:100%; background:#90a4ae; border:none; padding:10px; color:white; border-radius:4px;">Back to Cart</button>
            </div>
        </div>
    `;

    document.getElementById('payment-form').addEventListener('submit', handleFinalOrder);
}

function togglePaymentDetails() {
    const method = document.querySelector('input[name="payment_method"]:checked').value;
    const bkashFields = document.getElementById('bkash-fields');
    const bkashNum = document.getElementById('bkash-number');
    const bkashTrx = document.getElementById('bkash-trx');

    if (method === 'bkash') {
        bkashFields.style.display = 'block';
        bkashNum.required = true;
        bkashTrx.required = true;
    } else {
        bkashFields.style.display = 'none';
        bkashNum.required = false;
        bkashTrx.required = false;
        bkashNum.value = '';
        bkashTrx.value = '';
    }
}

function handleFinalOrder(e) {
    e.preventDefault();
    const method = document.querySelector('input[name="payment_method"]:checked').value;
    
    let message = "";
    if (method === 'bkash') {
        const trx = document.getElementById('bkash-trx').value;
        message = `✅ Payment Verified!\n\nbKash TrxID: ${trx}\nYour order has been placed successfully.`;
    } else {
        message = `✅ Order Placed Successfully!\n\nPlease pay cash to the delivery hero upon arrival.`;
    }

    alert(message);
    cart = [];
    updateCartCount();
    changeContent('home');
}

function handleAddBook(e) {
    e.preventDefault();
    const title = document.getElementById('new-title').value;
    const author = document.getElementById('new-author').value;
    const price = document.getElementById('new-price').value;
    // Uses a generic placeholder for new books since we can't guess the cover
    books.push({ id: Date.now(), title, author, price, image: "https://via.placeholder.com/200x300?text=" + encodeURIComponent(title) });
    alert('Book Added!');
    changeContent('books');
}

function deleteBook(id) {
    if(confirm("Delete this book?")) {
        books = books.filter(b => b.id !== id);
        displayBooks(document.getElementById('dynamic-book-store'));
    }
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-pass').value;
    
    if (email === USERS.client.email && pass === USERS.client.password) loginUser(USERS.client);
    else if (email === USERS.admin.email && pass === USERS.admin.password) loginUser(USERS.admin);
    else document.getElementById('login-error').style.display = 'block';
}

function loginUser(user) {
    currentUser = user;
    updateNav();
    changeContent(user.role === 'admin' ? 'admin-dashboard' : 'client-dashboard');
}

function logout() {
    currentUser = null;
    cart = []; 
    updateCartCount();
    updateNav();
    changeContent('login');
}

function updateNav() {
    const loginLink = document.getElementById('nav-login');
    const clientLink = document.getElementById('nav-client');
    const adminLink = document.getElementById('nav-admin');
    const logoutLink = document.getElementById('nav-logout');
    const cartLink = document.getElementById('nav-cart');
    const userStatus = document.getElementById('user-status');

    loginLink.style.display = 'block';
    clientLink.style.display = 'none';
    adminLink.style.display = 'none';
    logoutLink.style.display = 'none';
    userStatus.style.display = 'none';
    cartLink.style.display = 'block'; 

    if (currentUser) {
        loginLink.style.display = 'none';
        logoutLink.style.display = 'block';
        userStatus.style.display = 'block';
        userStatus.innerText = `User: ${currentUser.email}`;

        if (currentUser.role === 'client') {
            clientLink.style.display = 'block';
        } else if (currentUser.role === 'admin') {
            adminLink.style.display = 'block';
            cartLink.style.display = 'none'; 
        }
    }
}