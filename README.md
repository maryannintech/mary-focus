# 🐇 mary.focus

> **A personal AI-powered Pomodoro app built to help me stay focused and spend less time on my phone.**

🔗 **Live Demo:** https://mary-focus.vercel.app/

---

## ✦ About

**mary.focus** is a personal Pomodoro and focus-tracking web application that uses **image classification** to detect when I am using my phone during a focus session.

The idea came from a very real problem I have: **once I pick up my phone, I can get distracted incredibly easily.** I might check one thing, open another app, and suddenly realize that much more time has passed than I intended.

So instead of trying to build another generic productivity app, I decided to build one **for myself** — something that could help me become more aware of when I was losing focus.

During a focus session, the app uses my webcam and a custom-trained model to recognize whether I am in my expected focus state or using my phone. If I stay distracted, the app gives me a reminder to get back to what I was working on.

---

## ✦ Why I Made This

I made **mary.focus** because I wanted to solve a problem that I personally experience while studying.

I'm the kind of person who can sit down intending to study for 25 minutes, pick up my phone for "just a second," and then completely lose track of time 😭

I wanted to create something that wouldn't just tell me how long I had been studying, but would also help me **notice my distractions**.

The project also gave me an opportunity to combine two areas I'm currently interested in:

* 🌐 **Web Development**
* 🧠 **Deep Learning**

I'm currently learning deep learning, and while taking a modern AI course, I came across **Google's Teachable Machine**. I was fascinated by how accessible it made machine learning experimentation, especially for someone who is still a beginner in deep learning

Teachable Machine allowed me to train an image classification model using examples from my own webcam and export it for use in a web application

That made me realize I could take something I'm already comfortable with — **building web applications** — and connect it with something I'm still learning — **machine learning and image classification**

And that's how **mary.focus** started

---

## ✦ Features

### 🍅 Pomodoro Focus Sessions

* Create a focus session based on what you're currently working on
* Choose a category such as reviewing, upskilling, assignments, or personal projects
* Use a Pomodoro-style focus timer
* Complete multiple focus sessions throughout the day

### 📱 Phone Distraction Detection

* Uses the webcam during focus sessions
* Runs a custom image classification model
* Detects when I am using my phone
* Tracks phone distractions during sessions

### 📊 Focus Statistics

Track things such as:

* Deep focus time
* Number of distractions
* Focus streaks
* Completed Pomodoro sessions
* Activity/category
* Session start time

### 🌸 Personal Focus Experience

The interface is intentionally designed as a small, personal digital space rather than a generic productivity dashboard.

The ASCII/Unicode-inspired visuals and gentle messages are part of the personality of **mary.focus**

---

## ✦ How the AI Works

The phone detection feature uses an **image classification model created with Google Teachable Machine**

I trained the model using examples captured from my own webcam and exported the resulting model for use in the web application.

The basic flow is:

```text
Webcam
   ↓
Image
   ↓
Custom Image Classification Model
   ↓
Focus / Android / Iphone Prediction
   ↓
Distraction Tracking
   ↓
Reminder
```

Teachable Machine is designed to let users gather examples, train a model, and export it for use in websites and applications.Its models can be used with TensorFlow.js in JavaScript-based projects

---

## ⚠️ About the Model

The model used by **mary.focus** was trained specifically using **my own images and environment**.

Because of that, the model is **not intended to be a general-purpose phone detector** and may not work reliably for other people

The goal of this project was to build a **personal productivity tool** while learning about image classification and exploring how machine learning can be integrated into a web application.

In other words:

> **It was trained for Mary, because Mary is the person who keeps getting distracted by her phone 😭**

---

## ✦ Tech Stack

**Frontend**

* React
* TailwindCSS

**Machine Learning**

* Google Teachable Machine
* TensorFlow.js
* Image Classification

**Deployment**

* Vercel

---

## ✦ What I Learned

This project was especially meaningful to me because it was one of my first opportunities to connect my existing web development skills with concepts from deep learning.

Through this project, I learned more about:

* Integrating a machine learning model into a web application
* Image classification
* Using webcam input in the browser
* Working with Teachable Machine
* Running predictions in a JavaScript environment
* Designing around AI limitations
* Tracking and visualizing personal productivity data
* Thinking about AI from a user-centered perspective

More importantly, I learned that **I don't need to be an expert in deep learning before I can start building things with it.**

As a beginner, tools like Teachable Machine gave me a way to experiment, understand the basic workflow, and connect what I'm learning in deep learning with something I already enjoy doing: **building web applications.**

---

## ✦ A Note on Privacy

The webcam is used for the phone-detection feature during an active focus session

The model is intended to process the webcam input locally in the browser rather than requiring the images to be uploaded to a server. Teachable Machine supports on-device use of models and notes that webcam or microphone data can be processed without leaving the user's computer

Camera permission is required for the detection feature to work

---

## ✦ Future Ideas

This project started intentionally small, but there are a few things I may explore in the future:

* [ ] More robust phone detection
* [ ] Cloud-based session history
* [ ] More detailed productivity analytics
* [ ] More focus session customization
* [ ] Improved model accuracy across different environments

---

## ✦ Made For Me 🌸

I didn't build **mary.focus** because I wanted to create the perfect productivity app

I built it because I wanted something that would help **me** stay focused

It started with a simple problem:

> *"Why did I pick up my phone again?"*

And turned into an opportunity to explore how **web development and deep learning can work together**.

⋆⭒˚.⋆
