// import React from 'react';
// import { Link } from 'react-router-dom';
// import { Container, Grid, Box, Button } from '@mui/material';
// import styled from 'styled-components';
// import Students from "../assets/students.svg";
// import { LightPurpleButton } from '../components/buttonStyles';

// const Homepage = () => {
//     return (
//         <StyledContainer>
//             <Grid container spacing={0}>
//                 <Grid item xs={12} md={6}>
//                     <img src={Students} alt="students" style={{ width: '100%' }} />
//                 </Grid>
//                 <Grid item xs={12} md={6}>
//                     <StyledPaper elevation={3}>
//                         <StyledTitle>
//                             Welcome to
//                             <br />
//                             School Management
//                             <br />
//                             System
//                         </StyledTitle>
//                         <StyledText>
//                         Smart Solutions for Smarter Schools!
//                         </StyledText>
//                         <StyledBox>
//                             <StyledLink to="/choose">
//                                 <LightPurpleButton variant="contained" fullWidth>
//                                     Login
//                                 </LightPurpleButton>
//                             </StyledLink>
//                             <StyledLink to="/chooseasguest">
//                                 <Button variant="outlined" fullWidth
//                                     sx={{ mt: 2, mb: 3, color: "#7f56da", borderColor: "#7f56da" }}
//                                 >
//                                     Login as Guest
//                                 </Button>
//                             </StyledLink>
//                             <StyledText>
//                                 Don't have an account?{' '}
//                                 <Link to="/Adminregister" style={{color:"#550080"}}>
//                                     Sign up
//                                 </Link>
//                             </StyledText>
//                         </StyledBox>
//                     </StyledPaper>
//                 </Grid>
//             </Grid>
//         </StyledContainer>
//     );
// };

// export default Homepage;

// const StyledContainer = styled(Container)`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   height: 100vh;
// `;

// const StyledPaper = styled.div`
//   padding: 0 0 0 24px;
//   height: 100vh;
// `;

// const StyledBox = styled(Box)`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content:center;
//   gap: 1px;
//   padding: 10px;
// `;

// const StyledTitle = styled.h1`
//   font-size: 3rem;
//   color: #252525;
//   /* font-family: "Manrope"; */
//   font-weight: bold;
//   padding-top: 0;
//   letter-spacing: normal;
//   line-height: normal;
// `;

// const StyledText = styled.p`
//   /* color: #550080; */
//   margin-top: 30px;
//   margin-bottom: 20px; 
//   letter-spacing: normal;
//   line-height: normal;
// `;

// const StyledLink = styled(Link)`
//   text-decoration: none;
// `;
import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Grid, Box, Button } from '@mui/material';
import styled from 'styled-components';
import Students from "../assets/students.svg";
import { LightPurpleButton } from '../components/buttonStyles';

const Homepage = () => {
    return (
        <StyledContainer>
            <Grid container spacing={0} className="fullHeight">
                <Grid item xs={12} md={6} className="fullHeight">
                    <StyledImage src={Students} alt="students" />
                </Grid>
                <Grid item xs={12} md={6} className="fullHeight">
                    <StyledPaper>
                        <StyledTitle>
                            Welcome to
                            <br />
                            School Management
                            <br />
                            System
                        </StyledTitle>
                        <StyledText>
                            Smart Solutions for Smarter Schools!
                        </StyledText>
                        <StyledBox>
                            <StyledLink to="/choose">
                                <LightPurpleButton variant="contained" fullWidth>
                                    Login
                                </LightPurpleButton>
                            </StyledLink>
                            <StyledLink to="/chooseasguest">
                                <Button variant="outlined" fullWidth
                                    sx={{ mt: 2, mb: 3, color: "#7f56da", borderColor: "#7f56da" }}
                                >
                                    Login as Guest
                                </Button>
                            </StyledLink>
                            <StyledText>
                                Don't have an account?{' '}
                                <Link to="/Adminregister" style={{ color: "#550080" }}>
                                    Sign up
                                </Link>
                            </StyledText>
                        </StyledBox>
                    </StyledPaper>
                </Grid>
            </Grid>
        </StyledContainer>
    );
};

export default Homepage;

const StyledContainer = styled(Container)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  overflow: hidden; /* Prevent scrolling */
  padding: 0; /* Remove extra padding */
`;

const StyledPaper = styled.div`
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh; 
`;

const StyledBox = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 10px;
`;

const StyledTitle = styled.h1`
  font-size: 3rem;
  color: #252525;
  font-weight: bold;
  letter-spacing: normal;
  line-height: normal;
`;

const StyledText = styled.p`
  margin-top: 30px;
  margin-bottom: 20px; 
  letter-spacing: normal;
  line-height: normal;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100vh; /* Ensure the image takes full height */
  object-fit: cover; /* Ensure the image scales properly */
`;

/* Ensure Grid items take full height */
const fullHeightStyles = `
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

document.querySelectorAll('.fullHeight').forEach(el => el.style.cssText = fullHeightStyles);
