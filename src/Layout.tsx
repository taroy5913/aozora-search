import { AppBar, Container, createTheme, CssBaseline, ThemeProvider, Toolbar, Typography } from "@mui/material"
import App from "./App";

const Layout = () => {
    const theme = createTheme({
        typography: {
            fontSize: 12
        },
        palette: {
            mode: "dark"
        }
    });
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar
                position="absolute"
                color="default"
                elevation={0}
                sx={{
                    position: "relative",
                    borderBottom: (t) => `1px solid $(t.palette.divider)`
                }}
            >
                <Toolbar>
                    <Typography variant="h6" color="inherit">青空探索</Typography>
                </Toolbar>
            </AppBar>
            <Container component="main" maxWidth="sm" sx={{ mb: 4}}>
                <App />
            </Container>
        </ThemeProvider>
    );
}

export default Layout;
