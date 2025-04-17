# Hand-Drawn Sketch Generator

## Overview
This project provides a web-based tool to convert uploaded images into hand-drawn sketches. Users can customize the sketch style and adjust various parameters to achieve different artistic effects.

## Features
- **Multiple Sketch Styles**: Choose from pencil, charcoal, or detailed sketch styles
- **Customizable Parameters**: Adjust line strength, detail level, and shading intensity
- **Real-time Preview**: See the sketch result immediately after uploading an image
- **Download Functionality**: Save the generated sketch as a PNG file

## Usage
1. Open the application in your web browser
2. Upload an image file using the file input
3. Adjust the sketch parameters using the sliders and style selector
4. Click 'Generate Sketch' to see the result
5. Use 'Download Sketch' to save your creation

## Customization Options
- **Sketch Style**: Select from pencil, charcoal, or detailed styles
- **Line Strength**: Control the intensity of lines in the sketch
- **Detail Level**: Adjust the amount of detail in the sketch
- **Shading Intensity**: Modify the shading effect in the sketch

## Requirements
- Modern web browser with JavaScript enabled

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

Welcome to the Image-to-Sketch Conversion project! This project explores the use of deep learning techniques to transform digital images into realistic, hand-drawn sketches. Utilizing the CUHK Face Sketch Database (CUFS), we developed a model capable of producing high-quality, sketch-style renditions of digital images.



🖼️ Project Overview

This project aims to bridge the gap between digital imagery and artistic sketching through artificial intelligence. It leverages deep neural networks to mimic the nuances of hand-drawn sketches, bringing subtle texture, shading, and line work into a digitally rendered form.



✨ Problem Statement

Convert digital images into authentic sketch-like representations using deep learning, providing a seamless experience for generating sketches that emulate traditional hand-drawn art.



🔍 Approach

Data Preparation:

Dataset: CUHK Face Sketch Database (CUFS), containing pairs of photos and corresponding sketch images.

Preprocessing: Resized and normalized images, and applied transformations to enhance model robustness.


Model Architecture:

Developed a deep neural network tailored to produce clear, detailed sketches. The model was iteratively optimized to capture fine line work and shading, improving the authenticity of each sketch.


Training:

Experimented with various neural network layers and configurations.

Fine-tuned hyperparameters to achieve optimal sketch quality, balancing model complexity with training time.



Evaluation:

Used metrics such as Mean Absolute Error (MAE) and Structural Similarity Index (SSIM) to evaluate the fidelity of generated sketches compared to the ground truth.

Conducted qualitative assessments to ensure the model accurately represented key facial features and textures.



🚀 Results

The model effectively generated clear, hand-drawn-style sketches with high visual appeal.

Final sketches showcased intricate line details and shading, closely resembling traditional pencil sketches.

The approach demonstrated promising potential for applications in creative AI, portrait rendering, and more.
Input Image:
![fantasy-2049567](https://github.com/user-attachments/assets/c99a5308-c6ce-4866-8cd6-230c269cfd5f)

Output Sketch:
![hand-drawn-sketch](https://github.com/user-attachments/assets/47a7cb65-61f7-41e1-be80-01d5491c5ee3)



📈 Key Insights

The model successfully learned to generate consistent, hand-drawn-like sketches.
Fine-tuning layers and experimenting with hyperparameters were crucial to achieving high-quality sketches.



📝 Future Work

Experimenting with larger datasets for broader generalization.
Extending the model to support different artistic styles beyond sketching.



🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.



