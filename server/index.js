import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import helmet from 'helmet'
import connectDB from './config/connectDB.js'
import userRouter from './route/user.route.js'
import categoryRouter from './route/category.route.js'
import uploadRouter from './route/upload.router.js'
import subCategoryRouter from './route/subCategory.route.js'
import productRouter from './route/product.route.js'
import cartRouter from './route/cart.route.js'
import addressRouter from './route/address.route.js'
import orderRouter from './route/order.route.js'

// <<< 1. IMPORT THE WEBHOOK CONTROLLER >>>
// Make sure the path to your order controller file is correct
import { webhookStripe } from './controllers/order.controller.js' 

const app = express()

app.use(express.urlencoded({ extended: true }));
app.use(cors({
    credentials : true,
    origin : process.env.FRONTEND_URL
}))

// <<< 2. ADD THE STRIPE WEBHOOK ROUTE HERE >>>
// This route uses express.raw() to get the body as a buffer, which Stripe needs.
// It MUST come BEFORE app.use(express.json())
app.post(
    '/api/order/webhook', 
    express.raw({ type: 'application/json' }), 
    webhookStripe
);

// This will parse the body for all OTHER routes as JSON
app.use(express.json()) 

app.use(cookieParser())
app.use(morgan())
app.use(helmet({
    crossOriginResourcePolicy : false
}))
const PORT = process.env.PORT || 8080;

app.get("/",(req,res)=>{
    ///server to client
    res.json({
        message : "Server is running " + PORT
    })
})

app.use('/api/user',userRouter)
app.use("/api/category",categoryRouter)
app.use("/api/file",uploadRouter)
app.use("/api/subcategory",subCategoryRouter)
app.use("/api/product",productRouter)
app.use("/api/cart",cartRouter)
app.use("/api/address",addressRouter)
app.use('/api/order',orderRouter)

connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log("Server is running",PORT)
    })
})