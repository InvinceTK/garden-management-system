# scripts/detect_weeds.py
import sys
from owl.detection import GreenOnBrown
import cv2
import matplotlib.pyplot as plt

ALGORITHM = 'exhsv'

def detect_weeds(input_path, output_path):
    # Initialize the detector
    weed_detector = GreenOnBrown()
    
    # Read the image
    frame = cv2.imread(input_path)
    if frame is None:
        print(f"Error: Could not read image from {input_path}")
        sys.exit(1)
    
    # Process image to detect weeds
    results = weed_detector.find(
        frame.copy(),
        exgMin=30,
        exgMax=250,
        hueMin=30,
        hueMax=90,
        brightnessMin=5,
        brightnessMax=200,
        saturationMin=30,
        saturationMax=255,
        minArea=1,
        show_display=False,
        algorithm=ALGORITHM,
        invert_hue=False
    )
    
    # Unpack results
    contours, bounding_boxes, weed_centres, display_image = results
    
    # Save the processed image
    cv2.imwrite(output_path, display_image)
    
    # Print detection results for logging
    print(f"Detected {len(bounding_boxes)} weeds")
    print(f"Processed image saved to {output_path}")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python detect_weeds.py input_path output_path")
        sys.exit(1)
        
    input_path = sys.argv[1]
    output_path = sys.argv[2]
    detect_weeds(input_path, output_path)