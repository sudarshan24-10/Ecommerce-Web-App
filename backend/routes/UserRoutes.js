import express from "express";
import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import User from "../Models/UserModel.js";
import mailgun from "mailgun-js";
import jwt from "jsonwebtoken";
import { isAuth, generateToken } from "../utils.js";
const UserRouter = express.Router();

UserRouter.post(
  "/signin",
  expressAsyncHandler(async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          res.send({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user),
          });
          return;
        }
      }
      res.status(401).send({ message: "Invalid Email or Password" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  })
);

UserRouter.post(
  "/forget-password",
  expressAsyncHandler(async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });

      if (user) {
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "3h",
        });
        user.resetToken = token;
        await user.save();

        console.log(`${process.env.BASE_URL}/reset-password/${token}`);
        const mg = mailgun({
          apiKey: process.env.MAILGUN_API_KEY,
          domain: process.env.MAILGUN_DOMAIN,
        });

        const data = {
          from: " MyEcommerceApp <gampasudarshananil@gmail.com>",
          to: `${user.name} <${user.email}>`,
          subject: "Reset Password",
          html: `<p>Please check the following link to reset your password</p>
        <a href="${process.env.BASE_URL}/reset-password/${token}}">reset password</a>`,
        };

        mg.messages().send(data, (error, body) => {
          if (error) {
            console.error(error);
          } else {
            console.log(body);
          }
        });
        res.send({ message: "we have sent reset link to your email address" });
      } else {
        res.status(400).send({ message: "user not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  })
);

UserRouter.post(
  "/reset-password",
  expressAsyncHandler(async (req, res) => {
    console.log(req.body.token);
    const token = req.body.token.substring(0, req.body.token.length - 1);
    try {
      jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
        if (err) {
          res.status(401).send({ message: "Invalid token" });
        } else {
          const user = await User.findOne({ resetToken: token });
          if (user) {
            if (req.body.password) {
              user.password = bcrypt.hashSync(req.body.password, 8);
              await user.save();
              res.send({ message: "Password reset Successful" });
            } else {
              res.status(404).send({ message: "user not found" });
            }
          }
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  })
);

UserRouter.post(
  "/signup",
  expressAsyncHandler(async (req, res) => {
    try {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password),
      });
      const user = await newUser.save();
      res.send({
        _id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user),
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  })
);

UserRouter.put(
  "/profile",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password) {
          user.password = bcrypt.hashSync(req.body.password, 8);
        }

        const updatedUser = await user.save();
        res.send({
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          isAdmin: updatedUser.isAdmin,
          token: generateToken(updatedUser),
        });
      } else {
        res.status(404).send({ message: "User not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  })
);

export default UserRouter;
