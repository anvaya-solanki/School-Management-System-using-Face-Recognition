import sys
import numpy as np
import face_recognition
import pymongo
from bson import ObjectId

# Connect to MongoDB
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["school"]  # Database Name
students_collection = db["students"]  # Collection Name

def fetch_student_embedding(student_id):
    """
    Fetch the face embeddings for a specific student using the student ID.
    Returns a NumPy array if found, else returns None.
    """
    student = students_collection.find_one({"_id": ObjectId(student_id)}, {"embeddings": 1})
    if student and "embeddings" in student:
        return np.array(student["embeddings"])  # Convert stored list to a NumPy array
    return None

def compare_embeddings(captured_embedding, stored_embedding, threshold=0.5):
    """
    Compare the captured embedding with the stored embedding using face distance.
    Returns True if the distance is below the threshold.
    """
    distance = face_recognition.face_distance([stored_embedding], captured_embedding)[0]
    return distance < threshold

def verify_attendance(student_id, image_path):
    """
    Given a student ID and an image path, extract the face embedding from the image
    and compare it with the stored embedding. Returns True if they match, False otherwise.
    """
    # Load the captured image and extract face embeddings
    captured_image = face_recognition.load_image_file(image_path)
    captured_encodings = face_recognition.face_encodings(captured_image)

    if len(captured_encodings) == 0:
        print("No face detected in the captured image.")
        return False

    captured_embedding = captured_encodings[0]

    # Fetch the student's stored embedding
    stored_embedding = fetch_student_embedding(student_id)
    if stored_embedding is None:
        print("No embeddings found for this student ID.")
        return False

    # Compare the embeddings
    return compare_embeddings(captured_embedding, stored_embedding)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python verify_attendance.py <student_id> <image_path>")
        sys.exit(1)

    student_id = sys.argv[1]
    image_path = sys.argv[2]
    result = verify_attendance(student_id, image_path)
    print(result)  # This will print True if the face matches, False otherwise.