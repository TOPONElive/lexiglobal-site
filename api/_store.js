// بسيط: مخزن مؤقت في الذاكرة. في الإنتاج يجب استبداله بقاعدة بيانات (Supabase/Postgres).
const { randomUUID, createHash } = require('crypto');

const store = {
  users: [], // { id, name, email, passwordHash, role }
  transfers: [], // { id, fromId, toIdOrEmail, amount, ts }
};

function hash(pwd){
  return createHash('sha256').update(pwd||'').digest('hex');
}

function findUserByEmail(email){ return store.users.find(u=>u.email === (email||'').toLowerCase()); }
function findUserById(id){ return store.users.find(u=>u.id === id); }

function createUser({ name, email, password, role }){
  email = (email||'').toLowerCase();
  if(findUserByEmail(email)) throw new Error('Email exists');
  const id = randomUUID();
  const u = { id, name, email, passwordHash: hash(password), role };
  store.users.push(u);
  return { ...u, passwordHash: undefined };
}

function ensureAdminFromEnv(env){
  const adminEmail = env.ADMIN_EMAIL;
  const adminPwd = env.ADMIN_PASSWORD;
  if(adminEmail && adminPwd){
    if(!findUserByEmail(adminEmail)){
      store.users.push({ id: 'admin-'+randomUUID(), name: 'Administrator', email: adminEmail.toLowerCase(), passwordHash: hash(adminPwd), role: 'admin' });
      console.log('Admin created from ENV:', adminEmail);
    }
  }
}

module.exports = { store, hash, createUser, findUserByEmail, findUserById, ensureAdminFromEnv };