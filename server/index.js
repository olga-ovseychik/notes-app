import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "./loadEnvironment.js";
import "express-async-errors";
import db from "./db/conn.js";
import auth from "./routes/authRoutes.js";
import notes from "./routes/noteRoutes.js";
import users from './routes/usersRoutes.js';
import filters from "./routes/filterRoutes.js";

const PORT = process.env.PORT || 5000;
const app = express();

const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/auth", auth);
app.use("/notes", notes);
app.use("/users", users);
app.use("/filters", filters);

app.use((err, _req, res, next) => {
    res.status(500).send('Unexpected error occurs.');
});

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
});