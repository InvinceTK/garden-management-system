<<<<<<< HEAD
from owl.detection import GreenOnBrown 
import cv2
import numpy as np
import os
from datetime import datetime

ALGORITHM = 'exhsv'
VIDEO_PATH = os.path.join('video', '3090199-hd_1920_1080_30fps.mp4')

# UI Constants
HEADER_HEIGHT = 60
FOOTER_HEIGHT = 40
PADDING = 20
FONT = cv2.FONT_HERSHEY_SIMPLEX
BG_COLOR = (50, 50, 50)
TEXT_COLOR = (255, 255, 255)
HIGHLIGHT_COLOR = (0, 255, 0)
BORDER_COLOR = (100, 100, 100)

def create_header(width, height=HEADER_HEIGHT):
    """Create a header with dark background."""
    header = np.zeros((height, width, 3), dtype=np.uint8)
    header[:] = BG_COLOR
    return header

def create_footer(width, height=FOOTER_HEIGHT):
    """Create a footer with dark background."""
    footer = np.zeros((height, width, 3), dtype=np.uint8)
    footer[:] = BG_COLOR
    return footer

def add_text_with_background(img, text, position, font_scale=0.7, thickness=2):
    """Add text with a semi-transparent background."""
    (text_width, text_height), baseline = cv2.getTextSize(text, FONT, font_scale, thickness)
    text_bg = position[0] - 5, position[1] - text_height - 5
    text_end = position[0] + text_width + 5, position[1] + 5
    
    # Draw semi-transparent background
    overlay = img.copy()
    cv2.rectangle(overlay, text_bg, text_end, BG_COLOR, -1)
    cv2.addWeighted(overlay, 0.7, img, 0.3, 0, img)
    
    # Draw text
    cv2.putText(img, text, position, FONT, font_scale, TEXT_COLOR, thickness)

def process_frame(frame, weed_detector):
    """Process a single frame to detect weeds."""
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
    return results

def create_ui_frame(original, processed, weed_count, fps):
    """Create a complete UI frame with header, videos, and footer."""
    # Get frame dimensions
    h, w = original.shape[:2]
    
    # Create header
    header = create_header(w * 2)
    cv2.putText(header, "Weed Detection System", (PADDING, 40), 
                FONT, 1.2, TEXT_COLOR, 2)
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    cv2.putText(header, current_time, (w * 2 - 200, 40), 
                FONT, 0.7, TEXT_COLOR, 1)
    
    # Add labels to frames
    add_text_with_background(original, "Original Feed", (PADDING, 30))
    add_text_with_background(processed, f"Detected Weeds: {weed_count}", (PADDING, 30))
    
    # Create footer
    footer = create_footer(w * 2)
    fps_text = f"FPS: {fps:.1f}"
    cv2.putText(footer, fps_text, (PADDING, 25), 
                FONT, 0.7, TEXT_COLOR, 1)
    cv2.putText(footer, "Press 'Q' to quit", (w * 2 - 150, 25), 
                FONT, 0.7, TEXT_COLOR, 1)
    
    # Combine frames horizontally
    combined = np.hstack((original, processed))
    
    # Add borders between frames
    cv2.line(combined, (w, 0), (w, h), BORDER_COLOR, 2)
    
    # Combine everything vertically
    final_frame = np.vstack((header, combined, footer))
    
    return final_frame

def main():
    # Initialize the detector
    weed_detector = GreenOnBrown()
    
    # Open the video file
    cap = cv2.VideoCapture(VIDEO_PATH)
    if not cap.isOpened():
        print(f"Error: Could not open video file at {VIDEO_PATH}")
        return

    # Create a window
    window_name = 'Weed Detection System'
    cv2.namedWindow(window_name, cv2.WINDOW_NORMAL)

    # FPS calculation variables
    prev_time = datetime.now()
    fps = 0
    
    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                break

            # Calculate FPS
            current_time = datetime.now()
            time_diff = (current_time - prev_time).total_seconds()
            fps = 1 / time_diff if time_diff > 0 else 0
            prev_time = current_time

            # Process frame
            contours, bounding_boxes, weed_centres, display_image = process_frame(frame, weed_detector)
            
            # Create UI frame
            ui_frame = create_ui_frame(frame, display_image, len(bounding_boxes), fps)
            
            # Resize if needed
            screen_res = 1920, 1080
            scale = min(screen_res[0] / ui_frame.shape[1],
                       screen_res[1] / ui_frame.shape[0])
            
            if scale < 1:
                width = int(ui_frame.shape[1] * scale)
                height = int(ui_frame.shape[0] * scale)
                ui_frame = cv2.resize(ui_frame, (width, height))

            # Show the frame
            cv2.imshow(window_name, ui_frame)
            
            # Break if 'q' is pressed
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

    finally:
        # Clean up
        cap.release()
        cv2.destroyAllWindows()
        print("Processing complete")
=======
import cv2
import numpy as np
import argparse
from pathlib import Path
import matplotlib.pyplot as plt

try:
    from openweedlocator import GreenonBrown
except ImportError:
    print("Error: Could not import openweedlocator. Make sure it's installed correctly.")
    print("Try: pip install openweedlocator-tools[desktop]")
    exit(1)

class WeedDetector:
    def __init__(self, min_area=100, max_area=100000, threshold=0.5):
        """
        Initialize the weed detector with customizable parameters
        
        Args:
            min_area (int): Minimum area of a detected weed
            max_area (int): Maximum area of a detected weed
            threshold (float): Threshold for green detection (0-1)
        """
        try:
            self.detector = GreenonBrown(
                min_area=min_area,
                max_area=max_area,
                threshold=threshold
            )
        except Exception as e:
            print(f"Error initializing GreenonBrown: {str(e)}")
            raise
        
    def process_image(self, image_path):
        """
        Process an image and detect weeds
        
        Args:
            image_path (str): Path to the input image
            
        Returns:
            tuple: (original image, processed image with detections, number of detections)
        """
        # Read the image
        image = cv2.imread(str(image_path))
        if image is None:
            raise ValueError(f"Could not read image at {image_path}")
        
        # Convert BGR to RGB for proper display
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
        # Create a copy for drawing
        output_image = image_rgb.copy()
        
        try:
            # Detect weeds
            detections = self.detector.find(image)
            
            # Draw detections
            for i, detection in enumerate(detections):
                # Get bounding box coordinates
                x, y, w, h = detection
                
                # Draw rectangle
                cv2.rectangle(
                    output_image,
                    (x, y),
                    (x + w, y + h),
                    (255, 0, 0),  # Red color
                    2
                )
                
                # Add label
                cv2.putText(
                    output_image,
                    f'Weed {i+1}',
                    (x, y - 10),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.5,
                    (255, 0, 0),
                    2
                )
            
            return image_rgb, output_image, len(detections)
        except Exception as e:
            print(f"Error during weed detection: {str(e)}")
            raise
    
    def visualize_results(self, original, processed, num_detections, save_path=None):
        """
        Visualize the detection results
        
        Args:
            original (np.array): Original image
            processed (np.array): Processed image with detections
            num_detections (int): Number of weeds detected
            save_path (str, optional): Path to save the visualization
        """
        plt.figure(figsize=(15, 5))
        
        # Original image
        plt.subplot(1, 2, 1)
        plt.imshow(original)
        plt.title('Original Image')
        plt.axis('off')
        
        # Processed image
        plt.subplot(1, 2, 2)
        plt.imshow(processed)
        plt.title(f'Detected Weeds: {num_detections}')
        plt.axis('off')
        
        if save_path:
            plt.savefig(save_path)
        plt.show()

def main():
    # Set up argument parser
    parser = argparse.ArgumentParser(description='Detect weeds in garden images')
    parser.add_argument('image_path', type=str, help='Path to the input image')
    parser.add_argument('--min-area', type=int, default=100, help='Minimum weed area')
    parser.add_argument('--max-area', type=int, default=100000, help='Maximum weed area')
    parser.add_argument('--threshold', type=float, default=0.5, help='Green detection threshold')
    parser.add_argument('--save', type=str, help='Path to save visualization')
    
    args = parser.parse_args()
    
    try:
        # Create detector
        detector = WeedDetector(
            min_area=args.min_area,
            max_area=args.max_area,
            threshold=args.threshold
        )
        
        # Process image
        original, processed, num_detections = detector.process_image(args.image_path)
        
        # Visualize results
        detector.visualize_results(original, processed, num_detections, args.save)
        
        print(f"Found {num_detections} weeds in the image")
        
    except Exception as e:
        print(f"Error processing image: {str(e)}")
        import traceback
        traceback.print_exc()
>>>>>>> ee78957 (weed detection)

if __name__ == "__main__":
    main()