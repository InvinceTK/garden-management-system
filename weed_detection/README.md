# Garden Weed Detection Project

This project uses the OpenWeedLocator tools to detect weeds in garden images.

## Setup

1. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Usage

1. Place your garden images in the `images` directory

2. Run the weed detector:
```bash
python weed_detector.py images/your_image.jpg
```

Additional options:
```bash
# Adjust detection parameters
python weed_detector.py images/your_image.jpg --min-area 200 --max-area 50000 --threshold 0.6

# Save the visualization
python weed_detector.py images/your_image.jpg --save output.png
```

## Parameters

- `min_area`: Minimum area of a detected weed (default: 100)
- `max_area`: Maximum area of a detected weed (default: 100000)
- `threshold`: Threshold for green detection (0-1, default: 0.5)