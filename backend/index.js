import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routers/user.route.js";

dotenv.config({});


const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({extended: true}))

const corsOption = {
    origin: "http://localhost:5173",
    credentials: true,
}
app.use(cors(corsOption))

app.use('/api/v1/user', userRoute)


app.get("/",(req, res)=>{
    return res.status(200).json({message:"hello, server is running", success: true})
})

const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    connectDB()
    console.log(`Server is running in port ${PORT}`);
});