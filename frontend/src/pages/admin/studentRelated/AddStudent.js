import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerStudent, registerUser } from '../../../redux/userRelated/userHandle';
import Popup from '../../../components/Popup';
import { underControl } from '../../../redux/userRelated/userSlice';
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';
import { CircularProgress, Button, Modal, Box, Typography } from '@mui/material';
import Webcam from "react-webcam";
import axios from 'axios';

const AddStudent = ({ situation }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();

    const userState = useSelector(state => state.user);
    const { status, currentUser, response, error } = userState;
    const { sclassesList } = useSelector((state) => state.sclass);

    const [name, setName] = useState('');
    const [rollNum, setRollNum] = useState('');
    const [password, setPassword] = useState('');
    const [className, setClassName] = useState('');
    const [sclassName, setSclassName] = useState('');
    const [image, setImage] = useState(null);
    const [embeddings, setEmbeddings] = useState(null);
    const [openWebcam, setOpenWebcam] = useState(false);
    const webcamRef = useRef(null);

    const handleOpenWebcam = () => setOpenWebcam(true);
    const handleCloseWebcam = () => setOpenWebcam(false);

    const adminID = currentUser._id;
    const role = "Student";
    const attendance = [];

    useEffect(() => {
        if (situation === "Class") {
            setSclassName(params.id);
        }
    }, [params.id, situation]);

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        dispatch(getAllSclasses(adminID, "Sclass"));
    }, [adminID, dispatch]);

    const changeHandler = (event) => {
        if (event.target.value === 'Select Class') {
            setClassName('Select Class');
            setSclassName('');
        } else {
            const selectedClass = sclassesList.find(
                (classItem) => classItem.sclassName === event.target.value
            );
            setClassName(selectedClass.sclassName);
            setSclassName(selectedClass._id);
        }
    };

    // Capture image from webcam
    const captureImage = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImage(imageSrc); // Store Base64 image
    };

    // Convert base64 image to File
    const dataURLtoFile = (dataUrl, filename) => {
        let arr = dataUrl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        // console.log(File([u8arr], filename, { type: mime }))
        return new File([u8arr], filename, { type: mime });
    };

    const submitHandler = async (event) => {
        event.preventDefault();

        if (!sclassName) {
            setMessage("Please select a classname");
            setShowPopup(true);
            return;
        }

        if (!image) {
            setMessage("Please capture an image first!");
            setShowPopup(true);
            return;
        }

        setLoader(true);

        const file = dataURLtoFile(image, `${name}_image.jpg`);

        const formData = new FormData();
        formData.append("name", name);
        formData.append("rollNum", rollNum);
        formData.append("password", password);
        formData.append("sclassName", sclassName);
        formData.append("adminID", adminID);
        formData.append("role", role);
        formData.append("attendance", JSON.stringify(attendance));
        formData.append("image", file);

        try {
            console.log("Starting")
            await dispatch(registerStudent(formData, role));
            console.log("Registration completed");
            navigate(-1);
        } catch (error) {
            setMessage("Error registering student");
            setShowPopup(true);
        } finally {
            setLoader(false);
        }
    };

    return (
        <>
            <div className="register">
                <form className="registerForm" onSubmit={submitHandler}>
                    <span className="registerTitle">Add Student</span>

                    <label>Name</label>
                    <input className="registerInput" type="text" placeholder="Enter student's name..."
                        value={name} onChange={(event) => setName(event.target.value)} required />

                    {situation === "Student" &&
                        <>
                            <label>Class</label>
                            <select className="registerInput" value={className} onChange={changeHandler} required>
                                <option value='Select Class'>Select Class</option>
                                {sclassesList.map((classItem, index) => (
                                    <option key={index} value={classItem.sclassName}>
                                        {classItem.sclassName}
                                    </option>
                                ))}
                            </select>
                        </>
                    }

                    <label>Roll Number</label>
                    <input className="registerInput" type="number" placeholder="Enter student's Roll Number..."
                        value={rollNum} onChange={(event) => setRollNum(event.target.value)} required />

                    <label>Password</label>
                    <input className="registerInput" type="password" placeholder="Enter student's password..."
                        value={password} onChange={(event) => setPassword(event.target.value)} required />

                    <Button variant="contained" color="primary" onClick={handleOpenWebcam}>
                        Take Picture
                    </Button>
                    <Modal open={openWebcam} onClose={handleCloseWebcam}>
                        <Box sx={{ p: 4, backgroundColor: "white", borderRadius: 2 }}>
                            <Typography variant="h6">Capture Image</Typography>
                            <Webcam ref={webcamRef} screenshotFormat="image/jpeg" width={400} height={300} />
                            <Button variant="contained" color="success" onClick={captureImage}>Capture</Button>
                        </Box>
                    </Modal>

                    {image && <img src={image} alt="Captured" style={{ width: "100px", height: "100px", marginTop: "10px" }} />}

                    <button className="registerButton" type="submit" disabled={loader}>
                        {loader ? <CircularProgress size={24} color="inherit" /> : 'Add'}
                    </button>
                </form>
            </div>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </>
    );
};

export default AddStudent;
