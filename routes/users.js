var express = require("express");
var router = express.Router();
const passport = require("passport");
const Job = require("../Models/Job");
const Apply = require("../Models/Apply");
const User = require("../Models/Users");
const nodemailer = require("nodemailer");

// Mailing Service
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "akshmistry001998",
    pass: "8669026894"
  }
});

/* GET users listing. */
router.get("/Register", notCandidate, function(req, res, next) {
  const messages = req.flash("error");
  res.render("user/register", {
    title: "Create account | Jobsforyou",
    messages: messages,
    hasErrors: messages.length > 0
  });
});

router.post(
  "/newCandidate",
  passport.authenticate("User-Register", {
    // successRedirect: "/",
    failureRedirect: "/Register",
    failureFlash: true
  }),
  (req, res, next) => {
    const mailOptions = {
      from: "nadimrajpura01@gmail.com",
      to: req.body.email,
      subject: "Register confirmation from jobsforyou",
      text:
        "Hello We Are From Jobsforyou. This is confirmation mail form jobsforyou, You have Recently Registered with your account on jobsforyou"
    };
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Email sent " + info.response);
      }
    });
    res.redirect("/");
  }
);

router.get("/Login", notCandidate, (req, res, next) => {
  const messages = req.flash("error");
  res.render("user/login", {
    title: "Login to your account | Jobsforyou",
    messages: messages,
    hasErrors: messages.length > 0
  });
});

router.post(
  "/Login",
  passport.authenticate("users-login", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
  })
);

router.get("/My-Profile", isCandidate, async (req, res, next) => {
  const user = req.user;
  res.render("user/profile", {
    title: user.email + "User Profile | Jobsforyou",
    user
  });
});

router.get("/about-this-job/:id", isCandidate, async (req, res, next) => {
  const data = await Job.findById({ _id: req.params.id });
  const user = req.user;
  res.render("jobs/jobdetails", { title: "Jobsforyou", user, data });
});

router.get("/apply-to-company/:id", isCandidate, async (req, res, next) => {
  const item = await Job.findById({ _id: req.params.id });
  const user = req.user;
  res.render("jobs/apply", {
    title: "Apply to job | jobsforyou",
    item,
    user
  });
});

router.post("/apply/:id", isCandidate, async (req, res, next) => {
  const jobID = await Job.findById({ _id: req.params.id });
  console.log(jobID);
  const user = req.user;
  const newApply = new Apply({
    userId: user.id,
    jobId: jobID.id,
    companyId: jobID.companyId,
    fullname: req.body.name,
    contact: req.body.contact,
    education: req.body.education,
    course: req.body.course,
    speacilization: req.body.speacilization,
    universityName: req.body.university,
    passOutYear: req.body.year,
    resume: req.body.productImageUrl
  });
  newApply
    .save()
    .then(data => {
      // console.log(data);
      res.redirect("/myApplied");
    })
    .catch(err => {
      console.log(err);
    });
});

router.get("/myApplied", isCandidate, async (req, res, next) => {
  const user = req.user;
  const myjobs = await Apply.find({ userId: user.id })
    .populate("jobId")
    .populate("companyId", `email`);
  // console.log(myjobs);
  res.render("user/appliedjobs", {
    title: user.email + " Applied",
    data: myjobs,
    length: myjobs.length,
    user
  });
});

router.post("/delete-job-application/:id", async (req, res, next) => {
  await Apply.findByIdAndRemove({ _id: req.params.id }, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      // console.log(data);
      res.redirect("/myApplied");
    }
  });
});

router.get("/logout", (req, res, next) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;

function isCandidate(req, res, next) {
  if (req.isAuthenticated() && req.user.isCandidate == true) {
    return next();
  } else {
    res.redirect("/login");
  }
}

function notCandidate(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  if (req.user.isCandidate == false) {
    return res.redirect("/");
  }
  res.redirect("/");
}
