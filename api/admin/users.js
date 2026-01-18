const { verify } = require('../api/_auth');
const { store, findUserById } = require('../api/_store');

module.exports = (req,res) => {
  // Admin-only endpoint
  const cookies = (req.headers.cookie || '').split(';').map(s=>s.trim()).reduce((acc,c)=>{
    const [k,v] = c.split('='); if(k) acc[k]=v; return acc;
  }, {});
  const token = cookies['lexi_token'];
  const payload = require('../api/_auth').verify(token, process.env.JWT_SECRET || 'dev_secret');
  if(!payload) return res.status(401).json({ success:false, message:'Not authenticated' });
  if(payload.email !== (process.env.ADMIN_EMAIL || '').toLowerCase()) return res.status(403).json({ success:false, message:'Forbidden' });

  if(req.method === 'GET'){
    const users = store.users.map(u=>({ id:u.id, name:u.name, email:u.email, role:u.role }));
    return res.json({ success:true, users });
  }
  res.status(405).json({ success:false, message:'Method Not Allowed' });
};