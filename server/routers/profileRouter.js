import express from "express";
import request from "request";
import { github } from "../config/dev";
import { check, validationResult } from "express-validator";
import Profile from "../models/Profile";
import auth from "../middlewares/auth";

const profileRouter = express.Router();

profileRouter.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user");
    res.json(profiles);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});
profileRouter.get("/me", auth, async (req, res) => {
  try {
    console.log(req.user, "myprofile");
    const myProfile = await Profile.findOne({ user: req.user }).populate(
      "user",
      ["name", "avatar"]
    );
    if (!myProfile) {
      return res.status(400).json({ message: "프로필이 없습니다." });
    }
    res.status(200).json(myProfile);
  } catch (error) {
    console.log(error);
    res.status(500).json("Server Error in ME");
  }
});
profileRouter.get("/:user_id", async (req, res) => {
  try {
    const userProfile = await Profile.findOne({
      user: req.params.user_id
    }).populate("user", ["name", "avatar"]);
    if (!userProfile) {
      return res.status(400).json({ message: "프로필이 없습니다." });
    }
    res.status(200).json(userProfile);
  } catch (error) {
    console.log(error);
    res.status(500).json("Server Error in USER_ID");
  }
});
profileRouter.post(
  "/cu",
  [
    auth,
    [
      check("status", "상태가 필요합니다.")
        .not()
        .isEmpty(),
      check("skills", "스킬이 필요합니다.")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    console.log(errors.array());
    if (!errors.isEmpty()) {
      res.status(400).json({ Errors: errors.array() });
    }
    const {
      company,
      website,
      location,
      bio,
      status,
      skills,
      githubusername,
      youtube
    } = req.body;
    //Build profile object
    const profileFields = {};
    profileFields.user = req.user;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.lcoation = lcoation;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(",").map(skill => skill.trim());
    }
    //Build social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    try {
      let profile = await Profile.findById(req.user);
      if (profile) {
        profile = await Profile.findByIdAndUpdate(
          { user: req.user },
          { $set: profileFields },
          { new: true }
        );
        return res.status(200).json(profile);
      }
      profile = await new Profile(profileFields);
      await profile.save();
      return res.status(200).json(profile);
    } catch (error) {
      console.log(error);
      res.status(500).json("Server Error--profile");
    }
  }
);
profileRouter.put(
  "/experience",
  [
    auth,
    [
      check("title", "제목이 필요합니다.")
        .not()
        .isEmpty(),
      check("company", "회사가 필요합니다.")
        .not()
        .isEmpty(),
      check("from", "날짜가 필요합니다.")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body;
    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    };
    try {
      const profile = await Profile.findOne({ user: req.user });

      profile.experience.unshift(newExp);

      await profile.save();

      res.status(200).json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).json("Server Error--experience");
    }
  }
);
profileRouter.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user });

    const removeIndex = profile.experience
      .map(item => item.id)
      .indexOf(req.params.exp_id);
    if (removeIndex === -1) {
      return res.status(500).json({ msg: "Server error" });
    } else {
      profile.experience.splice(removeIndex, 1);
      await profile.save();
      res.status(200).json(profile);
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server Error--experience-delete");
  }
});
profileRouter.put(
  "/education",
  [
    auth,
    [
      check("school", "학교가 필요합니다.")
        .not()
        .isEmpty(),
      check("degree", "학년이 필요합니다.")
        .not()
        .isEmpty(),
      check("fieldofstudy", "학과가 필요합니다.")
        .not()
        .isEmpty(),
      check("from", "날짜가 필요합니다.")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    } = req.body;

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    };

    try {
      const profile = await Profile.findOne({ user: req.user });

      profile.education.unshift(newEdu);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);
profileRouter.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user });

    const removeIndex = profile.education
      .map(item => item.id)
      .indexOf(req.params.exp_id);
    if (removeIndex === -1) {
      return res.status(500).json({ msg: "Server error" });
    } else {
      profile.education.splice(removeIndex, 1);
      await profile.save();
      res.status(200).json(profile);
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server Error--education-delete");
  }
});
profileRouter.get("/github/:username", (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${github.clientId}&client_secret=${github.secret}`,
      method: "GET",
      headers: { "user-agent": "node.js" }
    };
    request(options, (err, response, body) => {
      if (err) console.error(error);

      if (response.statusCode !== 200) {
        return res.status(404).json({ msg: "Github 프로필이 없습니다." });
      }
      res.json(JSON.parse(body));
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server Error--github");
  }
});
export default profileRouter;
