import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.MONGODB_URI!).then(async () => {
    try {
        const db = mongoose.connection.db;
        const products = await db?.collection("products").find({}).toArray();
        if (products) {
            for (const p of products) {
                if (!p.slug) {
                    const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now().toString().slice(-4);
                    await db.collection("products").updateOne({ _id: p._id }, { $set: { slug, tags: [] } });
                }
            }
        }
        
        // Re-apply indexes to ensure unique slug works cleanly
        await db?.collection("products").dropIndexes().catch(()=>console.log("no indexes"));
        console.log("Fixed missing slugs and tags!");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}).catch(console.error);
