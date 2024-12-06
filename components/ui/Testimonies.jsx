import { Box, Typography, Grid, Card, CardContent } from "@mui/material";

const Testimonies = () => {
  return (
    <Box sx={{ p: 2, mb: 5 }}>
      {/* Why Choose Us Section */}
      <Box sx={{ textAlign: "center", my: 5 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 5 }}>
          Why Choose Us?
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {[
            {
              title: "Fast Delivery",
              description: "Get furniture delivered to your doorstep quickly.",
            },
            {
              title: "Flexible Rentals",
              description: "Choose rental plans that suit your needs.",
            },
            {
              title: "Quality Products",
              description: "High-quality furniture for every space.",
            },
            {
              title: "Easy Returns",
              description: "Hassle-free return process.",
            },
          ].map((item, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={3}
              key={index}
              sx={{ display: "flex" }}
            >
              <Card
                sx={{
                  p: 2,
                  textAlign: "center",
                  boxShadow: 3,
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography variant="h6" component="div">
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* What Our Customers Say Section */}
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 5 }}>
          What Our Customers Say
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {[
            {
              name: "John Doe",
              testimony:
                "Great service and quality furniture. Highly recommend!",
            },
            {
              name: "Jane Smith",
              testimony:
                "Flexible rental plans made furnishing my apartment easy.",
            },
            {
              name: "Michael Johnson",
              testimony: "Delivery was fast and the process was seamless.",
            },
          ].map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ p: 1, boxShadow: 3 }}>
                <CardContent>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontStyle: "italic" }}
                  >
                    "{item.testimony}"
                  </Typography>
                  <Typography variant="subtitle2" sx={{ mt: 1 }}>
                    - {item.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Testimonies;
