from IPython.display import display, clear_output
import cv2
import face_recognition as fr
import numpy as np

video_capture = cv2.VideoCapture(0)
if not video_capture.isOpened():
    print("Error: Could not open video capture.")
    exit()

known_face_encodings = [
    fr.face_encodings(fr.load_image_file("Daniel.jpeg"))[0],
    fr.face_encodings(fr.load_image_file("Derek.jpeg"))[0],
    fr.face_encodings(fr.load_image_file("Anvaya.jpg"))[0],
    fr.face_encodings(fr.load_image_file("Obama.jpg"))[0],
    fr.face_encodings(fr.load_image_file("Kate.jpg"))[0],
    fr.face_encodings(fr.load_image_file("Bob.jpg"))[0],
    fr.face_encodings(fr.load_image_file("Biden.jpg"))[0],
]
known_face_names = ["Daniel", "Derek", "Anvaya", "Obama", "Kate", "Bob", "Biden"]
while True:
    ret, frame = video_capture.read()
    if not ret:
        print("Failed to capture video frame.")
        break

    cv2.imshow('Video Feed', frame)

    key = cv2.waitKey(1) & 0xFF
    if key == ord('c'):  
        print("Image captured!")
        break
    elif key == ord('q'):  
        print("Exiting without capturing.")
        video_capture.release()
        cv2.destroyAllWindows()
        exit()
rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
fc_locations = fr.face_locations(rgb_frame)
if len(fc_locations) == 0:
    print("No face detected. Please try again.")
    exit()
print("Image shape:", rgb_frame.shape)  
print("Image dtype:", rgb_frame.dtype)  

try:
    fc_encodings = fr.face_encodings(rgb_frame, fc_locations)
    print("Face encodings:", fc_encodings)
except Exception as e:
    print("Error while generating face encodings:", e)

for(top, right, bottom, left), face_encoding in zip(fc_locations, fc_encodings):
    matches = fr.compare_faces(known_face_encodings, face_encoding)
    name = "Unknown"

    fc_distances = fr.face_distance(known_face_encodings, face_encoding)
    match_index = np.argmin(fc_distances)
    if matches[match_index]:
        name = known_face_names[match_index]
        print("Attendance marked for", name)
    elif name == "Unknown":
        print("No attendance marked")

video_capture.release()
cv2.destroyAllWindows()
