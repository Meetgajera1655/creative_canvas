// ============================================================
//  config/firebase.js  —  Firebase Admin SDK + DB helpers
// ============================================================

const admin = require('firebase-admin');

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
let privateKey = process.env.FIREBASE_PRIVATE_KEY;
const databaseURL = process.env.FIREBASE_DATABASE_URL;

if (!projectId || !clientEmail || !privateKey || !databaseURL) {
  throw new Error(
    "Missing one or more Firebase environment variables: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY, FIREBASE_DATABASE_URL"
  );
}

// Handle escaped newlines in private key
privateKey = privateKey.replace(/\\n/g, '\n');

admin.initializeApp({
  credential: admin.credential.cert({
    projectId,
    clientEmail,
    privateKey,
  }),
  databaseURL,
});

const db = admin.database();

// ── Generic CRUD helpers ──────────────────────────────────────

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
  const val  = snap.val();
  if (!val) return [];
  return Object.entries(val).map(([k, v]) => ({ _key: k, ...v }));
}

async function dbQuery(path, field, value) {
  const snap = await db.ref(path).orderByChild(field).equalTo(value).once('value');
  const val  = snap.val();
  if (!val) return [];
  return Object.entries(val).map(([k, v]) => ({ _key: k, ...v }));
}

// ── Domain helpers ────────────────────────────────────────────

async function findUserByEmail(email) {
  const results = await dbQuery('users', 'email', email.toLowerCase());
  return results[0] || null;
}

async function getCartItems(userId) {
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

module.exports = {
  db, admin,
  dbGet, dbInsert, dbUpdate, dbDelete, dbGetAll, dbQuery,
  findUserByEmail, getCartItems, cartCount, checkCartItem
};
