import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


const app = express();

app.listen(5000,()=>{
    console.log("server is running");
})