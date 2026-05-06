// ===== FIREBASE SETUP =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBOfV2lWttM8ZVBLbWN5H822Nj5RqZ7yKw",
  authDomain: "mochimoo-juice.firebaseapp.com",
  databaseURL: "https://mochimoo-juice-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "mochimoo-juice",
  storageBucket: "mochimoo-juice.firebasestorage.app",
  messagingSenderId: "402689464148",
  appId: "1:402689464148:web:b67816e082cbe0fdee1ac1"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ===== FEATHER ICONS =====
feather.replace();

// ===== HAMBURGER =====
const hamburger = document.getElementById('hamburger-menu');
const navbarNav = document.querySelector('.navbar-nav');
hamburger.addEventListener('click', () => {
  navbarNav.classList.toggle('active');
});

// ===== SLIDER =====
const slides = document.querySelectorAll('.slide-img');
const titles = ['Mochiiee Daifuku', 'MochiMoo Juice'];
const descs = ['One bite and you\'re hooked', 'Fresh, cool, and delicious'];
const btns = ['#menu', '#menu'];
let current = 0;

function goTo(index) {
  slides[current].classList.remove('active');
  slides[current].classList.add('exit');
  setTimeout(() => slides[current].classList.remove('exit'), 500);

  current = (index + slides.length) % slides.length;
  slides[current].classList.add('active');

  document.getElementById('slide-title').textContent = titles[current];
  document.getElementById('slide-desc').textContent = descs[current];
  document.getElementById('slide-btn').href = btns[current];

  const nextBtn = document.getElementById('nextBtn');
  const prevBtn = document.getElementById('prevBtn');

  if (current === 0) {
    nextBtn.style.display = 'flex';
    prevBtn.style.display = 'none';
  } else {
    nextBtn.style.display = 'none';
    prevBtn.style.display = 'flex';
  }
}

window.addEventListener('load', () => {
  goTo(0);
});

document.getElementById('nextBtn').addEventListener('click', () => goTo(current + 1));
document.getElementById('prevBtn').addEventListener('click', () => goTo(current - 1));

// ===== CART =====
const cart = {};
const prices = {
  'Strawberry Choco': 7000,
  'Strawberry Cream': 7000,
  'Manggo Cream': 7000,
  'Choco Crunchy': 7000,
  'Jus Alpukat': 8000,
  'Jus Jambu': 7000,
};

// ===== TOAST =====
let toastTimeout = null;
function showToast(message) {
  const toast = document.getElementById('toastNotif');
  toast.textContent = message;
  toast.classList.add('show');
  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

// ===== TOMBOL TROLI =====
document.querySelectorAll('.cart-add-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const name = btn.getAttribute('data-name');
    cart[name] = (cart[name] || 0) + 1;
    updateCartCount();
    showToast(`🛒 ${name} dimasukkan ke keranjang!`);

    const cartIcon = document.getElementById('cart-icon');
    cartIcon.classList.add('bounce');
    setTimeout(() => cartIcon.classList.remove('bounce'), 400);
  });
});

// ===== TOMBOL ORDER =====
document.querySelectorAll('.order-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const name = btn.getAttribute('data-name');
    cart[name] = (cart[name] || 0) + 1;
    updateCartCount();
    renderCart();
    document.getElementById('cartOverlay').classList.add('active');
    feather.replace();
    setTimeout(() => {
      document.getElementById('nama').scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 200);
  });
});

function updateCartCount() {
  const total = Object.values(cart).reduce((a, b) => a + b, 0);
  document.getElementById('cart-count').textContent = total;
}

function renderCart() {
  const itemsEl = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total-section');
  const keys = Object.keys(cart).filter(k => cart[k] > 0);

  if (keys.length === 0) {
    itemsEl.innerHTML = '<p class="cart-empty">Keranjang masih kosong </p>';
    totalEl.innerHTML = '';
    return;
  }

  let total = 0;
  itemsEl.innerHTML = keys.map(name => {
    const subtotal = (prices[name] || 0) * cart[name];
    total += subtotal;
    return `
      <div class="cart-item-row">
        <span>${name}</span>
        <div class="qty-control">
          <button onclick="changeQty('${name}', -1)">−</button>
          <span>${cart[name]}</span>
          <button onclick="changeQty('${name}', 1)">+</button>
        </div>
        <span>Rp${subtotal.toLocaleString('id-ID')}</span>
      </div>`;
  }).join('');

  totalEl.innerHTML = `Total: Rp${total.toLocaleString('id-ID')}`;
  feather.replace();
}

window.changeQty = function(name, delta) {
  cart[name] = (cart[name] || 0) + delta;
  if (cart[name] <= 0) delete cart[name];
  updateCartCount();
  renderCart();
}

// ===== BUKA & TUTUP CART =====
document.getElementById('cart-icon').addEventListener('click', (e) => {
  e.preventDefault();
  renderCart();
  document.getElementById('cartOverlay').classList.add('active');
  feather.replace();
});

document.getElementById('closeCart').addEventListener('click', () => {
  document.getElementById('cartOverlay').classList.remove('active');
});

document.getElementById('cartOverlay').addEventListener('click', (e) => {
  if (e.target === document.getElementById('cartOverlay')) {
    document.getElementById('cartOverlay').classList.remove('active');
  }
});

// ===== ORDER via WhatsApp =====
document.getElementById('orderWa').addEventListener('click', () => {
  const nama = document.getElementById('nama').value.trim();
  const kelas = document.getElementById('kelas').value.trim();
  const keys = Object.keys(cart).filter(k => cart[k] > 0);

  if (!nama || !kelas) {
    alert('Isi nama dan kelas dulu ya! ');
    return;
  }
  if (keys.length === 0) {
    alert('Keranjang masih kosong!');
    return;
  }

  let total = 0;
  const pesananList = keys.map(name => {
    const subtotal = (prices[name] || 0) * cart[name];
    total += subtotal;
    return `  - ${name} x${cart[name]} = Rp${subtotal.toLocaleString('id-ID')}`;
  }).join('\n');

  const pesan = `Halo, saya mau order MochiMoo Juice! \n\nNama: ${nama}\nKelas: ${kelas}\nPesanan:\n${pesananList}\nTotal: Rp${total.toLocaleString('id-ID')}`;

  window.open(`https://wa.me/62895326168143?text=${encodeURIComponent(pesan)}`, '_blank');
});

// ===== REVIEW SYSTEM (FIREBASE) =====
const avatarColors = ['#e74c3c','#e91e8c','#9b59b6','#3498db','#2ecc71','#f39c12'];
let selectedStar = 0;

function renderReviews(reviews) {
  const grid = document.getElementById('review-grid');
  if (!grid) return;

  if (!reviews || reviews.length === 0) {
    grid.innerHTML = '<p class="review-empty">Belum ada ulasan. Jadilah yang pertama! 🌸</p>';
    return;
  }

  grid.innerHTML = reviews.map(r => {
    const initials = r.name.charAt(0).toUpperCase();
    const stars = '★'.repeat(r.star) + '☆'.repeat(5 - r.star);
    const color = avatarColors[r.name.charCodeAt(0) % avatarColors.length];
    return `
      <div class="review-card">
        <div class="review-card-top">
          <div class="avatar" style="background:${color}">${initials}</div>
          <div class="review-card-info">
            <span class="rv-name">${r.name}</span>
            <span class="rv-stars">${stars}</span>
          </div>
        </div>
        <p class="rv-text">${r.text}</p>
      </div>`;
  }).join('');
}

// Ambil data review dari Firebase secara realtime
const reviewsRef = ref(db, 'reviews');
onValue(reviewsRef, (snapshot) => {
  const data = snapshot.val();
  if (!data) {
    renderReviews([]);
    return;
  }
  // Ubah object Firebase jadi array, urutkan terbaru dulu
  const reviewsArray = Object.values(data).reverse();
  renderReviews(reviewsArray);
});

// ===== BINTANG PICKER =====
const starPicker = document.getElementById('star-picker');
if (starPicker) {
  starPicker.addEventListener('mouseover', (e) => {
    if (!e.target.dataset.val) return;
    const val = +e.target.dataset.val;
    starPicker.querySelectorAll('span').forEach((s, i) => {
      s.classList.toggle('active', i < val);
    });
  });

  starPicker.addEventListener('mouseleave', () => {
    starPicker.querySelectorAll('span').forEach((s, i) => {
      s.classList.toggle('active', i < selectedStar);
    });
  });

  starPicker.addEventListener('click', (e) => {
    if (!e.target.dataset.val) return;
    selectedStar = +e.target.dataset.val;
    starPicker.querySelectorAll('span').forEach((s, i) => {
      s.classList.toggle('active', i < selectedStar);
    });
  });
}

// ===== KIRIM ULASAN KE FIREBASE =====
document.getElementById('submit-review')?.addEventListener('click', async () => {
  const name = document.getElementById('review-name').value.trim();
  const text = document.getElementById('review-text').value.trim();

  if (!name) { showToast('Isi nama kamu dulu!'); return; }
  if (!text) { showToast('Tulis ulasanmu dulu!'); return; }
  if (selectedStar === 0) { showToast('Pilih bintang dulu!'); return; }

  try {
    await push(reviewsRef, {
      name,
      text,
      star: selectedStar,
      timestamp: Date.now()
    });

    // Reset form
    document.getElementById('review-name').value = '';
    document.getElementById('review-text').value = '';
    selectedStar = 0;
    starPicker.querySelectorAll('span').forEach(s => s.classList.remove('active'));

    showToast('Ulasan kamu berhasil dikirim!');
  } catch (err) {
    showToast('Gagal mengirim ulasan, coba lagi!');
    console.error(err);
  }
});