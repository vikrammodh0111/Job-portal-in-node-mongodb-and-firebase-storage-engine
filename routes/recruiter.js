const router = require("express").Router();
const passport = require("passport");
const Job = require("../Models/Job");
const Apply = require("../Models/Apply");
const nodemailer = require("nodemailer");

// Mailing Service
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "akshmistry001998",
    pass: "8669026894"
  }
});

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
    failureRedirect: "/imrecruiter",
    passReqToCallback: true
  }),
  (req, res, next) => {
    const mailOptions = {
      from: "nadimrajpura01@gmail.com",
      to: req.body.email,
      subject: "Register confirmation from jobsforyou",
      text:
        "Hello We Are From Jobsforyou. This is confirmation mail form jobsforyou, You have successfully Registered with your Company on jobsforyou, now you can post jobs on website in just two steps and get the best candidates from their given information..." +
        "There is Some basics steps for uploading a new jobs :- " +
        "Step 1 : http://localhost:3000/upload-new-job" +
        "Step 2 : Fill the details and click on upload button" +
        "Step 3 : Now you have been redirected to myUploaded page, Here you can perform the delete and upload tasks." +
        "Welcome to the jobs for you...."
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
    title: "User Profile | Jobsforyou",
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

router.get("/update-job-details/:id", isRecruiter, async (req, res, next) => {
  const data = await Job.updateOne(
    { _id: req.params.postId },
    {
      $set: {
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
      }
    },
    (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/MyUplaoded");
      }
    }
  );
});

router.get("/Application-received", isRecruiter, async (req, res, next) => {
  const user = req.user;
  const AppliedJobDetails = await Apply.find({ companyId: req.user.id });
  // console.log(user._id);
  // console.log(AppliedJobDetails);
  res.render("recruiter/resumeReceived", {
    title: "Jobforyou",
    user,
    jobs: AppliedJobDetails,
    length: AppliedJobDetails.length
  });
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
    return res.redirect("/");
  }
  res.redirect("/");
}
