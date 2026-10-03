import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import Category from './models/Category.js';
import Setting from './models/Setting.js';

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log('MongoDB Connected');
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const DUMMY_LOREM = "A Chettinad-inspired temple necklace hand-finished in our Chennai atelier. Antique oxidised detailing frames a hand-set centrepiece.";

const PRODUCTS = [
  { slug: "meenakshi-temple-necklace", name: "Meenakshi Temple Necklace", category: "necklaces", price: 8450, tags: ["bestseller", "bridal"], description: DUMMY_LOREM },
  { slug: "kanmani-oxidised-jhumkas", name: "Kanmani Oxidised Jhumkas", category: "earrings", price: 3290, tags: ["bestseller", "everyday"], description: DUMMY_LOREM },
  { slug: "kaveri-stacked-bangles", name: "Kaveri Stacked Bangles", category: "bangles", price: 6750, tags: ["bestseller", "everyday"], description: DUMMY_LOREM },
  { slug: "sitara-solitaire-ring", name: "Sitara Solitaire Ring", category: "rings", price: 4150, tags: ["new", "bridal"], description: DUMMY_LOREM },
  { slug: "kolusu-bell-anklet", name: "Kolusu Bell Anklet", category: "anklets", price: 2890, tags: ["new", "everyday"], description: DUMMY_LOREM },
  { slug: "chinnamma-baby-bracelet", name: "Chinnamma Baby Bracelet", category: "kids", price: 1990, tags: ["new", "kids"], description: DUMMY_LOREM },
  { slug: "aarava-geometric-pendant", name: "Aarava Geometric Pendant", category: "necklaces", price: 3450, tags: ["new", "everyday"], description: DUMMY_LOREM },
  { slug: "mira-everyday-studs", name: "Mira Everyday Studs", category: "earrings", price: 1450, tags: ["bestseller", "everyday"], description: DUMMY_LOREM },
  { slug: "vaanam-bridal-set", name: "Vaanam Bridal Set", category: "necklaces", price: 18900, tags: ["bridal", "bestseller"], description: DUMMY_LOREM },
  { slug: "nila-hoop-trio", name: "Nila Hoop Trio", category: "earrings", price: 2450, tags: ["new", "everyday"], description: DUMMY_LOREM },
  { slug: "ponni-slim-bangle", name: "Ponni Slim Bangle", category: "bangles", price: 2990, tags: ["everyday"], description: DUMMY_LOREM },
  { slug: "thangam-kids-anklet", name: "Thangam Kids Anklet", category: "kids", price: 2290, tags: ["kids", "new"], description: DUMMY_LOREM }
];

const importData = async () => {
    try {
        await connectDB();

        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();
        await Category.deleteMany();
        await Setting.deleteMany();

        const salt = await bcrypt.genSalt(10);
        const adminPassword = await bcrypt.hash('admin123', salt);

        await User.insertMany([{
            name: 'Admin User',
            email: 'vedhavsilvers@gmail.com',
            password: adminPassword,
            isAdmin: true
        }]);

        const formattedProducts = PRODUCTS.map(p => ({
            name: p.name,
            slug: p.slug,
            description: p.description,
            price: p.price,
            category: p.category,
            stock: 20, 
            image: `/assets/p-${p.category === 'necklaces' ? 'necklace' : p.category === 'earrings' ? 'earrings' : 'ring'}.jpg`,
            isFeatured: p.tags?.includes('bestseller') || false
        }));

        await Product.insertMany(formattedProducts);
        
        const categories = [
          { slug: "necklaces", name: "Necklaces", blurb: "Temple & contemporary", image: "/assets/p-necklace.jpg" },
          { slug: "earrings", name: "Earrings", blurb: "Jhumkas to studs", image: "/assets/p-earrings.jpg" },
          { slug: "bangles", name: "Bangles", blurb: "Stacked silhouettes", image: "/assets/p-bangles.jpg" },
          { slug: "rings", name: "Rings", blurb: "Solitaire & bands", image: "/assets/p-ring.jpg" },
          { slug: "anklets", name: "Anklets", blurb: "Payal & kolusu", image: "/assets/p-anklet.jpg" },
          { slug: "kids", name: "Kids", blurb: "Gentle first silver", image: "/assets/p-kids.jpg" }
        ];
        
        await Category.insertMany(categories);
        
        await Setting.create({
          key: "hero",
          value: {
            title: "Silver that carries her story",
            subtitle: "Hallmarked 925 sterling silver for women and little ones — temple heirlooms, everyday minimals and first kolusus, hand-finished by our artisans.",
            image: "/assets/hero.jpg",
          }
        });

        console.log('Data Imported successfully! Added all products, categories, and settings from original catalog.');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
