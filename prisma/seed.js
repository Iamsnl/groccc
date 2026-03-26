const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const adminEmail = "admin@grocery.com";
  // password: admin
  const adminPassword = "$2a$10$wO3r//r/eQ66uVj.Rj55qeuJ2rXXwWz5bXyG2W/wHhQ8Y8K/C4Y3W";

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Admin User",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const categoriesData = [
    { name: "Fruits & Vegetables", slug: "fruits-and-vegetables", description: "Fresh produce from local farms." },
    { name: "Dairy & Bakery", slug: "dairy-and-bakery", description: "Milk, cheese, bread, and more." },
    { name: "Snacks & Branded Foods", slug: "snacks", description: "Chips, chocolates, and cookies." },
    { name: "Beverages", slug: "beverages", description: "Cold drinks, juices, tea." },
  ];

  for (const cat of categoriesData) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
      },
    });

    // Add some products to the category
    if (cat.slug === "fruits-and-vegetables") {
      await prisma.product.upsert({
        where: { slug: "fresh-red-apple-1kg" },
        update: {},
        create: {
          name: "Fresh Red Apple (1kg)",
          slug: "fresh-red-apple-1kg",
          description: "Premium quality crunchy red apples.",
          price: 4.99,
          discountPrice: 3.99,
          images: JSON.stringify(["https://images.unsplash.com/photo-1560806887-1e4cd0b6fd6c?auto=format&fit=crop&q=80&w=400"]),
          stock: 100,
          categoryId: category.id,
          isFeatured: true,
          isTrending: true,
        },
      });

      await prisma.product.upsert({
        where: { slug: "organic-bananas-1-dozen" },
        update: {},
        create: {
          name: "Organic Bananas (1 Dozen)",
          slug: "organic-bananas-1-dozen",
          description: "Fresh organic yellow bananas.",
          price: 2.99,
          images: JSON.stringify(["https://images.unsplash.com/photo-1571501679680-de32f1e7aad4?auto=format&fit=crop&q=80&w=400"]),
          stock: 150,
          categoryId: category.id,
          isFeatured: false,
          isTrending: true,
        },
      });
    }

    if (cat.slug === "dairy-and-bakery") {
      await prisma.product.upsert({
        where: { slug: "whole-milk-1-gallon" },
        update: {},
        create: {
          name: "Whole Milk (1 Gallon)",
          slug: "whole-milk-1-gallon",
          description: "Farm fresh whole milk from grass-fed cows.",
          price: 5.49,
          images: JSON.stringify(["https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&q=80&w=400"]),
          stock: 50,
          categoryId: category.id,
          isFeatured: true,
        },
      });
    }
  }

  console.log("Database seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
