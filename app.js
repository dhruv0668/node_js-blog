import dotenv from  'dotenv';
dotenv.config();
// import multer from 'multer';
import cors from 'cors';
import express from 'express';
import connectDB from './config/connectdb.js';
import userRoutes from "./routes/userRoutes.js"

const app = express();
const port = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;

// cors policy
app.use(cors());

// database connection
connectDB(DATABASE_URL);

// json
app.use(express.json());

// load routes
app.use("/api/user", userRoutes);

//get product

// app.get("/product", async (req,res) => {
//     let products = await productModel.find();
//     if(products){
//         res.send(products)
//     }else{
//         res.send("product not found")
//     }
// })



app.listen(port , () => {
    console.log(`app is working on port ${port}`)
})

