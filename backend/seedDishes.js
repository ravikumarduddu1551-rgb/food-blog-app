const mongoose = require("mongoose");
require("dotenv").config();

const defaultDishes = [
  {
    title: "Chicken Biryani",
    time: "45 mins",
    coverImage: "Chicken-Biryani.jpg",
    ingredients: [
      "Basmati Rice",
      "Chicken",
      "Biryani Masala",
      "Yogurt",
      "Fried Onions",
      "Saffron Milk",
      "Mint Leaves",
      "Ghee"
    ],
    instructions:
      "Marinate chicken with yogurt and biryani spices for 30 minutes. Parboil fragrant basmati rice with whole spices. Layer marinated chicken and parboiled rice, drizzle with saffron milk, ghee, and fried onions. Seal the pot and cook on low heat (dum) for 25 minutes."
  },
  {
    title: "Butter Chicken",
    time: "35 mins",
    coverImage: "butter-chicken.webp",
    ingredients: [
      "Boneless Chicken",
      "Butter",
      "Tomato Puree",
      "Fresh Cream",
      "Garam Masala",
      "Ginger Garlic Paste",
      "Kasuri Methi"
    ],
    instructions:
      "Marinate and lightly sear chicken cubes until golden. Prepare a rich gravy with tomato puree, aromatic spices, and butter. Add fresh cream and kasuri methi, gently simmer chicken in the velvety sauce until tender and fragrant."
  },
  {
    title: "Butter Naan",
    time: "20 mins",
    coverImage: "butter-naan.jpg",
    ingredients: [
      "All-Purpose Flour",
      "Yogurt",
      "Baking Powder",
      "Warm Milk",
      "Melted Butter",
      "Nigella Seeds",
      "Coriander"
    ],
    instructions:
      "Knead soft dough using flour, yogurt, and warm milk. Rest for 45 minutes. Roll into teardrop flatbreads, top with nigella seeds and chopped coriander. Cook on a hot tawa until bubbly and charred, then brush generously with melted butter."
  },
  {
    title: "Mutton Biryani",
    time: "60 mins",
    coverImage: "mutton-biryani.jpg",
    ingredients: [
      "Tender Mutton",
      "Basmati Rice",
      "Crispy Onions",
      "Kewra Water",
      "Yogurt",
      "Whole Spices",
      "Mint & Cilantro"
    ],
    instructions:
      "Marinate tender mutton cuts with curd, spices, and fried onions. Slow-cook mutton until juicy and tender. Layer with aged basmati rice, sprinkle kewra water and mint. Dum-cook on slow flame for 30 minutes for an authentic royal aroma."
  },
  {
    title: "Prawns Biryani",
    time: "30 mins",
    coverImage: "prawns-biryani.jpg",
    ingredients: [
      "Fresh Prawns",
      "Basmati Rice",
      "Coconut Milk",
      "Turmeric",
      "Green Chilies",
      "Biryani Spices",
      "Lemon Juice"
    ],
    instructions:
      "Clean and marinate fresh prawns with turmeric, chili, and lemon juice. Cook briefly with spiced onion-tomato masala and coconut milk. Layer with fragrant basmati rice and fresh herbs, steam on gentle heat for 10 minutes."
  }
];

async function seed() {
  await mongoose.connect(process.env.CONNECTION_STRING);
  console.log("Connected to MongoDB");

  const user = await mongoose.connection.db.collection("users").findOne({});
  const userId = user ? user._id : new mongoose.Types.ObjectId();

  for (const dish of defaultDishes) {
    await mongoose.connection.db.collection("recipes").updateOne(
      { title: dish.title },
      {
        $set: {
          ...dish,
          createdBy: userId,
          updatedAt: new Date()
        },
        $setOnInsert: {
          createdAt: new Date()
        }
      },
      { upsert: true }
    );
    console.log(`Seeded: ${dish.title}`);
  }

  console.log("All default dishes successfully added to MongoDB!");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Failed to seed:", err);
  process.exit(1);
});
