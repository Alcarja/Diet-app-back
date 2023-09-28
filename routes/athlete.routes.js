const Athlete = require("../models/Athlete.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { isAuthenticated } = require("../middlewares/jwt.middleware");

const router = require("express").Router();

router.post("/signup", async (req, res) => {
  const payload = req.body; // { email: 'someEmail', password '1234'}

  const salt = bcrypt.genSaltSync(13);
  const passwordHash = bcrypt.hashSync(payload.password, salt);

  try {
    await Athlete.create({
      name: payload.name,
      surname: payload.surname,
      email: payload.email,
      age: payload.age,
      height: payload.height,
      weight: payload.weight,
      gender: payload.gender,
      pActivity: payload.pActivity,
      dailyIntake: payload.dailyIntake,
      password: passwordHash,
    });
    res.status(201).json({ message: "User created" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.post("/login", async (req, res) => {
  const payload = req.body; // { email: 'someEmail', password '1234'}
  /* Check if the user exists */
  const potentialUser = await Athlete.findOne({ email: payload.email });
  if (potentialUser) {
    const doPasswordsMatch = bcrypt.compareSync(
      payload.password,
      potentialUser.password
    );
    /* Check if the password is correct */
    if (doPasswordsMatch) {
      /* Sign the JWT */
      //this jwt.sign method is what actually creates the token for us.
      const authToken = jwt.sign(
        { userId: potentialUser._id },
        process.env.TOKEN_SECRET,
        {
          algorithm: "HS256",
          expiresIn: "6h",
        }
      );
      // Sending back the token to the front and you can send more data if you want.
      res.status(202).json({
        potentialUser,
        token: authToken,
        SomeData: "something cool",
        Hameds: "blah",
      });
    } else {
      /* Incorrect password */
      res.status(403).json({ errorMessage: "Password invalid" });
    }
  } else {
    /* No user found */
    res.status(403).json({ errorMessage: "No user found" });
  }
});

router.get("/verify", isAuthenticated, async (req, res) => {
  console.log(req.payload); //req.payload is a property from our JWT.middleware.js. We can change its name by changing the value of "requestPropery" (line 7)
  const currentUser = await Athlete.findById(req.payload.userId);
  currentUser.password = "****"; //We don't send the password to the front, so we send the stars
  res.status(200).json({ message: "Token is valid", currentUser });
  //This route is going to use the middleware isAuthenticated, which uses the JWT token to check if the user is already logged in
});

router.get("/:userId", async (req, res) => {
  try {
    const oneUser = await Athlete.findById(req.params.userId);
    res.status(200).json(oneUser);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.put("/:userId", async (req, res) => {
  try {
    const payload = req.body;
    const updatedUser = await Athlete.findByIdAndUpdate(
      req.params.userId, // Use :userId to match the route parameter
      payload,
      { new: true }
    );
    res.status(202).json(updatedUser);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
