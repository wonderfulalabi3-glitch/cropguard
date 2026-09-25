# CropGuard AI — Stage 1

AI-Based Crop Disease Detection System Using Image Processing

## What is included?

This is the Stage 1 front-end prototype:

- Home page
- Disease Detection/upload page
- About/project roadmap page
- Responsive design for mobile and desktop
- Image drag-and-drop
- Image preview
- Demo analysis result
- No external backend required

## How to run

1. Extract the ZIP.
2. Open `index.html` in a browser.
3. Click **Disease Detection**.
4. Upload a crop-leaf image.

A local web server is recommended, but it is not required for this Stage 1 prototype.

## Important

The current "Analyze Image" button does NOT perform real disease prediction. It only demonstrates the user interface and confirms that an image has been received.

In later stages we will add:

1. Crop disease dataset
2. Image preprocessing
3. CNN/transfer-learning model
4. Model training and evaluation
5. Python backend
6. Connection between the website and AI model
7. Real prediction and confidence score
8. Disease information/recommendations

## Suggested project structure

crop_disease_detection_stage1/
├── index.html
├── detect.html
├── about.html
├── README.md
├── css/
│   └── style.css
└── js/
    └── script.js
