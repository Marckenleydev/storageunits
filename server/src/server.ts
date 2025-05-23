import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import bodyParser from "body-parser";
import unitRoute from "./routes/units"
import bookingRoute from    "./routes/bookings"
// Configuration
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Routes
app.get("/",  (req, res) => {
  res.send("Hello welcome to the StorageBooking API");
});

app.use("/units", unitRoute);
app.use("/", bookingRoute);

const PORT = Number(process.env.PORT)  || 3003;
app.listen(PORT,"0.0.0.0", () => {

  console.log(`Server is running on port ${PORT}`);

});