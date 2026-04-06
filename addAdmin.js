const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Checking database for shanil@gmail.com...");

  const adminEmail = "shanil@gmail.com";
  // This is the securely hashed version of the password "admin"
  const passwordHash = "$2a$10$wO3r//r/eQ66uVj.Rj55qeuJ2rXXwWz5bXyG2W/wHhQ8Y8K/C4Y3W";

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { 
      // If the user already exists, we simply upgrade them to an ADMIN
      role: "ADMIN" 
    },
    create: {
      // If they don't exist yet, we create a new admin account
      email: adminEmail,
      name: "Shanil",
      password: passwordHash,
      role: "ADMIN",
    },
  });

  console.log(`\n✅ SUCCESS!`);
  console.log(`Account email: ${admin.email}`);
  console.log(`Account role: ${admin.role}`);
  console.log(`Password: admin\n`);
}

main()
  .catch((e) => {
    console.error("Error creating user:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
