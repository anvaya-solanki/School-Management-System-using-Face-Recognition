import sys
import json
import numpy as np
import face_recognition
import pymongo  # MongoDB client

# Connect to MongoDB
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["attendance_system"]  # Database Name
students_collection = db["students"]  # Collection Name

def fetch_student_embedding(student_id):
    """Fetch the face embeddings of a specific student using Student ID."""
    student = students_collection.find_one({"_id": student_id}, {"embeddings": 1})
    
    if student and "embeddings" in student:
        return np.array(student["embeddings"])  # Convert to NumPy array
    return None  # Return None if student or embeddings not found

def compare_embeddings(captured_embedding, stored_embedding):
    """Compare the captured embedding with the student's stored embedding."""
    distance = face_recognition.face_distance([stored_embedding], captured_embedding)[0]
    return distance < 0.5  # Return True if the face matches (Threshold = 0.5)

def mark_attendance(student_id):
    """Mark the student as present in the database."""
    from datetime import datetime
    today_date = datetime.today().strftime('%Y-%m-%d')

    students_collection.update_one(
        {"_id": student_id},
        {"$push": {"attendance": {"date": today_date, "status": "Present"}}}
    )
    print(json.dumps({"match": True, "studentID": student_id, "message": "Attendance Marked"}))

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Student ID and image path required."}))
        sys.exit()

    student_id = sys.argv[1]  # Student ID from frontend
    captured_image_path = sys.argv[2]  # Image captured for attendance

    # Extract embedding from captured image
    captured_image = face_recognition.load_image_file(captured_image_path)
    captured_encodings = face_recognition.face_encodings(captured_image)

    if len(captured_encodings) == 0:
        print(json.dumps({"match": False, "message": "No face detected."}))
        sys.exit()

    captured_embedding = captured_encodings[0]

    # Fetch the student's stored embeddings
    stored_embedding = fetch_student_embedding(student_id)

    if stored_embedding is None:
        print(json.dumps({"error": "No embeddings found for this student ID."}))
        sys.exit()

    # Compare the embeddings
    if compare_embeddings(captured_embedding, stored_embedding):
        mark_attendance(student_id)
    else:
        print(json.dumps({"match": False, "message": "Face does not match."}))
