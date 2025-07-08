const bcrypt = require('bcrypt');

// The plain text password you want to hash
const plainPassword = 'sigmamale';

bcrypt.hash(plainPassword, 10)
  .then(hash => {
    console.log('✅ Your bcrypt hash is:');
    console.log(hash);
    console.log('👉 Copy this hash and save it into MongoDB as password_hash.');
  })
  .catch(err => console.error('❌ Error generating hash:', err));
