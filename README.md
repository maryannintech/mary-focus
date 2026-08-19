# mary.focus ⋆⭒˚.⋆

> A cozy, minimalist Pomodoro web app with real-time, on-device computer vision to help keep study sessions on track and phone distractions away.

[![Live Demo](https://img.shields.io/badge/Live_Demo-mary--focus.vercel.app-7c3aed?style=for-the-badge\&logo=vercel\&logoColor=white)](https://mary-focus.vercel.app/)

```
 /)/)
( . .)
( づ♡
```

## The Story & Inspiration

I'm someone who gets easily distracted once I pick up my phone. What starts as a quick check can easily turn into several minutes of scrolling without realizing how much time has passed. I wanted to build something that could gently interrupt that habit while I was studying

While taking a **Modern AI / Deep Learning course** in Cisco, I discovered **Google Teachable Machine**. As a beginner in deep learning, I was excited to learn that I could connect something I already enjoy — **web development** — with something I was currently learning — **computer vision and image classification**

I trained a custom image classification model using examples of myself in different focus and phone-use situations, including **iPhone and Android phone postures**.

During a focus session, the model runs directly in the browser using my webcam. When it detects that I'm using my phone, **mary.focus** triggers an audio alert and records the distraction.

---

## Features

### Pomodoro Cycles

* 25-minute focus sessions
* 5-minute break intervals
* Guided transitions between focus and break periods
* Start another session after completing a focus cycle

### On-Device Phone Detection

* Uses the webcam during active focus sessions
* Runs a custom Teachable Machine image classification model
* Recognizes trained iPhone and Android phone-use postures
* Provides an audio alert when a distraction is detected
* Tracks distractions throughout the session

### Straightforward Session Flow

* Computer vision detection pauses during breaks and transition screens
* Phone detection only runs when it is relevant to the focus session
* Prevents distractions during designated rest periods from affecting focus statistics

### Audio Ambience & Alerts

* Background audio during breaks
* Transition alarms
* Phone distraction alerts
* Instant mute/unmute controls

### Focus Analytics

At the end of a session, **mary.focus** summarizes:

* Total focus time
* Deep focus time
* Number of distractions
* Focus score
* Activity category
* Session start time

---

### Picture-in-Picture Mode
The camera feed can be placed in a floating Picture-in-Picture window, allowing the focus session and camera monitoring to remain visible while studying in another browser tab

## How the Computer Vision Works

The phone detection system uses an **image classification model trained with Google Teachable Machine**.

The model was trained using webcam images of myself in different situations.

```
Webcam
   ↓
Video Frame
   ↓
TensorFlow.js
   ↓
Teachable Machine Image Classifier
   ↓
┌─────────────────────────────┐
│ Focus / iPhone / Android    │
└─────────────────────────────┘
   ↓
Phone Detected?
   ↓
Audio Alert + Distraction Log
```

The model runs **on-device in the browser**, allowing webcam frames to be processed without sending them to a remote AI server.

### Model Limitations

The model was intentionally trained around **my own appearance, environment, and phone-use habits**.

Because of this, it is **not a general-purpose phone detection model** and may not perform reliably for other users.

During development, I also tested the model against situations that could cause false positives, such as covering my mouth or moving my hands near my face. I retrained the model with additional examples to improve its ability to distinguish normal study behavior from phone use.

This iterative process was one of the most valuable parts of building the project because it showed me that training a model is not simply a one-time step — **real-world testing reveals cases that the original training data didn't account for.**

---

## Tech Stack

### Frontend

* React
* Vite
* React Router
* Tailwind CSS

### Machine Learning / Computer Vision

* TensorFlow.js
* Google Teachable Machine
* `@teachablemachine/image`

### Deployment

* Vercel

---


## What I Learned

Building **mary.focus** gave me the opportunity to apply concepts from my deep learning course to a project I actually wanted to use.

Through the project, I learned about:

* Image classification
* Training and iterating on a custom dataset
* Webcam-based machine learning in the browser
* Running TensorFlow.js models client-side
* Integrating machine learning into a React application
* Handling model predictions in real time
* Dealing with false positives
* Designing around the limitations of a custom-trained model
* Connecting AI concepts with practical web development

Most importantly, this project taught me that **I don't need to be an expert in deep learning before I can start building with it.**

As a beginner, Teachable Machine gave me a way to experiment with computer vision while still using the web development skills I'm comfortable with.

---

## Privacy

The webcam is only used when the computer vision feature is active during a focus session.

The image classification model runs locally in the browser using TensorFlow.js. Webcam frames are processed for prediction rather than being uploaded to a backend server for inference.

Camera permission is required for phone detection to work.

Because the model is trained specifically around my own appearance and environment, the application is primarily intended as a **personal productivity project** rather than a general-purpose computer vision application.

---

## Future Ideas

Some ideas I may explore in the future:

* Improve model accuracy across different environments
* More detailed productivity analytics
* Cloud-based session history
* Additional focus session customization
* More computer vision classes and edge-case training

---

## Made For Me

I didn't build **mary.focus** to create the perfect productivity app.

I built it because I needed something to help **me** stay focused.

It started with a simple problem:

> *"Why did I pick up my phone again?"*

Then, while learning deep learning, I realized I could turn that problem into an opportunity to experiment with **computer vision, image classification, and web development**.

And that's how **mary.focus** came to life.

⋆⭒˚.⋆
