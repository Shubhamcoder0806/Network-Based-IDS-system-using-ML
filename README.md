# Network-Based-IDS-system-using-ML
Overview

This project implements a Machine Learning Based Network Intrusion Detection System (IDS) designed to detect malicious network traffic and visualize the results through a cybersecurity dashboard.

The system uses a Random Forest machine learning model trained on intrusion detection datasets to classify network traffic as Normal or Attack. The predictions are displayed through a frontend monitoring dashboard, helping security analysts interpret the detection results.

This project demonstrates the integration of machine learning, cybersecurity concepts, and frontend visualization in an academic IDS environment.

Features

Machine Learning based intrusion detection

Random Forest classification model

Network traffic analysis

Attack detection and alert system

Interactive cybersecurity dashboard

Traffic distribution visualization

Intrusion alert notifications

Packet log monitoring interface

Simulation based IDS demonstration

System Architecture
Network Traffic Dataset
        ↓
Data Preprocessing
        ↓
Feature Scaling
        ↓
Machine Learning Model (Random Forest)
        ↓
Prediction (Normal / Attack)
        ↓
Frontend IDS Dashboard

The ML model performs the detection logic, while the dashboard provides visualization and monitoring of IDS outputs.

Machine Learning Model

The intrusion detection system uses a Random Forest classifier.

Reasons for selecting Random Forest:

High classification accuracy

Robust against overfitting

Handles large datasets efficiently

Suitable for cybersecurity anomaly detection

The model was trained on intrusion detection datasets and evaluated using standard classification metrics.

Model Evaluation Metrics

The model performance was evaluated using:

Accuracy

Precision

Recall

F1 Score

Confusion Matrix

For intrusion detection systems, recall is particularly important because missing an attack can have serious consequences.

Dashboard Features

The IDS dashboard provides a visual interface to monitor network activity and detection results.

Dashboard components include:

Traffic analysis overview

Total packets analyzed

Number of attacks detected

Normal traffic count

Model accuracy indicator

Protocol distribution visualization

Intrusion alerts panel

Packet log monitoring table

Detection simulation system

The dashboard helps security analysts understand and interpret intrusion detection results easily.

Detection Simulation

The system includes a simulation module that demonstrates how the IDS responds to network traffic.

When detection is triggered, the dashboard displays:

Prediction result (Normal or Attack)

Model confidence

Attack category

Security severity level

This simulation represents how the IDS would behave in a real deployment scenario.

Technologies Used

Machine Learning

Python

Scikit-learn

Pandas

NumPy

Frontend

HTML

CSS

JavaScript

Visualization

Chart-based traffic analytics

Project Structure
IDS_PROJECT
│
├── dataset
│   ├── intrusion_dataset.csv
│
├── model
│   ├── ids_random_forest_model.pkl
│   ├── ids_scaler.pkl
│
├── frontend
│   ├── index.html
│   ├── style.css
│   ├── script.js
│
├── notebook
│   ├── ids_training.ipynb
│
└── README.md
Current Project Status

Completed:

Dataset preprocessing

Machine learning model training

Model evaluation

IDS detection logic

Dashboard visualization

In Progress:

Backend integration

Real-time network monitoring

Future Scope

Possible future improvements include:

Real-time packet capture

Live network monitoring

Integration with security information systems

Advanced deep learning models for intrusion detection

Automated threat response mechanisms

Conclusion

This project demonstrates how machine learning can enhance network security by detecting malicious traffic patterns.

By combining ML-based detection with a monitoring dashboard, the system provides both intelligent detection and visual interpretability for cybersecurity analysis.

Contributors

Shubham Mishra
Kanha Mishra
Pranav Goyal
Aman Adarshi
Priyansh Bhatt

Academic Project

This project was developed as part of an academic cybersecurity research project.
