const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://admin:12345678aA@cluster0.z8ynxsc.mongodb.net/giridhar-eye-institute';

async function checkUser() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB\n');

    const db = mongoose.connection.db;
    
    // Check admins collection
    const admins = await db.collection('admins').find({}).toArray();
    console.log('Users in admins collection:');
    console.log(JSON.stringify(admins, null, 2));
    
    if (admins.length === 0) {
      console.log('\nNo users found in database!');
      console.log('You need to create an admin user first.');
    } else {
      // Check specific user
      const adminUser = await db.collection('admins').findOne({ email: 'admin@gmail.com' });
      if (adminUser) {
        console.log('\nFound admin@gmail.com:');
        console.log('Status:', adminUser.status);
        console.log('Role:', adminUser.role);
        console.log('Password hash:', adminUser.password);
      } else {
        console.log('\nUser admin@gmail.com not found in database');
      }
    }
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkUser();
