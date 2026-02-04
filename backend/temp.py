import cv2
import numpy as np
import platform
import os
from ultralytics import YOLO

# ------------------ BEEP FUNCTION ------------------
def beep():
    system = platform.system()

    if system == "Windows":
        import winsound
        winsound.Beep(1000, 200)
    else:
        # Linux / macOS terminal bell
        os.system('printf "\a"')

# ------------------ LOAD MODEL ------------------
model = YOLO("yolov8n-pose.pt")

# ------------------ GAZE / FOCUS LOGIC ------------------
def get_focus_status(keypoints):
    """
    Returns normalized gaze offset:
    ~0  -> looking forward
    -ve -> left
    +ve -> right
    """
    if keypoints.shape[0] < 3:
        return None

    nose = keypoints[0][:2]
    left_eye = keypoints[1][:2]
    right_eye = keypoints[2][:2]

    # Confidence check
    if keypoints[0][2] < 0.5 or keypoints[1][2] < 0.5 or keypoints[2][2] < 0.5:
        return None

    eye_center_x = (left_eye[0] + right_eye[0]) / 2
    eye_width = abs(right_eye[0] - left_eye[0])

    if eye_width == 0:
        return 0

    offset = nose[0] - eye_center_x
    return offset / eye_width

# ------------------ CAMERA ------------------
cap = cv2.VideoCapture(0)

if not cap.isOpened():
    raise RuntimeError("❌ Cannot open webcam")

print("✅ System Active — Press 'q' to quit")

while True:
    ret, frame = cap.read()
    if not ret:
        beep()
        continue

    results = model(frame, verbose=False)

    status_text = "⚠️ NO ONE DETECTED"
    found_person = False

    for r in results:
        if r.keypoints is not None and len(r.keypoints.data) > 0:
            found_person = True
            kpts = r.keypoints.data[0].cpu().numpy()
            gaze_ratio = get_focus_status(kpts)

            if gaze_ratio is not None:
                if -0.15 < gaze_ratio < 0.15:
                    status_text = "✅ FOCUSED"
                    color = (0, 255, 0)
                else:
                    status_text = "❌ LOOKING AWAY"
                    color = (0, 0, 255)
                    beep()
            else:
                status_text = "⚠️ FACE NOT CLEAR"
                color = (0, 255, 255)

            # Draw keypoints
            for x, y, conf in kpts:
                if conf > 0.5:
                    cv2.circle(frame, (int(x), int(y)), 3, (255, 0, 0), -1)

    if not found_person:
        beep()
        color = (0, 0, 255)

    # Display status
    cv2.putText(
        frame,
        status_text,
        (20, 40),
        cv2.FONT_HERSHEY_SIMPLEX,
        1,
        color,
        2,
    )

    cv2.imshow("Focus Monitor", frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()
