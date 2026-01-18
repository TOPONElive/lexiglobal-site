const { findUserByEmail, hash, ensureAdminFromEnv } = require('./_store');
const { sign } = require('./_auth');

module.exports = (req, res) => {
  // ensure admin exists if env provided
  ensureAdminFromEnv(process.env);

  if(req.method !== 'POST'){ res.status(405).json({ success:false }); return; }
  let body='';
  req.on('data', c=>body+=c);
  req.on('end', ()=>{
    try{
      const { email, password } = JSON.parse(body||'{}');
      const user = findUserByEmail(email);
      if(!user) return res.status(401).json({ success:false, message:'Invalid credentials' });
      const passHash = hash(password);
      if(passHash !== user.passwordHash) return res.status(401).json({ success:false, message:'Invalid credentials' });

      // create token
      const payload = { id: user.id, role: user.role, email: user.email, exp: Date.now() + (1000*60*60*24) };
      const token = sign(payload, process.env.JWT_SECRET || 'dev_secret');

      // set cookie
      res.setHeader('Set-Cookie', `lexi_token=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Lax; ${process.env.NODE_ENV==='production' ? 'Secure' : ''}`);
      res.json({ success:true, user:{ id:user.id, email:user.email, name:user.name, role:user.role } });
    }catch(e){
      res.status(400).json({ success:false, message:'Bad Request' });
    }
  });
};