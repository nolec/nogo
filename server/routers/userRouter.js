import express from "express";
import { check, validationResult } from "express-validator";
import User from "../models/User";
import gravatar from "gravatar";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authMiddleware from "../middlewares/auth";
import Profile from "../models/Profile";

const userRouter = express.Router();
userRouter.get("/auth", authMiddleware, async (req, res) => {
  try {
    console.log(req.user, "auth");
    const user = await User.findById(req.user).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});
userRouter.post(
  "/register",
  [
    check("name", "이름을 입력해주세요")
      .not()
      .isEmpty(),
    check("email", "이메일을 제대로 입력해주세요").isEmail(),
    check("password", "최소 6자 이상을 입력해주세요").isLength({ min: 6 })
  ],
  async (req, res) => {
    let errors = validationResult(req);
    console.log(errors);
    //--------------------------------------------------------
    //유효값 검사
    if (errors.errors.length > 0) {
      return res.status(400).json({ Errors: errors.array() });
    }
    try {
      const { name, email, password } = req.body;
      //--------------------------------------------------------
      //등록된 계정 확인
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ Errors: [{ msg: "이미 등록된 계정입니다." }] });
      }
      //--------------------------------------------------------
      //사진 생성
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm"
      });
      //--------------------------------------------------------
      //유저 생성
      user = new User({ name, email, password, avatar });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      //--------------------------------------------------------
      //유저 생성 후 토큰 생성하면서 로그인하기
      await jwt.sign(
        { signId: user._id },
        "secret",
        { expiresIn: 36000 },
        (err, token) => {
          if (err) res.status(500).json({ msg: "등록 실패" });
          res.status(200).json({ user, token, success: "등록 성공" });
        }
      );
      await user.save();
    } catch (error) {
      console.log(error);
      res.status(500).json("Server Error");
    }
  }
);
userRouter.post(
  "/login",
  [
    check("email", "이메일을 제대로 입력해주세요").isEmail(),
    check("password", "비밀번호를 입력해주세요")
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    let errors = validationResult(req);
    console.log(errors);
    //--------------------------------------------------------
    //유효값 검사
    if (!errors.isEmpty()) {
      return res.status(400).json({ Errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      //--------------------------------------------------------
      //등록된 계정 확인
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ Errors: [{ msg: "등록된 이메일이 없습니다." }] });
      }
      //--------------------------------------------------------
      //비밀번호 비교
      const isMatch = bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ Errors: [{ msg: "비밀번호가 틀렸습니다." }] });
      }
      //--------------------------------------------------------
      //성공 시 토큰 생성
      await jwt.sign(
        { signId: user._id },
        "secret",
        { expiresIn: 36000 },
        (err, token) => {
          if (err) res.status(500).json({ msg: "로그인 실패!" });
          res.status(200).json({ user, token, success: "로그인 성공" });
        }
      );
    } catch (error) {
      console.log(error);
      res.status(500).json("Server Error");
    }
  }
);
userRouter.delete("/delete", authMiddleware, async (req, res) => {
  try {
    await User.findOneAndRemove({ _id: req.user });
    await Profile.findOneAndRemove({ user: req.user });
    res.status(200).json({ msg: "회원을 탈퇴하였습니다." });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error :delete");
  }
});
export default userRouter;
