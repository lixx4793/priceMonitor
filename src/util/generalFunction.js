const crypto = require('crypto');

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const algorithm = process.env.CLIENT_SECRET;
  const secretKey = process.env.SECRET_KEY;
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    };
}

function decrypt(hash) {
  const algorithm = process.env.CLIENT_SECRET;
  const secretKey = process.env.SECRET_KEY;
  const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'));
  const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);
  return decrpyted.toString();
}

module.exports = {decrypt: decrypt, encrypt: encrypt}
