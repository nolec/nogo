import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
//====================================================
import "./db";
import userRouter from "./routers/userRouter";
import profileRouter from "./routers/profileRouter";
import postRouter from "./routers/postRouter";

//====================================================
const app = express();
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//====================================================
if (process.env.NODE_ENV === "production") {
  //Set static folder
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
//====================================================
app.use("/api/users", userRouter);
app.use("/api/profile", profileRouter);
app.use("/api/post", postRouter);
//====================================================

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server Running at ${port}`);
});
