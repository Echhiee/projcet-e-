// Landing page interactions and optional bridge to the full SPA store

// ===== Smooth anchor scrolling =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== Mobile nav toggle =====
const navToggle = document.getElementById('navToggle');
const nav = document.querySelector('.nav');
if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const open = nav.style.display === 'flex';
    nav.style.display = open ? 'none' : 'flex';
  });
}

// ===== Reveal-on-scroll =====
const io = new IntersectionObserver((entries) => {
  entries.forEach(en => {
    if (en.isIntersecting) en.target.classList.add('revealed');
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ===== Auth modal wiring =====
const auth = document.getElementById('authModal');
const segBtns = document.querySelectorAll('.seg__btn');
const nameField = document.querySelector('[data-field="name"]');
const submitBtn = document.getElementById('authSubmit');

function openAuth() { if (auth && !auth.open) auth.showModal(); }
function closeAuth() { if (auth && auth.open) auth.close(); }

const heroBtn = document.getElementById('btnStart');
const topBtn = document.getElementById('btnTopStart');
if (heroBtn) heroBtn.addEventListener('click', openAuth);
if (topBtn) topBtn.addEventListener('click', openAuth);

if (auth) {
  auth.addEventListener('click', (e) => {
    if (e.target === auth) closeAuth(); // click backdrop to close
  });
}

// Tab switch
let mode = 'signin';
segBtns.forEach(b => b.addEventListener('click', () => {
  segBtns.forEach(x => x.classList.remove('seg__btn--active'));
  b.classList.add('seg__btn--active');
  mode = b.getAttribute('data-tab');
  if (nameField) nameField.hidden = (mode !== 'signup');
  if (submitBtn) submitBtn.textContent = mode === 'signup' ? 'Create Account' : 'Sign In';
}));

// Demo account buttons (prefill)
const email = document.getElementById('email');
const password = document.getElementById('password');

document.querySelectorAll('[data-demo]').forEach(btn => {
  btn.addEventListener('click', () => {
    if (!email || !password) return;
    if (btn.getAttribute('data-demo') === 'patient') {
      email.value = 'john.smith@email.com';
      password.value = 'password123';
    } else {
      email.value = 'echhya.bhattarai@echhyascare.com';
      password.value = 'password123';
    }
    openAuth();
  });
});

// ===== Local storage store (your original seed) =====
const StorageKey = 'echhyas_care_store_v1';
const UserKey = 'echhyas_care_current_user_v1';

function seedStoreIfMissing() {
  if (localStorage.getItem(StorageKey)) return;
  const todayISO = () => new Date().toISOString().slice(0, 10);
  const uid = () => Math.random().toString(36).slice(2, 10);
  const state = {
    users: [
      { id: 'u1', role: 'patient', name: 'John Smith', email: 'john.smith@email.com', password: 'password123', age: 35, gender: 'Male' },
      { id: 'd1', role: 'doctor', name: 'Dr. Echhya Bhattarai', email: 'echhya.bhattarai@echhyascare.com', password: 'password123', specialty: 'General Physician', rating: 4.8, price: 1500 },
      { id: 'd2', role: 'doctor', name: 'Dr. Sanjita Shrestha', email: 'sanjita.shrestha@echhyascare.com', password: 'password123', specialty: 'Cardiologist', rating: 4.6, price: 2000 },
      { id: 'd3', role: 'doctor', name: 'Dr. Om Ghimire', email: 'om.ghimire@echhyascare.com', password: 'password123', specialty: 'Dermatologist', rating: 4.7, price: 1800 },
    ],
    appointments: [(() => {
      const d = new Date();
      d.setDate(d.getDate() + 2);
      return {
        id: uid(),
        patientId: 'u1',
        doctorId: 'd1',
        date: d.toISOString().slice(0, 10),
        time: '10:30',
        reason: 'Follow-up',
        status: 'upcoming',
        price: 1500
      };
    })()],
    symptoms: [],
    medications: [
      { id: 'm1', patientId: 'u1', name: 'Atorvastatin', dosage: '20 mg', freq: 'Once daily', start: todayISO(), end: '', logs: [] }
    ],
    messages: [],
    treatmentPlans: []
  };
  localStorage.setItem(StorageKey, JSON.stringify(state));
}

function tryLogin(emailVal, passwordVal) {
  seedStoreIfMissing();
  const state = JSON.parse(localStorage.getItem(StorageKey));
  const user = state.users.find(u => u.email === emailVal && u.password === passwordVal);
  if (!user) throw new Error('Invalid email or password.');
  localStorage.setItem(UserKey, JSON.stringify({ id: user.id, role: user.role }));
  return user;
}

/* ========================================================= */
/* =================== DASHBOARD LOGIC ===================== */
/* ========================================================= */

// elements for landing + dashboards
const landingSections = [
  document.querySelector('header.topbar'),
  document.querySelector('main.hero'),
  document.getElementById('features'),
  document.getElementById('about'),
  document.getElementById('testimonials'),
  document.getElementById('contact'),
  document.querySelector('footer.site-footer')
];

const patientDash = document.getElementById('patientDashboard');
const doctorDash = document.getElementById('doctorDashboard');
const btnSignOutPatient = document.getElementById('btnSignOutPatient');
const btnSignOutDoctor = document.getElementById('btnSignOutDoctor');

function hideLanding() {
  landingSections.forEach(sec => { if (sec) sec.style.display = 'none'; });
}

function showLanding() {
  landingSections.forEach(sec => { if (sec) sec.style.display = ''; });
  if (patientDash) patientDash.classList.add('is-hidden');
  if (doctorDash) doctorDash.classList.add('is-hidden');
  // clear hash so refresh stays on home
  if (location.hash === '#/patient' || location.hash === '#/doctor') {
    history.replaceState(null, '', location.pathname + location.search);
  }
}

function openDashboard(role) {
  hideLanding();
  if (role === 'doctor') {
    if (doctorDash) doctorDash.classList.remove('is-hidden');
    if (patientDash) patientDash.classList.add('is-hidden');
    location.hash = '#/doctor';
  } else {
    if (patientDash) patientDash.classList.remove('is-hidden');
    if (doctorDash) doctorDash.classList.add('is-hidden');
    location.hash = '#/patient';
  }
}

// sign-out buttons
if (btnSignOutPatient) {
  btnSignOutPatient.addEventListener('click', () => {
    localStorage.removeItem(UserKey);
    showLanding();
  });
}

if (btnSignOutDoctor) {
  btnSignOutDoctor.addEventListener('click', () => {
    localStorage.removeItem(UserKey);
    showLanding();
  });
}

/* ========================================================= */
/* ================== LOGIN / SIGNUP SUBMIT ================ */
/* ========================================================= */

if (submitBtn) {
  submitBtn.addEventListener('click', () => {
    if (!email || !password) return;
    const em = email.value.trim();
    const pw = password.value;

    if (!em || !pw) {
      alert('Please fill email and password.');
      return;
    }

    if (mode === 'signup') {
      // Very light signup that adds patient by default
      seedStoreIfMissing();
      const state = JSON.parse(localStorage.getItem(StorageKey));
      if (state.users.some(u => u.email === em)) {
        alert('Email already in use.');
        return;
      }
      const id = Math.random().toString(36).slice(2, 10);
      const fullNameInput = document.getElementById('name');
      const fullName = fullNameInput && fullNameInput.value ? fullNameInput.value : 'New User';
      state.users.push({
        id,
        role: 'patient',
        name: fullName,
        email: em,
        password: pw,
        age: 0,
        gender: '—'
      });
      localStorage.setItem(StorageKey, JSON.stringify(state));
    }

    try {
      const user = tryLogin(em, pw);
      closeAuth();
      openDashboard(user.role);   // <--- go to correct dashboard
    } catch (e) {
      alert(e.message);
    }
  });
}

/* ========================================================= */
/* ===== AUTO-SHOW DASHBOARD ONLY WHEN HASH IS SET ========= */
/* ========================================================= */

window.addEventListener('load', () => {
  const current = localStorage.getItem(UserKey);
  if (!current) {
    // if not logged in, make sure landing is visible
    showLanding();
    return;
  }
  const { role } = JSON.parse(current);
  const hash = location.hash;

  if (hash === '#/patient' && role === 'patient') {
    openDashboard('patient');
  } else if (hash === '#/doctor' && role === 'doctor') {
    openDashboard('doctor');
  } else {
    // logged in but on home -> stay on home until they click something
    showLanding();
  }
});

/* ========================================================= */
/* ===== PATIENT DASHBOARD — INTERNAL VIEW SWITCHING ======= */
/* ========================================================= */

const patientNavButtons = document.querySelectorAll('[data-p-view]');
const patientViews = document.querySelectorAll('.p-view');

function openPatientSection(sectionName) {
  // Hide all
  patientViews.forEach(v => v.classList.add('is-hidden'));

  // Remove active highlight from buttons
  patientNavButtons.forEach(btn => btn.classList.remove('dash-nav__item--active'));

  // Show selected section
  const target = document.querySelector(`[data-p-section="${sectionName}"]`);
  if (target) target.classList.remove('is-hidden');

  // Highlight button
  const activeBtn = document.querySelector(`[data-p-view="${sectionName}"]`);
  if (activeBtn) activeBtn.classList.add('dash-nav__item--active');
}

// Add click events
patientNavButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const section = btn.getAttribute('data-p-view');
    openPatientSection(section);
  });
});

/* Back button inside appointment view */
document.querySelectorAll('[data-p-view-target]').forEach(backBtn => {
  backBtn.addEventListener('click', () => {
    const target = backBtn.getAttribute('data-p-view-target');
    openPatientSection(target);
  });
});






