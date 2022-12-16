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
            <Container component="main" maxWidth="sm" sx={{ mb: 4}}>
                <App />
            </Container>
        </ThemeProvider>
    );
}

export default Layout;
