const router = require("express").Router();
const passport = require("passport");
const Job = require("../Models/Job");

router.get("/imrecruiter", notRecruiter, (req, res, next) => {
  const messages = req.flash("error");
  res.render("recruiter/register", {
    title: "Hello i m Recruiter Create account for me | Jobsforyou",
    messages: messages,
    hasErrors: messages.length > 0
  });
});

router.post(
  "/newRecruiter",
  passport.authenticate("recriuter", {
    successRedirect: "/",
    failureRedirect: "/imrecruiter",
    passReqToCallback: true
  })
);

router.post(
  "/Login",
  passport.authenticate("users-login", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
  })
);

router.get("/RecruiterProfile", isRecruiter, async (req, res, next) => {
  const user = req.user;
  res.render("Recruiter/profile", {
    title: "My Profile",
    user
  });
});

router.get("/myJobs", isRecruiter, (req, res, next) => {
  res.render("recruiter/Postanewjob", { title: "Job Listing | Jobsforyou" });
});

router.get("/upload-new-job", isRecruiter, (req, res, next) => {
  const user = req.user;
  res.render("recruiter/Postanewjob", { title: "Upload a new Job", user });
});

router.post("/postJob", isRecruiter, async (req, res, next) => {
  const newJobUpload = await new Job({
    jobTitle: req.body.jobTitle,
    numberOfAvaliableVacancy: req.body.vacancy,
    salaryStart: req.body.salary,
    companyName: req.body.companyName,
    description: req.body.description,
    jobType: req.body.jobType,
    skill: req.body.skills,
    jobLocation: req.body.location,
    companyId: req.user.id,
    minimumExperience: req.body.exp
  });
  try {
    const savedPost = await newJobUpload.save();
    res.redirect("/MyUplaoded");
  } catch (err) {
    res.json(err);
  }
});

router.get("/MyUplaoded", isRecruiter, async (req, res, next) => {
  const user = req.user;
  const job = await Job.find({ companyId: user._id });
  res.render("recruiter/MyUploaded", {
    title: "All Your Listed Jobs",
    user,
    job,
    length: job.length
  });
});

router.post("/delete-job/:id", isRecruiter, async (req, res, next) => {
  const deleteJob = await Job.findOneAndDelete(
    { _id: req.params.id },
    (err, data) => {
      console.log(data);
      res.redirect("/MyUplaoded");
    }
  );
});

router.post("/updateProfile", isRecruiter, async (req, res, next) => {
  const User = require("../../Models/Users");
  Post.updateOne(
    { _id: req.params.postId },
    { $set: { email: req.body.email } },
    (err, data) => {
      if (err) {
        res.render(err);
      } else {
        return res.redirect("/RecruiterProfile");
      }
    }
  );
});

router.get("/logout", isRecruiter, (req, res, next) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;

function isRecruiter(req, res, next) {
  if (req.isAuthenticated() && req.user.isRecruiter == true) {
    return next();
  } else {
    res.redirect("/login");
  }
}

function notRecruiter(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  if (req.user.isRecruiter == false) {
    return res.redirect("/dashboard");
  }
  res.redirect("/");
}
