# 🛡️ Network-Based Intrusion Detection System using Machine Learning

A cybersecurity project that detects malicious network traffic using Machine Learning and visualizes results through an interactive IDS dashboard.

This project demonstrates how AI/ML can enhance network security by identifying suspicious patterns in network traffic and presenting them through a monitoring interface for security analysts.

## 📌 Project Overview

Modern networks face increasing threats such as DoS attacks, probing, and unauthorized access. Traditional Intrusion Detection Systems rely heavily on signature-based detection, which fails to identify new or unknown attacks.

This project implements an ML-powered Network Intrusion Detection System that:

- Learns traffic patterns using **Random Forest** classification
- Detects malicious network behavior
- Visualizes security alerts through a cybersecurity dashboard

## 🚀 Key Features

- ✅ Machine Learning-based intrusion detection
- ✅ Random Forest classification model
- ✅ Traffic analysis & attack detection
- ✅ Cybersecurity monitoring dashboard
- ✅ Intrusion alert system
- ✅ Protocol traffic breakdown
- ✅ Detection simulation module
- ✅ Visualization of network activity

## 🧠 System Architecture
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


The ML model performs intrusion detection, while the dashboard provides visualization and monitoring capabilities.

## 🤖 Machine Learning Model

The IDS uses a **Random Forest classifier**, which is well-suited for cybersecurity anomaly detection.

### Why Random Forest?

- Handles large datasets effectively
- Resistant to overfitting
- High classification accuracy
- Robust for intrusion detection problems

The model is trained using network traffic features and learns to classify traffic into:

| Category | Description |
|----------|-------------|
| **Normal Traffic** | Legitimate network activity |
| **Malicious Traffic** | Suspicious or attack behavior |

## 📊 Model Evaluation

The model performance is evaluated using:

- **Accuracy** - Overall correctness of predictions
- **Precision** - Accuracy of positive predictions
- **Recall** - Ability to find all positive samples
- **F1-Score** - Harmonic mean of precision and recall
- **Confusion Matrix** - Detailed classification results

> ⚠️ **Note:** In intrusion detection systems, **recall** is more important than accuracy because missing an attack can lead to severe security breaches.

## 🖥️ IDS Dashboard

The project includes a cybersecurity monitoring dashboard that visualizes detection results.

### Dashboard Features

- Total network traffic analyzed
- Number of attacks detected
- Normal traffic statistics
- Model accuracy indicator
- Traffic distribution charts
- Protocol analysis (TCP / UDP / ICMP)
- Intrusion alerts panel
- Packet monitoring logs
- Detection simulation

The dashboard helps security analysts interpret ML predictions quickly and efficiently.

## ⚡ Detection Simulation

For demonstration purposes, the system includes a simulation feature that mimics real-time IDS behavior.

When traffic is analyzed, the dashboard displays:
- Detection result (Normal / Attack)
- Model confidence level
- Attack classification
- Security severity level

This simulates how the IDS would operate in a real-world network environment.

## 🛠️ Technologies Used

### Machine Learning
- Python
- Scikit-learn
- Pandas
- NumPy

### Visualization
- Matplotlib
- Seaborn

### Frontend
- HTML
- CSS
- JavaScript

### Development Environment
- Jupyter Notebook

## 📂 Project Structure
ML-Network-IDS/
│
├── datasets/
│ └── intrusion_dataset.csv
│
├── models/
│ ├── ids_random_forest_model.pkl
│ └── scaler.pkl
│
├── frontend/
│ ├── index.html
│ ├── style.css
│ └── script.js
│
├── notebooks/
│ └── ids_training.ipynb
│
└── README.md

text

## 📈 Current Project Status

- ✅ Dataset preprocessing completed
- ✅ Machine learning model trained
- ✅ Model evaluation completed
- ✅ IDS detection logic implemented
- ✅ Dashboard visualization created

## 🔮 Future Improvements

- Real-time packet capture integration
- Live network monitoring
- Automated threat response system
- Deep learning based intrusion detection
- Integration with SIEM security platforms

## 👨‍💻 Contributors

| Name | Role |
|------|------|
| Shubham Mishra | Developer |
| Kanha Mishra | Developer |
| Pranav Goyal | Developer |
| Aman Adarshi | Developer |
| Priyansh Bhatt | Developer |

## 🎓 Academic Project

This project was developed as part of an academic cybersecurity research initiative focusing on machine learning applications in network security.

---

## 📦 Installation & Setup

### Prerequisites
- Python 3.7+
- pip package manager

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/Network-Based-IDS-system-using-ML.git
cd Network-Based-IDS-system-using-ML

# Install required packages
pip install pandas numpy scikit-learn matplotlib seaborn joblib

# Train the model (if needed)
jupyter notebook notebooks/ids_training.ipynb
Frontend Setup
Simply open frontend/index.html in your web browser to view the IDS dashboard.

🚀 Usage
Train the Random Forest model using the provided Jupyter notebook

The trained model and scaler will be saved in the models/ directory

Open the dashboard to simulate intrusion detection

View detection results, traffic analysis, and security alerts

📊 Sample Output
The dashboard provides real-time insights including:

Attack vs Normal traffic ratio

Protocol-wise traffic distribution

Model confidence scores

Timestamped intrusion alerts

Star ⭐ this repository if you found it useful!

text

