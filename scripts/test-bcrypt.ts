import bcrypt from "bcryptjs";

async function testBcrypt() {
  const password = "password123";
  const hashedPassword = await bcrypt.hash(password, 10);
  
  console.log("Original password:", password);
  console.log("Hashed password:", hashedPassword);
  
  // Test comparison with correct password
  const correctMatch = await bcrypt.compare(password, hashedPassword);
  console.log("Correct password match:", correctMatch);
  
  // Test comparison with incorrect password
  const incorrectMatch = await bcrypt.compare("wrongpassword", hashedPassword);
  console.log("Incorrect password match:", incorrectMatch);
  
  // Test with a known hash from the database
  const dbHash = "$2b$10$zeVqbKFntf3g59ixv7F8D.qjP6xzOghpvwxkze6jt8G0j.UetSyS.";
  const dbMatch = await bcrypt.compare(password, dbHash);
  console.log("Database hash match with 'password123':", dbMatch);
}

testBcrypt().catch(console.error);
