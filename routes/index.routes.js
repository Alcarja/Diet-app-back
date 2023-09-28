const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

const athleteRoutes = require("./athlete.routes");
router.use("/athlete", athleteRoutes);

module.exports = router;
