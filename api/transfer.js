const { verify } = require('./_auth');
const { findUserById, findUserByEmail, store } = require('./_store');

module.exports = (req, res) => {
  if(req.method !== 'POST'){ res.status(405).json({ success:false }); return; }
  let body='';
  req.on('data', c=>body+=c);
  req.on('end', ()=>{
    try{
      const cookies = (req.headers.cookie || '').split(';').map(s=>s.trim()).reduce((acc,c)=>{
        const [k,v] = c.split('='); if(k) acc[k]=v; return acc;
      }, {});
      const token = cookies['lexi_token'];
      const payload = require('./_auth').verify(token, process.env.JWT_SECRET || 'dev_secret');
      if(!payload) return res.status(401).json({ success:false, message:'Not authenticated' });

      const { to, amount } = JSON.parse(body||'{}');
      if(!to || !amount) return res.status(400).json({ success:false, message:'Missing fields' });

      const fromUser = findUserById(payload.id);
      if(!fromUser) return res.status(401).json({ success:false, message:'Invalid user' });

      // find recipient by email or id
      let toUser = findUserByEmail(to) || findUserById(to);
      // For prototype allow transfers to non-registered addresses (just record)
      const tx = { id: 'tx-'+Date.now(), fromId: fromUser.id, to: toUser ? toUser.id : to, amount: Number(amount), ts: Date.now() };
      store.transfers.push(tx);
      res.json({ success:true, message:'تحويل مسجّل محلياً (محاكاة)', tx });
    }catch(e){
      res.status(400).json({ success:false, message:'Bad Request' });
    }
  });
};