const { createUser } = require('./_store');

module.exports = (req, res) => {
  if(req.method !== 'POST'){ res.status(405).json({ success:false, message:'Method Not Allowed' }); return; }
  let body='';
  req.on('data', c=>body+=c);
  req.on('end', ()=>{
    try{
      const { name, email, password, role } = JSON.parse(body || '{}');
      if(!email || !password || !role) return res.status(400).json({ success:false, message:'Missing fields' });
      const user = createUser({ name: name||email.split('@')[0], email, password, role });
      res.status(201).json({ success:true, user: { id:user.id, email:user.email, name:user.name, role:user.role } });
    }catch(err){
      res.status(400).json({ success:false, message: err.message || 'Bad Request' });
    }
  });
};