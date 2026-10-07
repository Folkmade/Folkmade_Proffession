const fallbackProducts = [
{id:'p1',title:'Hand-Painted Blue Pottery Flower Vase',category:'Handmade Decor',subCategory:'Pottery & Ceramics',price:1299,originalPrice:1699,rating:4.8,reviewsCount:34,artisanName:'Ramesh Kumhar',artisanRegion:'Jaipur, Rajasthan',image:'https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?auto=format&fit=crop&q=80&w=600',description:'Authentic quartz-sand pottery handcrafted by master craftsmen in Jaipur. Traditional cobalt blue geometric motifs with floral borders.',materials:'Quartz stone powder, glass, natural oxides',inStock:12,isFeatured:true,isBestseller:true},
{id:'p3',title:'Carved Teakwood Wall Hanging Jharokha',category:'Handmade Decor',subCategory:'Wood Carvings',price:2499,originalPrice:3100,rating:4.7,reviewsCount:19,artisanName:'Gurpreet Singh & Sons',artisanRegion:'Saharanpur, Uttar Pradesh',image:'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&q=80&w=600',description:'Intricately hand-carved solid teakwood wall jharokha with subtle brass filigree work. Brings rustic vintage royalty to any home corner.',materials:'Reclaimed Teak Wood, Brass Accents, Antique Stain Finish',inStock:6,isFeatured:false,isBestseller:false},
{id:'p5',title:'Handwoven Dhurrie Floor Mat - Terracotta Motif',category:'Handmade Decor',subCategory:'Textiles & Rugs',price:1850,originalPrice:2200,rating:4.6,reviewsCount:15,artisanName:'Devika Devi',artisanRegion:'Mirzapur, Uttar Pradesh',image:'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&q=80&w=600',description:'100% organic cotton handloom rug woven on pit looms. Features earth-tone tribal geometric patterns dyed with natural plant extracts.',materials:'Organic Raw Cotton, Plant-based Vegetable Dyes',inStock:8,isFeatured:false,isBestseller:true},
];

let state={
view:'shop',category:'All',search:'',sort:'featured',price:3000,
cart:[],wishlist:[],adminTab:'products',
orders:[]
};


/* =========================
   FolkMade Supabase
   ========================= */
const SUPABASE_URL = "https://zkjpuglbfzsncprjrnlh.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_r86hTWyXXsWHAsIQdqWFEQ_tkR5v9sv";
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
const ORDER_ITEMS_CACHE_KEY = 'folkmade_order_items_cache';
const PRODUCT_META_KEY = 'folkmade_product_meta';
let currentUser = null;
let productMeta = {};
try { productMeta = JSON.parse(localStorage.getItem(PRODUCT_META_KEY) || '{}'); } catch(e) { productMeta = {}; }

const ADMIN_ACCOUNT = {
  name:'FolkMade Admin',
  email:'admin@folkmade.in',
  password:'admin123',
  role:'admin'
};

function saveProductMeta(){ localStorage.setItem(PRODUCT_META_KEY, JSON.stringify(productMeta)); }

function mapProductRow(row){
  const fallback = fallbackProducts.find(p => p.title === row.title);
  const meta = productMeta[String(row.id)] || {};
  return {
    id:String(row.id),
    title:row.title || '',
    category:row.category || fallback?.category || 'Handmade Decor',
    subCategory:meta.subCategory || fallback?.subCategory || 'General',
    price:Number(row.price) || 0,
    originalPrice:Number(row.original_price) || Number(row.price) || 0,
    rating:Number(row.rating) || fallback?.rating || 5,
    reviewsCount:Number(row.reviews_count) || fallback?.reviewsCount || 0,
    artisanName:row.artisan_name || fallback?.artisanName || 'FolkMade Artisan',
    artisanRegion:row.artisan_region || fallback?.artisanRegion || 'India',
    image:row.image || fallback?.image || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600',
    description:meta.description || fallback?.description || 'A handcrafted product from FolkMade.',
    materials:meta.materials || fallback?.materials || 'Traditional materials',
    inStock:meta.inStock ?? fallback?.inStock ?? 10,
    isFeatured:meta.isFeatured ?? fallback?.isFeatured ?? false,
    isBestseller:meta.isBestseller ?? fallback?.isBestseller ?? false
  };
}

async function loadProductsFromDatabase(){
  const {data,error} = await supabaseClient
    .from('products')
    .select('*')
    .neq('category','Traditional Edibles')
    .order('id',{ascending:true});

  if(error){
    console.error('PRODUCT LOAD ERROR:', error);
    products = [];
    return;
  }

  products = (data || [])
    .filter(row => row && row.title && row.category !== 'Traditional Edibles')
    .map(mapProductRow);

  saveProductMeta();
}

async function getProfileByEmail(email){
  const {data,error} = await supabaseClient.from('users').select('*').eq('email',email).limit(1).maybeSingle();
  if(error) return null;
  return data;
}

function makeCurrentUser(profile){
  const user = profile ? {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    phone: profile.phone || '',
    role: profile.role || 'user'
  } : null;

  const addBtn = $('addProductBtn');
  if(addBtn){
    addBtn.style.display =
      (user && (user.role === 'seller' || user.role === 'admin'))
        ? 'inline-flex'
        : 'none';
  }

  return user;
}

async function loadWishlist(){
  if(!currentUser || currentUser.role==='admin'){ state.wishlist=[]; return; }
  const {data,error} = await supabaseClient.from('wishlist').select('product_id').eq('user_id',currentUser.id);
  if(error){ state.wishlist=[]; return; }
  state.wishlist = (data || []).map(x=>String(x.product_id));
}

function saveOrderItemsCache(orderId, items){
  try{
    const cache=JSON.parse(localStorage.getItem(ORDER_ITEMS_CACHE_KEY)||'{}');
    cache[String(orderId)] = items;
    localStorage.setItem(ORDER_ITEMS_CACHE_KEY,JSON.stringify(cache));
  }catch(e){}
}

function getOrderItemsCache(orderId){
  try{
    const cache=JSON.parse(localStorage.getItem(ORDER_ITEMS_CACHE_KEY)||'{}');
    return cache[String(orderId)] || [];
  }catch(e){ return []; }
}

async function loadAdminOrders(){
  const {data,error}=await supabaseClient.from('orders').select('*').order('id',{ascending:false});
  if(error){ state.orders=[]; toast('Could not load orders from database.'); return; }
  state.orders=(data||[]).map(o=>({
    id:`ORD-${o.id}`, dbId:o.id, customer:o.name || 'Customer',
    amount:Number(o.total)||0, items:getOrderItemsCache(o.id).reduce((n,x)=>n+Number(x.qty||0),0),
    status:o.status || 'Order Confirmed',
    date:o.order_date ? new Date(o.order_date).toLocaleDateString('en-IN') : '—',
    paymentMethod:o.payment || '—'
  }));
}

async function initFolkMade(){
  try{
    const {data:{session}} = await supabaseClient.auth.getSession();
    if(session?.user?.email){
      const profile=await getProfileByEmail(session.user.email.toLowerCase());
      currentUser=makeCurrentUser(profile);
      if(!currentUser) await supabaseClient.auth.signOut();
      else await loadWishlist();
    } else {
      try{
        const saved=JSON.parse(localStorage.getItem('folkmade_current_user')||'null');
        currentUser=saved?.role==='admin' ? saved : null;
      }catch(e){ currentUser=null; }
    }
    await loadProductsFromDatabase();
  }catch(e){
    products=[...fallbackProducts];
    
  }
  render();
}

const $=id=>document.getElementById(id);
function money(n){return '₹'+Number(n).toLocaleString('en-IN')}
function toast(msg){$('toast').textContent=msg;$('toast').classList.remove('hidden');setTimeout(()=>$('toast').classList.add('hidden'),2500)}
function showView(v){state.view=v;render();window.scrollTo({top:0,behavior:'smooth'})}
async function toggleAdmin(){
  if(currentUser && currentUser.role==='admin'){ await loadAdminOrders(); showView('admin'); }
  else openAuth();
}
function clearSearch(){state.search='';$('searchInput').value='';renderShop()}
function setCategory(c){state.category=c;renderShop()}
function filtered(){
let arr=products.filter(p=>p && p.title && p.category !== 'Traditional Edibles' && (state.category==='All'||p.category===state.category)&&
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
<div class="hero-copy"><span class="pill">INDIA'S HANDMADE MARKETPLACE</span><h1>Beautiful things.<br><em>Made by hand.</em></h1><p>Discover authentic crafts, traditional foods and timeless pieces made by skilled Indian artisans — directly from their workshops to your home.</p><div class="hero-actions"><button class="primary" onclick="setCategory('Handmade Decor')">Shop Handcrafted Decor <span>→</span></button></div><div class="hero-proof"><span>✓ Verified artisans</span><span>✓ Authentic products</span><span>✓ India-wide delivery</span></div></div>
<div class="hero-art"><div class="hero-card-main"><span>CRAFTED IN INDIA</span><strong>Every piece<br>has a story.</strong><small>From artisan hands to your home</small></div><div class="hero-card-float">✦<b>500+</b><span>Artisans</span></div></div>
</section>
<div class="trust-strip"><div><b>✦</b><span><strong>Authentic Craft</strong>Made by real artisans</span></div><div><b>₹</b><span><strong>Fair Pricing</strong>Better value for makers</span></div><div><b>↗</b><span><strong>Pan-India Delivery</strong>From village to doorstep</span></div><div><b>♡</b><span><strong>Made with Care</strong>Thoughtfully handcrafted</span></div></div>
<div class="section-title"><div><span class="eyebrow">EXPLORE THE COLLECTION</span><h2>Shop by Tradition</h2><p>Find something special from India's diverse craft and food traditions.</p></div></div>
<div class="categories">
<div class="category category-decor ${state.category==='Handmade Decor'?'active':''}" onclick="setCategory('Handmade Decor')"><div class="category-icon">🏺</div><div><span>01</span><h3>Handmade Decor</h3><p>Pottery, woodcraft, textiles & rugs</p></div><b>↗</b></div>

</div>
<div class="market-head"><div><span class="eyebrow">CURATED FOR YOU</span><h2>${state.category==='All'?'Featured Marketplace':state.category}</h2><p>${arr.length} handcrafted products available</p></div><div class="controls"><button class="tab ${state.category==='All'?'active':''}" onclick="setCategory('All')">All</button><select class="select" onchange="state.sort=this.value;renderShop()"><option value="featured">Featured</option><option value="price-low">Price: Low to High</option><option value="price-high">Price: High to Low</option><option value="rating">Top Rated</option></select><label class="price-filter">Up to ₹${state.price}<input class="range" type="range" min="300" max="3000" step="50" value="${state.price}" oninput="state.price=+this.value;renderShop()"></label></div></div>
<div class="products">${arr.length?arr.map(productCard).join(''):`<div class="empty" style="grid-column:1/-1"><strong>No products found</strong><br>Try changing your search or price filter.</div>`}</div>
<section class="artisan-banner"><div><span class="eyebrow">MEET THE MAKERS</span><h2>Behind every product is a person.</h2><p>FolkMade helps skilled artisans take their traditional craft to customers across India.</p></div><button class="secondary-light" onclick="showView('about')">Meet Our Artisans →</button></section>
<footer class="footer"><div class="footer-brand"><div class="brand-name">FolkMade</div><p>Handcrafted Traditions from India</p></div><div><b>Shop</b><span>Handmade Decor</span><span>Wishlist</span></div><div><b>FolkMade</b><span>Our Artisans</span><span>My Orders</span><span>Seller / Admin</span></div><div><b>Promise</b><span>Authentic Craft</span><span>Fair Pricing</span><span>Pan-India Delivery</span></div><div class="footer-bottom">© 2026 FolkMade · Handcrafted with tradition.</div></footer>
</div>`
}
function renderWishlist(){let arr=products.filter(p=>p && p.title && p.category !== 'Traditional Edibles' && state.wishlist.includes(p.id));$('app').innerHTML=`<div class="container"><div class="section-title"><div><h2>Saved Wishlist</h2><p>Your favourite FolkMade products.</p></div></div><div class="products">${arr.length?arr.map(p=>({...p,actions:`<button class="primary" onclick="addCart('${p.id}')">Add to Cart</button><button class="secondary" onclick="toggleWishlist('${p.id}')">Remove</button>`})).map(productCard).join(''):`<div class="empty" style="grid-column:1/-1">Your wishlist is empty.</div>`}</div></div>`}
function renderAbout(){
$('app').innerHTML=`<div class="container">
<div class="section-title"><div><h2>About FolkMade</h2><p>A marketplace connecting customers with India's rural craft and food traditions.</p></div></div>
<div class="about-grid"><div class="info-card"><h3>Our Mission</h3><p>FolkMade brings authentic handcrafted decor closer to customers while giving rural artisans a digital marketplace.</p></div><div class="info-card"><h3>What We Offer</h3><p>From Jaipur blue pottery and Saharanpur woodcraft, every product carries a story of its maker.</p></div></div>
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
      <div class="field"><label>Login as</label><select id="login-role" required><option value="user">User</option><option value="seller">Seller</option><option value="admin">Admin</option></select></div>
      <div class="field" style="margin-top:12px"><label>Email</label><input id="login-email" type="email" placeholder="Enter your email" required></div>
      <div class="field" style="margin-top:12px"><label>Password</label><input id="login-password" type="password" placeholder="Enter your password" required></div>
      <div id="login-error"></div>
      <button class="primary full" type="submit">Login</button>
    </form>
    <p class="auth-note">New to FolkMade? <button class="auth-link" type="button" onclick="showRegisterForm()">Create a new account</button></p>`;
}
function showRegisterForm(){
  $('authContent').innerHTML = `
    <h2>Create FolkMade Account</h2>
    <p class="auth-sub">Register as a customer or seller.</p>
    <form onsubmit="registerAccount(event)">
      <div class="field"><label>Register as</label><select id="reg-role" required><option value="user">User</option><option value="seller">Seller</option></select></div>
      <div class="field" style="margin-top:12px"><label>Full Name</label><input id="reg-name" placeholder="Enter your full name" required></div>
      <div class="field" style="margin-top:12px"><label>Email</label><input id="reg-email" type="email" placeholder="Enter your email" required></div>
      <div class="field" style="margin-top:12px"><label>Phone</label><input id="reg-phone" type="tel" placeholder="Enter phone number" required></div>
      <div class="field" style="margin-top:12px"><label>Password</label><input id="reg-password" type="password" placeholder="Create a password" required></div>
      <div class="field" style="margin-top:12px"><label>Confirm Password</label><input id="reg-confirm" type="password" placeholder="Confirm password" required></div>
      <div id="register-error"></div>
      <button class="primary full" type="submit">Create Account</button>
    </form>
    <p class="auth-note">Already registered? <button class="auth-link" type="button" onclick="showLoginForm()">Login here</button></p>`;
}
async function loginAccount(e){
  e.preventDefault();
  const role=$('login-role').value,email=$('login-email').value.trim().toLowerCase(),password=$('login-password').value;
  if(role==='admin'){
    if(email===ADMIN_ACCOUNT.email && password===ADMIN_ACCOUNT.password){
      currentUser={...ADMIN_ACCOUNT};
      localStorage.setItem('folkmade_current_user',JSON.stringify(currentUser));
      await loadAdminOrders();
      $('authModal').classList.add('hidden'); state.view='admin'; render(); toast('Welcome Admin!'); return;
    }
    $('login-error').innerHTML='<div class="auth-error">Invalid email, password, or account type.</div>'; return;
  }
  const {data,error}=await supabaseClient.auth.signInWithPassword({email,password});
  if(error || !data.user){
    $('login-error').innerHTML='<div class="auth-error">Invalid email or password.</div>'; return;
  }
  const profile=await getProfileByEmail(email);
  if(!profile || profile.role!==role){
    await supabaseClient.auth.signOut();
    $('login-error').innerHTML='<div class="auth-error">Invalid email, password, or account type.</div>'; return;
  }
  currentUser=makeCurrentUser(profile);
  localStorage.setItem('folkmade_current_user',JSON.stringify(currentUser));
  await loadWishlist();
  $('authModal').classList.add('hidden');
  state.view=role==='seller'?'seller':'shop';
  render(); toast(role==='seller'?'Seller login successful!':'Login successful!');
}
async function registerAccount(e){
  e.preventDefault();
  const role=$('reg-role').value,name=$('reg-name').value.trim(),email=$('reg-email').value.trim().toLowerCase(),phone=$('reg-phone').value.trim(),password=$('reg-password').value,confirm=$('reg-confirm').value,error=$('register-error');
  if(password!==confirm){error.innerHTML='<div class="auth-error">Passwords do not match.</div>';return;}
  if(password.length<6){error.innerHTML='<div class="auth-error">Password must be at least 6 characters.</div>';return;}
  if(email===ADMIN_ACCOUNT.email){error.innerHTML='<div class="auth-error">This email is reserved for the administrator.</div>';return;}
  const {data:existing}=await supabaseClient.from('users').select('id').eq('email',email).limit(1).maybeSingle();
  if(existing){error.innerHTML='<div class="auth-error">This email is already registered. Please login.</div>';return;}
  const {data,error:authError}=await supabaseClient.auth.signUp({email,password,options:{data:{name,phone,role}}});
  if(authError){error.innerHTML=`<div class="auth-error">${authError.message}</div>`;return;}
  const {data:profile,error:profileError}=await supabaseClient.from('users').insert({name,email,phone,role}).select('*').single();
  if(profileError){
    await supabaseClient.auth.signOut();
    error.innerHTML='<div class="auth-error">Account could not be completed. Please try again.</div>'; return;
  }
  if(data.session){
    currentUser=makeCurrentUser(profile);
    localStorage.setItem('folkmade_current_user',JSON.stringify(currentUser));
    await loadWishlist(); $('authModal').classList.add('hidden'); state.view=role==='seller'?'seller':'shop'; render();
    toast('Account created successfully!');
  }else{
    showLoginForm('Account created. Please verify your email if confirmation is enabled, then login.');
  }
}
async function logoutAccount(){
  if(currentUser && currentUser.role!=='admin') await supabaseClient.auth.signOut();
  currentUser=null; localStorage.removeItem('folkmade_current_user'); state.wishlist=[]; state.view='shop'; render(); toast('Logged out successfully.');
}

function renderAccountButton(){const btn=$('accountBtn');if(!btn)return;if(currentUser){btn.textContent=`👤 ${currentUser.name}`;btn.onclick=()=>showProfile()}else{btn.textContent='👤 Login / Register';btn.onclick=openAuth}}
function showProfile(){$('app').innerHTML=`<div class="container"><div class="section-title"><div><span class="eyebrow" style="color:#166534!important">MY ACCOUNT</span><h2 style="color:#14532d!important">My Profile</h2><p style="color:#292524!important">Your FolkMade account details.</p></div></div><div class="info-card" style="background:#ffffff!important;color:#292524!important"><h3 style="color:#14532d!important">Profile Information</h3><p style="color:#292524!important"><b style="color:#14532d!important">Name:</b> ${currentUser.name}</p><p style="color:#292524!important"><b style="color:#14532d!important">Email:</b> ${currentUser.email}</p><p style="color:#292524!important"><b style="color:#14532d!important">Account Type:</b> ${currentUser.role}</p><button class="primary" onclick="showView('orders')">My Orders</button><button class="profile-btn" onclick="showView('shop')" style="margin-left:10px">Continue Shopping</button><button class="profile-btn" onclick="logoutAccount()" style="margin-left:10px">Logout</button></div></div>`}
function renderSeller(){
  $('app').innerHTML = `
    <div class="container">
      <div class="section-title">
        <div>
          <h2>Seller Dashboard</h2>
          <p>Welcome, ${currentUser ? currentUser.name : 'Seller'}.</p>
        </div>
        <button class="primary" onclick="openAdd()">+ Add Product</button>
      </div>

      <div class="info-card">
        <h3>Sell Your Product</h3>
        <p>Add your handcrafted product to the FolkMade marketplace.</p>
        <button class="primary" onclick="openAdd()">+ Add Product</button>
        <button class="secondary" onclick="showView('shop')" style="margin-left:10px">Back to Marketplace</button>
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
async function renderOrders(){
  if(!currentUser){
    $('app').innerHTML=`<div class="container"><div class="empty"><strong>Please login to view your orders.</strong><br><button class="primary" style="margin-top:12px" onclick="openAuth()">Login / Register</button></div></div>`;
    return;
  }
  $('app').innerHTML=`<div class="container"><div class="section-title"><div><span class="eyebrow">ORDER HISTORY</span><h2>My Orders</h2><p>Track and manage your FolkMade orders.</p></div></div><div class="empty">Loading your orders...</div></div>`;
  const {data,error}=await supabaseClient.from('orders').select('*').eq('user_id',currentUser.id).order('id',{ascending:false});
  if(error){$('app').innerHTML=`<div class="container"><div class="empty"><strong>Could not load orders.</strong><br>Please try again.</div></div>`;return;}
  const userOrders=data||[];
  $('app').innerHTML=`<div class="container"><div class="section-title"><div><span class="eyebrow">ORDER HISTORY</span><h2>My Orders</h2><p>Track and manage your FolkMade orders.</p></div></div>
  ${userOrders.length?userOrders.map(o=>{const items=getOrderItemsCache(o.id);return `<div class="info-card" style="margin-bottom:16px"><div style="display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap"><div><h3 style="margin-bottom:6px">Order ORD-${o.id}</h3><p><b>Date:</b> ${o.order_date?new Date(o.order_date).toLocaleDateString('en-IN'):'—'}</p><p><b>Payment:</b> ${o.payment||'—'}</p><p><b>Status:</b> ${o.status||'Order Confirmed'}</p><p><b>Total:</b> ${money(o.total)}</p></div><div style="min-width:220px"><b>Items</b><div style="margin-top:8px">${items.length?items.map(item=>{const p=products.find(x=>String(x.id)===String(item.id));return p?`<p style="margin:5px 0">${p.title} × ${item.qty}</p>`:''}).join(''):'<p style="margin:5px 0">Order items saved.</p>'}</div></div></div>${o.status!=='Cancelled'?`<button class="small-btn danger" style="margin-top:12px" onclick="cancelOrder('${o.id}')">Cancel Order</button>`:`<span class="verified" style="display:inline-block;margin-top:12px">Order Cancelled</span>`}</div>`}).join(''):`<div class="empty"><strong>No orders found.</strong><br>Your placed orders will appear here.</div>`}</div>`;
}
async function cancelOrder(id){
  if(!currentUser)return;
  const {error}=await supabaseClient.from('orders').update({status:'Cancelled'}).eq('id',Number(id)).eq('user_id',currentUser.id);
  if(error){toast('Could not cancel the order.');return;}
  toast('Order cancelled successfully!'); renderOrders();
}
async function toggleWish(id){
  if(!currentUser || currentUser.role==='admin'){openAuth();return;}
  const pid=Number(id);
  if(state.wishlist.includes(String(id))){
    const {error}=await supabaseClient.from('wishlist').delete().eq('user_id',currentUser.id).eq('product_id',pid);
    if(error){toast('Could not update Wishlist.');return;}
    state.wishlist=state.wishlist.filter(x=>x!==String(id)); toast('Removed from Wishlist');
  }else{
    const {error}=await supabaseClient.from('wishlist').insert({user_id:currentUser.id,product_id:pid});
    if(error){toast('Could not save to Wishlist.');return;}
    state.wishlist.push(String(id)); toast('Saved to Wishlist!');
  }
  render();
}
function addCart(id){let p=products.find(x=>x.id===id),x=state.cart.find(x=>x.id===id);if(x)x.qty++;else state.cart.push({id,qty:1});toast(`Added "${p.title}" to your cart!`);setTimeout(()=>{checkout()},300)}
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
function checkout(){
  if(!state.cart.length)return toast('Your cart is empty');
  if(!currentUser || currentUser.role==='admin'){openAuth();return;}
  let name=currentUser?.name||'',phone=currentUser?.phone||'';
  $('modalContent').innerHTML=`<h2>Checkout</h2><p class="auth-sub">Complete your order details</p><div class="field"><label>Full Name</label><input id="order-name" value="${name}" placeholder="Enter your name" required></div><div class="field" style="margin-top:12px"><label>Phone Number</label><input id="order-phone" value="${phone}" type="tel" placeholder="Enter phone number" required></div><div class="field" style="margin-top:12px"><label>Delivery Address</label><textarea id="order-address" placeholder="Enter complete delivery address" rows="4" required></textarea></div><div class="field" style="margin-top:12px"><label>Payment Method</label><select id="order-payment"><option value="COD">Cash on Delivery</option><option value="UPI">UPI</option><option value="Card">Credit / Debit Card</option></select></div><button class="primary full" style="margin-top:18px" onclick="placeOrder()">Place Order</button>`;
  $('modal').classList.remove('hidden');
}
async function placeOrder(){
  if(!currentUser || currentUser.role==='admin'){openAuth();return;}
  const name=$('order-name').value.trim(),phone=$('order-phone').value.trim(),address=$('order-address').value.trim(),payment=$('order-payment').value;
  if(!name||!phone||!address)return toast('Please fill all details');
  const total=state.cart.reduce((sum,item)=>{const p=products.find(x=>String(x.id)===String(item.id));return sum+(p?p.price*item.qty:0)},0);
  const shipping=total>999?0:99;
  const {data,error}=await supabaseClient.from('orders').insert({
    user_id:currentUser.id,name,phone,address,payment,total:total+shipping,status:'Order Confirmed',order_date:new Date().toISOString()
  }).select('*').single();
  if(error){toast('Order could not be placed. Please try again.');return;}
  saveOrderItemsCache(data.id,state.cart.map(x=>({...x})));
  const orderId='ORD-'+data.id;
  state.cart=[];hideModal();closeCart();state.view='orders';renderOrders();
  toast(`Order ${orderId} placed successfully!`);
}
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
<div class="field"><label>Category</label><select id="f-cat"><option ${p.category==='Handmade Decor'?'selected':''}>Handmade Decor</option></select></div>
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
async function saveProduct(e,id){
  e.preventDefault();

  const old = id ? products.find(x => String(x.id) === String(id)) : null;

  const title = $('f-title').value.trim();
  const category = $('f-cat').value;
  const subCategory = $('f-sub').value || 'General';
  const price = Number($('f-price').value);
  const originalPrice = Number($('f-original').value) || Math.round(price * 1.2);

  const dbProduct = {
    title,
    category,
    price,
    original_price: originalPrice,
    rating: old?.rating || 5,
    reviews_count: old?.reviewsCount || 0,
    created_at: new Date().toISOString(),
    artisan_name: $('f-artisan').value.trim(),
    artisan_region: $('f-region').value.trim(),
    image: $('f-image').value ||
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600'
  };

  let row = null;
  let error = null;

  if(id){
    const result = await supabaseClient
      .from('products')
      .update(dbProduct)
      .eq('id', Number(id))
      .select('*')
      .single();

    row = result.data;
    error = result.error;
  }else{
    const result = await supabaseClient
      .from('products')
      .insert([dbProduct])
      .select('*')
      .single();

    row = result.data;
    error = result.error;
  }

  if(error){
    console.error('PRODUCT DATABASE ERROR:', error);
    toast('Database Error: ' + error.message);
    return;
  }

  if(!row){
    toast('Product was not returned by database.');
    return;
  }

  productMeta[String(row.id)] = {
    subCategory,
    description: $('f-desc').value,
    materials: $('f-materials').value,
    inStock: Number($('f-stock').value) || 10,
    isFeatured: old?.isFeatured || false,
    isBestseller: old?.isBestseller || false
  };

  saveProductMeta();

  const mapped = mapProductRow(row);
  const idx = products.findIndex(x => String(x.id) === String(row.id));

  if(idx >= 0){
    products[idx] = mapped;
  }else{
    products.unshift(mapped);
  }

  hideModal();
  render();

  toast(id
    ? 'Product details updated successfully!'
    : 'New handcrafted product added to store!'
  );
}
async function deleteProduct(id){
  if(!confirm('Are you sure you want to delete this product from the marketplace?'))return;
  const {error}=await supabaseClient.from('products').delete().eq('id',Number(id));
  if(error){toast('Product could not be deleted from database.');return;}
  delete productMeta[String(id)];saveProductMeta();
  products=products.filter(p=>String(p.id)!==String(id));
  toast('Product removed from FolkMade catalog');renderAdmin();
}

$('searchInput').addEventListener('input',()=>{state.search=$('searchInput').value;renderShop()});initFolkMade();
