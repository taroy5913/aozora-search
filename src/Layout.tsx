import { Container, createTheme, CssBaseline, ThemeProvider } from "@mui/material"
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
            <Container component="main" maxWidth="sm" sx={{ mb: 2}}>
                <App />
            </Container>
        </ThemeProvider>
    );
}

export default Layout;
