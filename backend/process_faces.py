import sys
import numpy as np
import json
import face_recognition

def extract_embeddings(image_path):
    image = face_recognition.load_image_file(image_path)
    face_encodings = face_recognition.face_encodings(image)

    if len(face_encodings) > 0:
        print(json.dumps(face_encodings[0].tolist()))  # Convert NumPy array to JSON
    else:
        print(json.dumps([]))  # Return empty list if no face detected

if __name__ == "__main__":
    image_path = sys.argv[1]
    extract_embeddings(image_path)