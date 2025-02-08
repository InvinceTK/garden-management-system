from owl.detection import GreenOnBrown 
import cv2
import matplotlib.pyplot as plt

ALGORITHM = 'exhsv'

def main():
    # Initialize the detector
    weed_detector = GreenOnBrown()
    
    # Read the image
    frame = cv2.imread('images/image.png')
    if frame is None:
        print("Error: Could not read image")
        return
    
    # Convert BGR to RGB for matplotlib display
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            
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
    
    # Convert display image to RGB for matplotlib
    display_rgb = cv2.cvtColor(display_image, cv2.COLOR_BGR2RGB)
    
    # Create figure with two subplots
    plt.figure(figsize=(15, 5))
    
    # Original image on the left
    plt.subplot(1, 2, 1)
    plt.imshow(frame_rgb)
    plt.title('Original Image')
    plt.axis('off')
    
    # Processed image on the right
    plt.subplot(1, 2, 2)
    plt.imshow(display_rgb)
    plt.title(f'Detected Weeds: {len(bounding_boxes)}')
    plt.axis('off')
    
    # Adjust layout and display
    plt.tight_layout()
    plt.show()

if __name__ == "__main__":
    main()