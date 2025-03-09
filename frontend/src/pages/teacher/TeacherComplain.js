// // import React from 'react'

// // const TeacherComplain = () => {
// //   return (
// //     <div>TeacherComplain</div>
// //   )
// // }

// // export default TeacherComplain
// import { useEffect, useState } from 'react';
// import { Box, CircularProgress, Stack, TextField, Typography } from '@mui/material';
// import Popup from '../../components/Popup';
// import { BlueButton, GreenButton } from '../../components/buttonStyles';
// import { addStuff } from '../../redux/userRelated/userHandle';
// import { useDispatch, useSelector } from 'react-redux';

// const StudentComplain = () => {
//     const [complaint, setComplaint] = useState("");
//     const [date, setDate] = useState("");

//     const dispatch = useDispatch()

//     const { status, currentUser, error } = useSelector(state => state.user);

//     const user = currentUser._id
//     const school = currentUser.school._id
//     const address = "Complain"

//     const [loader, setLoader] = useState(false)
//     const [message, setMessage] = useState("");
//     const [showPopup, setShowPopup] = useState(false);

//     const fields = {
//         user,
//         date,
//         complaint,
//         school,
//     };

//     const submitHandler = (event) => {
//         event.preventDefault()
//         setLoader(true)
//         dispatch(addStuff(fields, address))
//     };

//     useEffect(() => {
//         if (status === "added") {
//             setLoader(false)
//             setShowPopup(true)
//             setMessage("Done Successfully")
//         }
//         else if (error) {
//             setLoader(false)
//             setShowPopup(true)
//             setMessage("Network Error")
//         }
//     }, [status, error])

//     return (
//         <>
//             <Box
//                 sx={{
//                     flex: '1 1 auto',
//                     alignItems: 'center',
//                     display: 'flex',
//                     justifyContent: 'center'
//                 }}
//             >
//                 <Box
//                     sx={{
//                         maxWidth: 550,
//                         px: 3,
//                         py: '100px',
//                         width: '100%'
//                     }}
//                 >
//                     <div>
//                         <Stack spacing={1} sx={{ mb: 3 }}>
//                             <Typography variant="h4">Complain</Typography>
//                         </Stack>
//                         <form onSubmit={submitHandler}>
//                             <Stack spacing={3}>
//                                 <TextField
//                                     fullWidth
//                                     label="Select Date"
//                                     type="date"
//                                     value={date}
//                                     onChange={(event) => setDate(event.target.value)} required
//                                     InputLabelProps={{
//                                         shrink: true,
//                                     }}
//                                 />
//                                 <TextField
//                                     fullWidth
//                                     label="Write your complain"
//                                     variant="outlined"
//                                     value={complaint}
//                                     onChange={(event) => {
//                                         setComplaint(event.target.value);
//                                     }}
//                                     required
//                                     multiline
//                                     maxRows={4}
//                                 />
//                             </Stack>
//                             <GreenButton
//                                 fullWidth
//                                 size="large"
//                                 sx={{ mt: 3 }}
//                                 variant="contained"
//                                 type="submit"
//                                 disabled={loader}
//                             >
//                                 {loader ? <CircularProgress size={24} color="inherit" /> : "Add"}
//                             </GreenButton>
//                         </form>
//                     </div>
//                 </Box>
//             </Box>
//             <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
//         </>
//     );
// };

// export default StudentComplain;
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Paper, Box, Checkbox
} from '@mui/material';
import { getAllComplains } from '../../redux/complainRelated/complainHandle';
import TableTemplate from '../../components/TableTemplate';

const TeacherComplain = () => {

  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };  const dispatch = useDispatch();
  const { complainsList, loading, error, response } = useSelector((state) => state.complain);
  const { currentUser } = useSelector(state => state.user)

  useEffect(() => {
    dispatch(getAllComplains(currentUser._id, "Complain"));
  }, [currentUser._id, dispatch]);

  if (error) {
    console.log(error);
  }

  const complainColumns = [
    { id: 'user', label: 'User', minWidth: 170 },
    { id: 'complaint', label: 'Complaint', minWidth: 100 },
    { id: 'date', label: 'Date', minWidth: 170 },
  ];

  const complainRows = complainsList && complainsList.length > 0 && complainsList.map((complain) => {
    const date = new Date(complain.date);
    const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "Invalid Date";
    return {
      user: complain.user.name,
      complaint: complain.complaint,
      date: dateString,
      id: complain._id,
    };
  });

  const ComplainButtonHaver = ({ row }) => {
    return (
      <>
        <Checkbox {...label} />
      </>
    );
  };

  return (
    <>
      {loading ?
        <div>Loading...</div>
        :
        <>
          {response ?
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              No Complains Right Now
            </Box>
            :
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              {Array.isArray(complainsList) && complainsList.length > 0 &&
                <TableTemplate buttonHaver={ComplainButtonHaver} columns={complainColumns} rows={complainRows} />
              }
            </Paper>
          }
        </>
      }
    </>
  );
};

export default TeacherComplain;