var express = require("express");
var router = express.Router();
const User = require("../Models/Users");
const Job = require("../Models/Job");
const Subscriber = require("../Models/Subscriber");

/* GET home page. */
router.get("/", async (req, res, next) => {
  const user = req.user;
  const jobs = await Job.find().sort({ _id: -1 });
  // const countJob = await Job.find({ companyId: req.user.id });
  // console.log(countJob);
  res.render("index", {
    title: "jobsforyou | Homepage",
    user,
    jobs,
    joblength: jobs.length
  });
});

router.post("/subscribe", async (req, res, next) => {
  const subscriber = await new Subscriber({
    email: req.body.email
  });
  subscriber.save((err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});

module.exports = router;

function isRecruiter(req, res, next) {
  if (req.isAuthenticated() && req.user.isRecruiter == true) {
    return next();
  } else {
    res.redirect("/imrecruiter");
  }
}

function notRecruiter(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  if (req.user.isRecruiter == false) {
    res.redirect("/");
  }
  res.redirect("/dashboard");
}

function isCandidate(req, res, next) {
  if (req.isAuthenticated() && req.user.isCandidate == true) {
    return next();
  } else {
    res.redirect("/register");
  }
}

function NotCandidate(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  if (req.user.isCandidate == false) {
    return res.redirect("/");
  }
  res.redirect("/dashboard");
}
