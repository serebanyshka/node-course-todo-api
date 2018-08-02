const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const password = 'qwerty';

bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash);
    console.log('Compare');
    bcrypt.compare(password, hash, (err, res) => console.log(res));
  });
});

// const data = {
//   id: 5
// }
//
// const token = jwt.sign(data, '123abc');
//
// console.log(token);
//
// const decoded = jwt.verify(token, '123abc');
//
// console.log(decoded);

// let message = 'I am user number 3';
//
// let hash = SHA256(message).toString();
//
// console.log(message, hash);
//
// const data = {
//   id: 4
// };
// const token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }
//
// const resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
//
// if(resultHash === token.hash) {
//   console.log('Data was not changed');
// } else {
//   console.log('Data was changed. Do not trust');
// }
