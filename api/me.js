const { verify } = require('./_auth');
const { findUserById, ensureAdminFromEnv } = require('./_store');

module.exports = (req, res) => {
  ensureAdminFromEnv(process.env);
  const cookies = (req.headers.cookie || '').split(';').map(s=>s.trim()).reduce((acc,c)=>{
    const [k,v] = c.split('='); if(k) acc[k]=v; return acc;
  }, {});
  const token = cookies['lexi_token'];
  if(!token) return res.json({ user: null });
  const payload = verify(token, process.env.JWT_SECRET || 'dev_secret');
  if(!payload) return res.json({ user: null });
  const user = findUserById(payload.id);
  if(!user) return res.json({ user: null });
  res.json({ user: { id:user.id, email:user.email, name:user.name, role:user.role } });
};