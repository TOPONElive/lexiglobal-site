// JWT-like simple tokens without external deps. NOT for high-security production.
// Uses HMAC-SHA256 with JWT_SECRET from env.
const crypto = require('crypto');

function base64url(src){ return Buffer.from(src).toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,''); }

function sign(payloadObj, secret){
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = base64url(JSON.stringify(payloadObj));
  const sig = crypto.createHmac('sha256', secret).update(`${header}.${payload}`).digest('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
  return `${header}.${payload}.${sig}`;
}

function verify(token, secret){
  try{
    const [headerB64, payloadB64, sig] = token.split('.');
    if(!headerB64 || !payloadB64 || !sig) return null;
    const expected = crypto.createHmac('sha256', secret).update(`${headerB64}.${payloadB64}`).digest('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
    if(!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig))) return null;
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64').toString('utf8'));
    if(payload.exp && Date.now() > payload.exp) return null;
    return payload;
  }catch(e){ return null; }
}

module.exports = { sign, verify };