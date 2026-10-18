import cv2
from ultralytics import YOLO

# Load pre-trained model (downloads weights automatically)
model = YOLO("yolov8n.pt") 

cap = cv2.VideoCapture(0)

while cap.isOpened():
    success, frame = cap.read()
    if not success:
        break

    # Run inference with tracking
    results = model.track(frame, persist=True)

    # Plot visual bounding boxes
    annotated_frame = results[0].plot()

    cv2.imshow("Object Detection Project", annotated_frame)
    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()
