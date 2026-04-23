// ============================================================
//  config/firebase.js  —  Firebase Admin SDK + DB helpers
// ============================================================

const admin = require('firebase-admin');

/* ===========================
   ✅ ENV VARIABLES
=========================== */

const {
  FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY,
  FIREBASE_DATABASE_URL
} = process.env;

if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY || !FIREBASE_DATABASE_URL) {
  throw new Error(
    "❌ Missing Firebase ENV variables. Check Render environment settings."
  );
}

/* ===========================
   ✅ HANDLE PRIVATE KEY
=========================== */

const privateKey = FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');

/* ===========================
   ✅ PREVENT MULTIPLE INIT (IMPORTANT)
=========================== */

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
    databaseURL: FIREBASE_DATABASE_URL,
  });

  console.log("🔥 Firebase initialized successfully");
}

const db = admin.database();

/* ===========================
   📦 GENERIC DB HELPERS
=========================== */

async function dbGet(path) {
  const snap = await db.ref(path).once('value');
  return snap.val();
}

async function dbInsert(path, data) {
  const ref = db.ref(path).push();
  await ref.set({ ...data, _created: Date.now() });
  return ref.key;
}

async function dbUpdate(path, data) {
  await db.ref(path).update(data);
  return true;
}

async function dbDelete(path) {
  await db.ref(path).remove();
  return true;
}

async function dbGetAll(path) {
  const snap = await db.ref(path).once('value');
  const val = snap.val();
  if (!val) return [];
  return Object.entries(val).map(([k, v]) => ({ _key: k, ...v }));
}

async function dbQuery(path, field, value) {
  const snap = await db.ref(path)
    .orderByChild(field)
    .equalTo(value)
    .once('value');

  const val = snap.val();
  if (!val) return [];
  return Object.entries(val).map(([k, v]) => ({ _key: k, ...v }));
}

/* ===========================
   🧠 DOMAIN HELPERS
=========================== */

async function findUserByEmail(email) {
  if (!email) return null;
  const results = await dbQuery('users', 'email', email.toLowerCase());
  return results[0] || null;
}

async function getCartItems(userId) {
  if (!userId) return [];
  return await dbQuery('cart', 'user_id', userId);
}

async function cartCount(userId) {
  const items = await getCartItems(userId);
  return items.length;
}

async function checkCartItem(userId, productId) {
  const items = await getCartItems(userId);
  return items.find(i => i.product_id === productId) || null;
}

/* ===========================
   📤 EXPORTS
=========================== */

module.exports = {
  db,
  admin,
  dbGet,
  dbInsert,
  dbUpdate,
  dbDelete,
  dbGetAll,
  dbQuery,
  findUserByEmail,
  getCartItems,
  cartCount,
  checkCartItem
};