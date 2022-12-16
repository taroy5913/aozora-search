import { Button, Container, createTheme, CssBaseline, Grid, Paper, ThemeProvider, Typography } from "@mui/material"
import Novel from "./interfaces/Novel"
import rawNovels from "./assets/sample_novels.json"
import React from "react";

const App = () => {
    const theme = createTheme({
        typography: {
            fontSize: 12
        },
        palette: {
            mode: "light"
        }
    });
    const [novels, setNovels] = React.useState<Novel[]>(rawNovels as Novel[]);
    React.useEffect(() => {
        fetch("./assets/sample_novels.json")
            .then(res => res.json())
            .then(newNovels => setNovels(newNovels));
    }, []);
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container component="main" maxWidth="sm" sx={{ mb: 4}}>
            {novels.map(novel => {
                return (
                    <Paper variant="outlined" sx={{ my: {xs: 3, md: 6}, p: {xs: 1, md: 1}}}>
                        <Grid container>
                            <Grid item xs={6} >
                                <Typography variant="subtitle1" color="primary">{novel.title}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="subtitle1" align="right">{novel.author}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="caption">
                                    {novel.text.substring(0, 120) + "..."}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                );
            })}
            </Container>
        </ThemeProvider>
    )
}

export default App
