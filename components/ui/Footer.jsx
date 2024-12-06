import { Box, Typography, Container } from "@mui/material";

const Footer = () => {
  return (
    <Box sx={{ py: 4, color: "primary" }}>
    <Container>
        <Typography variant="body2" textAlign="center">
        &copy; {new Date().getFullYear()} FlexiFurnish. All Rights Reserved.
        </Typography>
    </Container>
    </Box>
  );
};

export default Footer;
