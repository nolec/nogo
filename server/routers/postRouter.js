import express from "express";
import { check, validationResult } from "express-validator";
import User from "../models/User";
import auth from "../middlewares/auth";
import Post from "../models/Post";

const postRouter = express.Router();

postRouter.post(
  "/",
  [
    auth,
    [
      check("text", "내용이 필요합니다.")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ Errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user).select("-password");

      const newPost = await new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user
      });
      const post = await newPost.save();
      res.status(200).json(post);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);
postRouter.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});
postRouter.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "포스트를 찾을 수 없습니다." });
    }
    res.json(post);
  } catch (error) {
    console.log(error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "포스트를 찾을 수 없습니다." });
    }
    res.status(500).send("Server Error");
  }
});
postRouter.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: "포스트를 찾을 수 없습니다." });
    }
    //Check user
    if (post.user.toString() !== req.user) {
      return res.status(401).json({ msg: "인증된 유저가 아닙니다." });
    }
    await post.remove();

    res.json({ msg: "포스트가 삭제되었습니다." });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "포스트를 찾을 수 없습니다." });
    }
    res.status(500).send("Server Error");
  }
});
postRouter.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //Check if the post has already been liked
    if (
      post.likes.filter(like => like.user.toString() === req.user).length > 0
    ) {
      return res.status(400).json({ msg: " 이미 좋아요를 눌렀습니다." });
    }
    post.likes.unshift({ user: req.user });

    await post.save();
    res.json(post.likes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});
postRouter.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //Check if the post has already been liked
    if (
      post.likes.filter(like => like.user.toString() === req.user).length === 0
    ) {
      return res.status(400).json({ msg: " 아직 좋아요를 누르지 않았습니다." });
    }

    //Get remove index
    const removeIndex = post.likes
      .map(like => like.user.toString())
      .indexOf(req.user);
    post.likes.splice(removeIndex, 1);

    await post.save();
    res.json(post.likes);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "포스트를 찾을 수 없습니다." });
    }
    res.status(500).send("Server Error");
  }
});
//===================
postRouter.post(
  "/comment/:id",
  [
    auth,
    [
      check("text", "내용이 필요합니다.")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    console.log("어디부터인가요~");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ Errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user).select("-password");
      const post = await Post.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user
      };
      post.comments.unshift(newComment);
      await post.save();

      res.status(200).json(post.comments);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);
postRouter.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //pull out comment
    const comment = await post.comments.find(
      comment => comment._id.toString() === req.params.comment_id
    );

    //Make sure comment exists
    if (!comment) {
      return res.status(404).json({ msg: "댓글이 존재하지 않습니다." });
    }

    //Check user

    if (comment.user.toString() !== req.user) {
      return res.status(401).json({ msg: "인증되지 않은 유저입니다." });
    }
    const removeIndex = post.comments
      .map(comment => comment.user)
      .indexOf(req.user);
    console.log(removeIndex);
    post.comments.splice(removeIndex, 1);

    await post.save();

    res.status(200).json(post.comments);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});
export default postRouter;
