const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGO_URI = 'mongodb+srv://admin:12345678aA@cluster0.z8ynxsc.mongodb.net/giridhar-eye-institute';

async function createAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB\n');

    const db = mongoose.connection.db;
    const adminsCollection = db.collection('admins');
    
    // Check if user already exists
    const existingUser = await adminsCollection.findOne({ email: 'admin@gmail.com' });
    
    if (existingUser) {
      console.log('User admin@gmail.com already exists!');
      console.log('Status:', existingUser.status);
      console.log('Role:', existingUser.role);
      
      // Update password if needed
      const newPasswordHash = await bcrypt.hash('admin@123', 10);
      await adminsCollection.updateOne(
        { email: 'admin@gmail.com' },
        { $set: { password: newPasswordHash, status: 'Active' } }
      );
      console.log('\nPassword updated to "admin@123" and status set to Active');
    } else {
      // Create new admin user
      const passwordHash = await bcrypt.hash('admin@123', 10);
      
      const newUser = {
        name: 'Admin',
        email: 'admin@gmail.com',
        password: passwordHash,
        role: 'Admin',
        status: 'Active',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const result = await adminsCollection.insertOne(newUser);
      console.log('Admin user created successfully!');
      console.log('Email: admin@gmail.com');
      console.log('Password: admin@123');
      console.log('User ID:', result.insertedId);
    }
    
    await mongoose.disconnect();
    console.log('\nDone! You can now login with admin@gmail.com / admin@123');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

createAdmin();
