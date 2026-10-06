const products = [
{id:'p1',title:'Hand-Painted Blue Pottery Flower Vase',category:'Handmade Decor',subCategory:'Pottery & Ceramics',price:1299,originalPrice:1699,rating:4.8,reviewsCount:34,artisanName:'Ramesh Kumhar',artisanRegion:'Jaipur, Rajasthan',image:'https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?auto=format&fit=crop&q=80&w=600',description:'Authentic quartz-sand pottery handcrafted by master craftsmen in Jaipur. Traditional cobalt blue geometric motifs with floral borders.',materials:'Quartz stone powder, glass, natural oxides',inStock:12,isFeatured:true,isBestseller:true},
{id:'p2',title:'Grandma’s Traditional Mango Avakaya Pickle (500g)',category:'Traditional Edibles',subCategory:'Pickles & Spices',price:349,originalPrice:420,rating:4.9,reviewsCount:88,artisanName:'Saraswathi Amma',artisanRegion:'Guntur, Andhra Pradesh',image:'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=600',description:'Sun-dried raw mangoes marinated in cold-pressed sesame oil, freshly ground mustard, and fragrant Andhra spices. 100% natural and preservative-free.',materials:'Raw Mango, Cold-Pressed Sesame Oil, Ground Spices, Sea Salt',inStock:25,isFeatured:true,isBestseller:true},
{id:'p3',title:'Carved Teakwood Wall Hanging Jharokha',category:'Handmade Decor',subCategory:'Wood Carvings',price:2499,originalPrice:3100,rating:4.7,reviewsCount:19,artisanName:'Gurpreet Singh & Sons',artisanRegion:'Saharanpur, Uttar Pradesh',image:'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&q=80&w=600',description:'Intricately hand-carved solid teakwood wall jharokha with subtle brass filigree work. Brings rustic vintage royalty to any home corner.',materials:'Reclaimed Teak Wood, Brass Accents, Antique Stain Finish',inStock:6,isFeatured:false,isBestseller:false},
{id:'p4',title:'Artisanal Himalayan Organic CTC & Orthodox Tea Blend',category:'Traditional Edibles',subCategory:'Teas & Brews',price:499,originalPrice:599,rating:4.9,reviewsCount:42,artisanName:'Sonam Norbu',artisanRegion:'Darjeeling, West Bengal',image:'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=600',description:'Single-origin high-altitude tea leaves hand-plucked from pesticide-free mountain gardens. Rich golden liquor with naturally subtle Muscatel notes.',materials:'100% Whole Tea Leaves, Cardamom, Dried Rose Petals',inStock:30,isFeatured:true,isBestseller:false},
{id:'p5',title:'Handwoven Dhurrie Floor Mat - Terracotta Motif',category:'Handmade Decor',subCategory:'Textiles & Rugs',price:1850,originalPrice:2200,rating:4.6,reviewsCount:15,artisanName:'Devika Devi',artisanRegion:'Mirzapur, Uttar Pradesh',image:'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&q=80&w=600',description:'100% organic cotton handloom rug woven on pit looms. Features earth-tone tribal geometric patterns dyed with natural plant extracts.',materials:'Organic Raw Cotton, Plant-based Vegetable Dyes',inStock:8,isFeatured:false,isBestseller:true},
{id:'p6',title:'Pure Handmade Desi Cow Ghee Soan Papdi & Sweets',category:'Traditional Edibles',subCategory:'Sweets & Snacks',price:399,originalPrice:480,rating:4.8,reviewsCount:51,artisanName:'Lala Shivdayal Sweet Makers',artisanRegion:'Mathura, Uttar Pradesh',image:'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&q=80&w=600',description:'Traditional flaky melt-in-mouth sweet prepared in pure Bilona Ghee with crushed pistachios and green cardamom. Zero artificial colors.',materials:'Desi Cow Ghee, Gram Flour, Pistachios, Almonds, Cardamom',inStock:18,isFeatured:false,isBestseller:true}
];

const artisans=[
{id:'a1',name:'Ramesh Kumhar',region:'Jaipur, Rajasthan',specialty:'Blue Pottery & Ceramics',experience:'22 Years',status:'Verified',productsCount:4,bio:'3rd generation artisan preserving the endangered royal blue pottery legacy of Rajasthan.'},
{id:'a2',name:'Saraswathi Amma',region:'Guntur, Andhra Pradesh',specialty:'Traditional Pickles & Podi',experience:'35 Years',status:'Verified',productsCount:6,bio:'Hand-grinding traditional spices using stone pestles following heirloom family recipes.'},
{id:'a3',name:'Gurpreet Singh',region:'Saharanpur, UP',specialty:'Hand Carved Woodcraft',experience:'18 Years',status:'Verified',productsCount:3,bio:'Crafting sustainable teakwood architectural artifacts and decor with skilled local wood carvers.'},
{id:'a4',name:'Sonam Norbu',region:'Darjeeling, WB',specialty:'Organic Herbal Teas',experience:'15 Years',status:'Verified',productsCount:5,bio:'Nurturing small tea growers in high Himalayas for ethical and sustainable tea production.'}
];

let state={
view:'shop',category:'All',search:'',sort:'featured',price:3000,
cart:[],wishlist:[],adminTab:'products',
orders:[
{id:'ORD-8821',customer:'Aarav Sharma',amount:1648,items:2,status:'Shipped',date:'2026-03-30',paymentMethod:'UPI'},
{id:'ORD-8822',customer:'Priya Nair',amount:2499,items:1,status:'Pending',date:'2026-04-01',paymentMethod:'Card'}
]
};

const $=id=>document.getElementById(id);
function money(n){return '₹'+Number(n).toLocaleString('en-IN')}
function toast(msg){$('toast').textContent=msg;$('toast').classList.remove('hidden');setTimeout(()=>$('toast').classList.add('hidden'),2500)}
function showView(v){state.view=v;render();window.scrollTo({top:0,behavior:'smooth'})}
function toggleAdmin(){
  if(currentUser && currentUser.role==='admin') showView('admin');
  else openAuth();
}
function clearSearch(){state.search='';$('searchInput').value='';renderShop()}
function setCategory(c){state.category=c;renderShop()}
function filtered(){
let arr=products.filter(p=>(state.category==='All'||p.category===state.category)&&
(p.title.toLowerCase().includes(state.search.toLowerCase())||p.artisanName.toLowerCase().includes(state.search.toLowerCase())||p.artisanRegion.toLowerCase().includes(state.search.toLowerCase()))&&p.price<=state.price);
return arr.sort((a,b)=>state.sort==='price-low'?a.price-b.price:state.sort==='price-high'?b.price-a.price:state.sort==='rating'?b.rating-a.rating:(b.isFeatured?1:0)-(a.isFeatured?1:0))
}
function productCard(p){
let wished=state.wishlist.includes(p.id);
let badge=p.isBestseller?'BESTSELLER':(p.isFeatured?'FEATURED':'HANDMADE');
return `<article class="product">
<div class="product-media"><img class="product-img" src="${p.image}" alt="${p.title}"><span class="product-badge">${badge}</span><button class="heart-btn" onclick="toggleWish('${p.id}')" title="Save to wishlist">${wished?'♥':'♡'}</button></div>
<div class="product-body">
<div class="product-cat">${p.subCategory}</div>
<h3>${p.title}</h3>
<div class="artisan"><span>By ${p.artisanName}</span><small>${p.artisanRegion}</small></div>
<div class="stars">★ ${p.rating} <span>(${p.reviewsCount} reviews)</span></div>
<div class="price-row"><div class="price">${money(p.price)} <span class="old">${money(p.originalPrice)}</span></div><span class="save-tag">SAVE ${Math.round((1-p.price/p.originalPrice)*100)}%</span></div>
<div class="product-actions"><button class="add" onclick="addCart('${p.id}')">Add to Cart</button><button class="details-btn" onclick="openProduct('${p.id}')">View</button></div>
</div></article>`
}
function renderShop(){
state.search=$('searchInput')?.value||state.search;
let arr=filtered();
$('app').innerHTML=`<div class="container">
<section class="hero">
<div class="hero-copy"><span class="pill">INDIA'S HANDMADE MARKETPLACE</span><h1>Beautiful things.<br><em>Made by hand.</em></h1><p>Discover authentic crafts, traditional foods and timeless pieces made by skilled Indian artisans — directly from their workshops to your home.</p><div class="hero-actions"><button class="primary" onclick="setCategory('Handmade Decor')">Shop Handcrafted Decor <span>→</span></button><button class="secondary" onclick="setCategory('Traditional Edibles')">Explore Local Flavours</button></div><div class="hero-proof"><span>✓ Verified artisans</span><span>✓ Authentic products</span><span>✓ India-wide delivery</span></div></div>
<div class="hero-art"><div class="hero-card-main"><span>CRAFTED IN INDIA</span><strong>Every piece<br>has a story.</strong><small>From artisan hands to your home</small></div><div class="hero-card-float">✦<b>500+</b><span>Artisans</span></div></div>
</section>
<div class="trust-strip"><div><b>✦</b><span><strong>Authentic Craft</strong>Made by real artisans</span></div><div><b>₹</b><span><strong>Fair Pricing</strong>Better value for makers</span></div><div><b>↗</b><span><strong>Pan-India Delivery</strong>From village to doorstep</span></div><div><b>♡</b><span><strong>Made with Care</strong>Thoughtfully handcrafted</span></div></div>
<div class="section-title"><div><span class="eyebrow">EXPLORE THE COLLECTION</span><h2>Shop by Tradition</h2><p>Find something special from India's diverse craft and food traditions.</p></div></div>
<div class="categories">
<div class="category category-decor ${state.category==='Handmade Decor'?'active':''}" onclick="setCategory('Handmade Decor')"><div class="category-icon">🏺</div><div><span>01</span><h3>Handmade Decor</h3><p>Pottery, woodcraft, textiles & rugs</p></div><b>↗</b></div>
<div class="category category-food ${state.category==='Traditional Edibles'?'active':''}" onclick="setCategory('Traditional Edibles')"><div class="category-icon">🌶</div><div><span>02</span><h3>Traditional Edibles</h3><p>Pickles, teas, sweets & spices</p></div><b>↗</b></div>
</div>
<div class="market-head"><div><span class="eyebrow">CURATED FOR YOU</span><h2>${state.category==='All'?'Featured Marketplace':state.category}</h2><p>${arr.length} handcrafted products available</p></div><div class="controls"><button class="tab ${state.category==='All'?'active':''}" onclick="setCategory('All')">All</button><select class="select" onchange="state.sort=this.value;renderShop()"><option value="featured">Featured</option><option value="price-low">Price: Low to High</option><option value="price-high">Price: High to Low</option><option value="rating">Top Rated</option></select><label class="price-filter">Up to ₹${state.price}<input class="range" type="range" min="300" max="3000" step="50" value="${state.price}" oninput="state.price=+this.value;renderShop()"></label></div></div>
<div class="products">${arr.length?arr.map(productCard).join(''):`<div class="empty" style="grid-column:1/-1"><strong>No products found</strong><br>Try changing your search or price filter.</div>`}</div>
<section class="artisan-banner"><div><span class="eyebrow">MEET THE MAKERS</span><h2>Behind every product is a person.</h2><p>FolkMade helps skilled artisans take their traditional craft to customers across India.</p></div><button class="secondary-light" onclick="showView('about')">Meet Our Artisans →</button></section>
<footer class="footer"><div class="footer-brand"><div class="brand-name">FolkMade</div><p>Handcrafted Traditions from India</p></div><div><b>Shop</b><span>Handmade Decor</span><span>Traditional Edibles</span><span>Wishlist</span></div><div><b>FolkMade</b><span>Our Artisans</span><span>My Orders</span><span>Seller / Admin</span></div><div><b>Promise</b><span>Authentic Craft</span><span>Fair Pricing</span><span>Pan-India Delivery</span></div><div class="footer-bottom">© 2026 FolkMade · Handcrafted with tradition.</div></footer>
</div>`
}
function renderWishlist(){
let arr=products.filter(p=>state.wishlist.includes(p.id));
$('app').innerHTML=`<div class="container"><div class="section-title"><div><h2>Saved Wishlist</h2><p>Your favourite FolkMade products.</p></div></div><div class="products">${arr.length?arr.map(productCard).join(''):`<div class="empty" style="grid-column:1/-1">Your wishlist is empty.</div>`}</div></div>`
}
function renderAbout(){
$('app').innerHTML=`<div class="container">
<div class="section-title"><div><h2>About FolkMade</h2><p>A marketplace connecting customers with India's rural craft and food traditions.</p></div></div>
<div class="about-grid"><div class="info-card"><h3>Our Mission</h3><p>FolkMade brings authentic handcrafted decor and traditional edibles closer to customers while giving rural artisans a digital marketplace.</p></div><div class="info-card"><h3>What We Offer</h3><p>From Jaipur blue pottery and Saharanpur woodcraft to Andhra pickles and Himalayan tea, every product carries a story of its maker.</p></div></div>
<div class="section-title"><div><h2>Meet the Artisans</h2></div></div>
<div class="artisan-list">${artisans.map(a=>`<div class="artisan-card"><span class="verified">✓ ${a.status}</span><h3>${a.name}</h3><p><b>${a.specialty}</b></p><p>${a.region} · ${a.experience}</p><p style="color:#78716c;font-size:13px">${a.bio}</p><small>${a.productsCount} products</small></div>`).join('')}</div></div>`
}
function renderAdmin(){
let productRows=products.map(p=>`<tr><td>${p.title}</td><td>${p.category}</td><td>${money(p.price)}</td><td>${p.inStock}</td><td><button class="small-btn" onclick="openEdit('${p.id}')">Edit</button> <button class="small-btn danger" onclick="deleteProduct('${p.id}')">Delete</button></td></tr>`).join('');
let orderRows=state.orders.map(o=>`<tr><td>${o.id}</td><td>${o.customer}</td><td>${money(o.amount)}</td><td>${o.items}</td><td>${o.status}</td><td>${o.date}</td><td>${o.paymentMethod}</td></tr>`).join('');
$('app').innerHTML=`<div class="container">
<div class="section-title"><div><h2>Admin Portal</h2><p>Manage FolkMade marketplace data.</p></div><button class="primary" onclick="openAdd()">+ Add Product</button></div>
<div class="stat-grid"><div class="stat"><small>Products</small><strong>${products.length}</strong></div><div class="stat"><small>Artisans</small><strong>${artisans.length}</strong></div><div class="stat"><small>Orders</small><strong>${state.orders.length}</strong></div><div class="stat"><small>Revenue</small><strong>${money(state.orders.reduce((a,o)=>a+o.amount,0))}</strong></div></div>
<div class="admin-tabs"><button class="tab ${state.adminTab==='products'?'active':''}" onclick="state.adminTab='products';renderAdmin()">Products</button><button class="tab ${state.adminTab==='orders'?'active':''}" onclick="state.adminTab='orders';renderAdmin()">Orders</button><button class="tab ${state.adminTab==='artisans'?'active':''}" onclick="state.adminTab='artisans';renderAdmin()">Artisans</button></div>
${state.adminTab==='products'?`<div class="table-wrap"><table class="table"><thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead><tbody>${productRows}</tbody></table></div>`:state.adminTab==='orders'?`<div class="table-wrap"><table class="table"><thead><tr><th>Order</th><th>Customer</th><th>Amount</th><th>Items</th><th>Status</th><th>Date</th><th>Payment</th></tr></thead><tbody>${orderRows}</tbody></table></div>`:`<div class="artisan-list">${artisans.map(a=>`<div class="artisan-card"><span class="verified">✓ ${a.status}</span><h3>${a.name}</h3><p>${a.specialty}</p><p>${a.region} · ${a.experience}</p><p>${a.bio}</p></div>`).join('')}</div>`}
</div>`
}

/* =========================
   FolkMade Authentication
   ========================= */
let currentUser = null;
try {
  currentUser = JSON.parse(localStorage.getItem('folkmade_current_user') || 'null');
} catch(e) {
  currentUser = null;
}

const ADMIN_ACCOUNT = {
  name: 'FolkMade Admin',
  email: 'admin@folkmade.in',
  password: 'admin123',
  role: 'admin'
};

function getRegisteredUsers(){
  try {
    return JSON.parse(localStorage.getItem('folkmade_users') || '[]');
  } catch(e) {
    return [];
  }
}

function saveRegisteredUsers(users){
  localStorage.setItem('folkmade_users', JSON.stringify(users));
}

function openAuth(){
  showLoginForm();
  $('authModal').classList.remove('hidden');
}

function closeAuth(e){
  if(!e || e.target.id === 'authModal') $('authModal').classList.add('hidden');
}

function showLoginForm(message=''){
  $('authContent').innerHTML = `
    <h2>Welcome to FolkMade</h2>
    <p class="auth-sub">Login to continue to your FolkMade account.</p>
    ${message ? `<div class="auth-success">${message}</div>` : ''}
    <form onsubmit="loginAccount(event)">
      <div class="field">
        <label>Login as</label>
        <select id="login-role" required>
          <option value="user">User</option>
          <option value="seller">Seller</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div class="field" style="margin-top:12px">
        <label>Email</label>
        <input id="login-email" type="email" placeholder="Enter your email" required>
      </div>
      <div class="field" style="margin-top:12px">
        <label>Password</label>
        <input id="login-password" type="password" placeholder="Enter your password" required>
      </div>
      <div id="login-error"></div>
      <button class="primary full" type="submit">Login</button>
    </form>
    <p class="auth-note">New to FolkMade? <button class="auth-link" type="button" onclick="showRegisterForm()">Create a new account</button></p>
  `;
}

function showRegisterForm(){
  $('authContent').innerHTML = `
    <h2>Create FolkMade Account</h2>
    <p class="auth-sub">Register as a customer or seller.</p>
    <form onsubmit="registerAccount(event)">
      <div class="field">
        <label>Register as</label>
        <select id="reg-role" required>
          <option value="user">User</option>
          <option value="seller">Seller</option>
        </select>
      </div>
      <div class="field" style="margin-top:12px">
        <label>Full Name</label>
        <input id="reg-name" placeholder="Enter your full name" required>
      </div>
      <div class="field" style="margin-top:12px">
        <label>Email</label>
        <input id="reg-email" type="email" placeholder="Enter your email" required>
      </div>
      <div class="field" style="margin-top:12px">
        <label>Phone</label>
        <input id="reg-phone" type="tel" placeholder="Enter phone number" required>
      </div>
      <div class="field" style="margin-top:12px">
        <label>Password</label>
        <input id="reg-password" type="password" placeholder="Create a password" required>
      </div>
      <div class="field" style="margin-top:12px">
        <label>Confirm Password</label>
        <input id="reg-confirm" type="password" placeholder="Confirm password" required>
      </div>
      <div id="register-error"></div>
      <button class="primary full" type="submit">Create Account</button>
    </form>
    <p class="auth-note">Already registered? <button class="auth-link" type="button" onclick="showLoginForm()">Login here</button></p>
  `;
}

function loginAccount(e){
  e.preventDefault();

  const role = $('login-role').value;
  const email = $('login-email').value.trim().toLowerCase();
  const password = $('login-password').value;

  let account = null;

  if(role === 'admin'){
    if(email === ADMIN_ACCOUNT.email && password === ADMIN_ACCOUNT.password){
      account = {...ADMIN_ACCOUNT};
    }
  } else {
    account = getRegisteredUsers().find(u =>
      u.email === email &&
      u.password === password &&
      u.role === role
    );
  }

  if(!account){
    $('login-error').innerHTML = '<div class="auth-error">Invalid email, password, or account type.</div>';
    return;
  }

  currentUser = {
    name: account.name,
    email: account.email,
    role: account.role
  };

  localStorage.setItem('folkmade_current_user', JSON.stringify(currentUser));
  $('authModal').classList.add('hidden');

  if(currentUser.role === 'admin'){
    state.view = 'admin';
    render();
    toast('Welcome Admin!');
  } else if(currentUser.role === 'seller'){
    state.view = 'seller';
    render();
    toast('Seller login successful!');
  } else {
    state.view = 'shop';
    render();
    toast('Login successful!');
  }
}

function registerAccount(e){
  e.preventDefault();

  const role = $('reg-role').value;
  const name = $('reg-name').value.trim();
  const email = $('reg-email').value.trim().toLowerCase();
  const phone = $('reg-phone').value.trim();
  const password = $('reg-password').value;
  const confirm = $('reg-confirm').value;

  const error = $('register-error');

  if(password !== confirm){
    error.innerHTML = '<div class="auth-error">Passwords do not match.</div>';
    return;
  }

  if(password.length < 6){
    error.innerHTML = '<div class="auth-error">Password must be at least 6 characters.</div>';
    return;
  }

  if(email === ADMIN_ACCOUNT.email){
    error.innerHTML = '<div class="auth-error">This email is reserved for the administrator.</div>';
    return;
  }

  const users = getRegisteredUsers();

  if(users.some(u => u.email === email)){
    error.innerHTML = '<div class="auth-error">This email is already registered. Please login.</div>';
    return;
  }

  users.push({
    name,
    email,
    phone,
    password,
    role
  });

  saveRegisteredUsers(users);

  showLoginForm('Account created successfully. Please login.');
}
function logoutAccount(){
  currentUser = null;
  localStorage.removeItem('folkmade_current_user');
  state.view = 'shop';
  render();
  toast('Logged out successfully.');
}

function renderAccountButton(){
  const btn = $('accountBtn');
  if(!btn) return;

  if(currentUser){
    btn.textContent = `👤 ${currentUser.name} · Logout`;
    btn.onclick = logoutAccount;
  } else {
    btn.textContent = '👤 Login / Register';
    btn.onclick = openAuth;
  }
}

function renderSeller(){
  $('app').innerHTML = `
    <div class="container">
      <div class="section-title">
        <div>
          <h2>Seller Dashboard</h2>
          <p>Welcome, ${currentUser ? currentUser.name : 'Seller'}.</p>
        </div>
      </div>
      <div class="info-card">
        <h3>Sell Your Product</h3>
        <p>Your seller account is ready. Product listing and order management can be connected to the database in the next step.</p>
        <button class="primary" onclick="showView('shop')">Back to Marketplace</button>
      </div>
    </div>`;
}

function render(){
renderAccountButton();

if(state.view==='admin' && (!currentUser || currentUser.role!=='admin')){
  state.view='shop';
}
if(state.view==='seller' && (!currentUser || currentUser.role!=='seller')){
  state.view='shop';
}

$('shopBtn').classList.toggle('active',state.view==='shop');
$('desktopSearch').classList.toggle('hidden',state.view!=='shop');
$('wishCount').textContent=state.wishlist.length||'';
$('cartCount').textContent=state.cart.reduce((a,c)=>a+c.qty,0)||'';

if(state.view==='shop') renderShop();
else if(state.view==='wishlist') renderWishlist();
else if(state.view==='about') renderAbout();
else if(state.view==='admin') renderAdmin();
else if(state.view==='seller') renderSeller();
else if(state.view==='orders') renderOrders();
else renderShop();
}
function renderOrders(){let orders=JSON.parse(localStorage.getItem('folkMadeOrders'))||[];$('app').innerHTML=`<div class="section-head"><div><h2>My Orders</h2><p>Your recent orders</p></div></div>${orders.length?orders.map(o=>`<div class="info-card" style="margin-bottom:16px"><h3>Order ID: ${o.id}</h3><p><b>Date:</b> ${o.date}</p><p><b>Payment:</b> ${o.payment}</p><p><b>Total:</b> ₹${o.total}</p><p><b>Status:</b> ${o.status}</p></div>`).join(''):`<div class="empty">No orders yet.</div>`}`;};
function toggleWish(id){if(state.wishlist.includes(id)){state.wishlist=state.wishlist.filter(x=>x!==id);toast('Removed from Wishlist')}else{state.wishlist.push(id);toast('Saved to Wishlist!')}render()}
function addCart(id){let p=products.find(x=>x.id===id),x=state.cart.find(x=>x.id===id);if(x)x.qty++;else state.cart.push({id,qty:1});toast(`Added "${p.title}" to your cart!`);render()}
function changeQty(id,d){let x=state.cart.find(x=>x.id===id);if(x){x.qty+=d;if(x.qty<=0)state.cart=state.cart.filter(y=>y.id!==id)}updateCart()}
function removeCart(id){state.cart=state.cart.filter(x=>x.id!==id);updateCart()}
function openCart(){updateCart();$('overlay').classList.remove('hidden');$('cartPanel').classList.add('open')}
function closeCart(){$('overlay').classList.add('hidden');$('cartPanel').classList.remove('open')}
function updateCart(){
let subtotal=state.cart.reduce((s,x)=>{let p=products.find(p=>p.id===x.id);return s+p.price*x.qty},0);
$('cartSubtotal').textContent=money(subtotal);$('shipping').textContent=subtotal>999||subtotal===0?'Free':money(99);$('grandTotal').textContent=money(subtotal+(subtotal>999||subtotal===0?0:99));
$('cartItems').innerHTML=state.cart.length?state.cart.map(x=>{let p=products.find(p=>p.id===x.id);return `<div class="cart-item"><img src="${p.image}"><div><h4>${p.title}</h4><small>${money(p.price)}</small><div class="qty"><button onclick="changeQty('${p.id}',-1)">−</button><b>${x.qty}</b><button onclick="changeQty('${p.id}',1)">+</button></div></div><button class="small-btn danger" onclick="removeCart('${p.id}')">×</button></div>`}).join(''):`<div class="empty">Your shopping bag is empty.</div>`;
render()
}
function checkout(){if(!state.cart.length)return toast('Your cart is empty');$('modalContent').innerHTML=`<h2>Checkout</h2><p class="auth-sub">Complete your order details</p><div class="field"><label>Full Name</label><input id="order-name" placeholder="Enter your name" required></div><div class="field" style="margin-top:12px"><label>Phone Number</label><input id="order-phone" type="tel" placeholder="Enter phone number" required></div><div class="field" style="margin-top:12px"><label>Delivery Address</label><textarea id="order-address" placeholder="Enter complete delivery address" rows="4" required></textarea></div><div class="field" style="margin-top:12px"><label>Payment Method</label><select id="order-payment"><option value="COD">Cash on Delivery</option><option value="UPI">UPI</option><option value="Card">Credit / Debit Card</option></select></div><button class="primary full" style="margin-top:18px" onclick="placeOrder()">Place Order</button>`;$('modal').classList.remove('hidden')}
function placeOrder(){const name=$('order-name').value.trim(),phone=$('order-phone').value.trim(),address=$('order-address').value.trim(),payment=$('order-payment').value;if(!name||!phone||!address)return toast('Please fill all details');const total=state.cart.reduce((sum,item)=>{const p=products.find(x=>x.id===item.id);return sum+p.price*item.qty},0),shipping=total>999?0:99,order={id:'ORD-'+Date.now(),name,phone,address,payment,total:total+shipping,status:'Order Confirmed',date:new Date().toLocaleDateString(),items:state.cart};let orders=JSON.parse(localStorage.getItem('folkMadeOrders'))||[];orders.push(order);localStorage.setItem('folkMadeOrders',JSON.stringify(orders));state.cart=[];hideModal();closeCart();toast('Order placed successfully!');setTimeout(()=>alert('Order Confirmed!\\n\\nOrder ID: '+order.id+'\\nPayment: '+order.payment+'\\nTotal: ₹'+order.total),300)}
function openProduct(id){let p=products.find(x=>x.id===id);$('modalContent').innerHTML=`<div class="detail-grid"><img class="detail-img" src="${p.image}"><div class="detail"><div class="product-cat">${p.subCategory}</div><h2>${p.title}</h2><div class="stars">★ ${p.rating} (${p.reviewsCount} reviews)</div><p>${p.description}</p><p><b>Materials:</b> ${p.materials}</p><p><b>Artisan:</b> ${p.artisanName}<br>${p.artisanRegion}</p><div class="price">${money(p.price)} <span class="old">${money(p.originalPrice)}</span></div><button class="primary full" onclick="addCart('${p.id}');hideModal()">Add to Cart</button></div></div>`;$('modal').classList.remove('hidden')}
function hideModal(){$('modal').classList.add('hidden')}
function closeModal(e){if(e.target.id==='modal')hideModal()}
function resetForm(){return {title:'',category:'Handmade Decor',subCategory:'Decor Items',price:'',originalPrice:'',artisanName:'',artisanRegion:'',image:'',description:'',materials:'',inStock:10,isFeatured:false}}
function openAdd(){showForm(null)}
function openEdit(id){showForm(products.find(p=>p.id===id))}
function showForm(p){
p=p||resetForm();
$('modalContent').innerHTML=`<h2 style="font-family:Playfair Display">${p.id?'Edit Product':'Add Product'}</h2><form onsubmit="saveProduct(event,'${p.id||''}')"><div class="form-grid">
<div class="field"><label>Title *</label><input id="f-title" value="${p.title||''}" required></div>
<div class="field"><label>Category</label><select id="f-cat"><option ${p.category==='Handmade Decor'?'selected':''}>Handmade Decor</option><option ${p.category==='Traditional Edibles'?'selected':''}>Traditional Edibles</option></select></div>
<div class="field"><label>Sub Category</label><input id="f-sub" value="${p.subCategory||''}"></div>
<div class="field"><label>Price *</label><input id="f-price" type="number" value="${p.price||''}" required></div>
<div class="field"><label>Original Price</label><input id="f-original" type="number" value="${p.originalPrice||''}"></div>
<div class="field"><label>Stock</label><input id="f-stock" type="number" value="${p.inStock??10}"></div>
<div class="field"><label>Artisan Name *</label><input id="f-artisan" value="${p.artisanName||''}" required></div>
<div class="field"><label>Artisan Region</label><input id="f-region" value="${p.artisanRegion||''}"></div>
<div class="field full-field"><label>Image URL</label><input id="f-image" value="${p.image||''}"></div>
<div class="field full-field"><label>Description</label><textarea id="f-desc">${p.description||''}</textarea></div>
<div class="field full-field"><label>Materials</label><input id="f-materials" value="${p.materials||''}"></div>
</div><button class="primary full" type="submit">Save Product</button></form>`;
$('modal').classList.remove('hidden')
}
function saveProduct(e,id){e.preventDefault();let p={id:id||'p_'+Date.now(),title:$('f-title').value,category:$('f-cat').value,subCategory:$('f-sub').value||'General',price:+$('f-price').value,originalPrice:+$('f-original').value||Math.round(+$('f-price').value*1.2),rating:id?(products.find(x=>x.id===id)?.rating||5):5,reviewsCount:id?(products.find(x=>x.id===id)?.reviewsCount||1):1,artisanName:$('f-artisan').value,artisanRegion:$('f-region').value,image:$('f-image').value||'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600',description:$('f-desc').value,materials:$('f-materials').value,inStock:+$('f-stock').value||10,isFeatured:false,isBestseller:false};if(id){let i=products.findIndex(x=>x.id===id);products[i]=p;toast('Product details updated successfully!')}else{products.unshift(p);toast('New handcrafted product added to store!')}hideModal();render()}
function deleteProduct(id){if(confirm('Are you sure you want to delete this product from the marketplace?')){let i=products.findIndex(x=>x.id===id);products.splice(i,1);toast('Product removed from FolkMade catalog');renderAdmin()}}

$('searchInput').addEventListener('input',()=>{state.search=$('searchInput').value;renderShop()});
render();
