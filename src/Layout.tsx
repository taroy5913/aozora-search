import { Container, createTheme, CssBaseline, ThemeProvider } from "@mui/material"

const App = () => {
    const theme = createTheme({
        typography: {
            fontSize: 12
        },
        palette: {
            mode: "light"
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

export default App
