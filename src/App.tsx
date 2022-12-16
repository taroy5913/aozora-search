import { Divider, Grid, Link, ListItemText, Paper, Typography } from "@mui/material"
import Novel from "./interfaces/Novel"
import rawNovels from "./assets/sample_novels.json"
import React from "react";

const App = () => {
    const [isListView, setIsListView] = React.useState<boolean>(true);
    const [novels, setNovels] = React.useState<Novel[]>(rawNovels as Novel[]);
    const [currentNovel, setCurrentNovel] = React.useState<Novel>(novels[0]);
    const show = (novel: Novel) => {
        setIsListView(false);
        setCurrentNovel(novel);
    }
    if (isListView) {
        return (
            <React.Fragment>
                {novels.map((novel: Novel) => {
                    return (
                        <Paper variant="outlined" sx={{ my: {xs: 3, md: 6}, p: {xs: 1, md: 1}}}>
                            <Grid container>
                                <Grid item xs={6}>
                                    <Link onClick={e => show(novel)}>
                                        <Typography
                                            variant="subtitle1"
                                            color="primary"
                                        >{novel.title}</Typography>
                                    </Link>
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
            </React.Fragment>
        );
    } else {
        return (
            <React.Fragment>
                <Link
                    component="button"
                    variant="body2"
                    onClick={e => setIsListView(true)}
                >
                    <Typography>一覧</Typography>
                </Link>
                <ListItemText
                    primary={currentNovel.title}
                    secondary={currentNovel.author}
                />
                {currentNovel.text.split("\n").map(
                    t => (
                        <React.Fragment>
                            <Typography variant="body2">{t}</Typography>
                            <br />
                        </React.Fragment>
                    )
                )}
            </React.Fragment>
        );
    }
}

export default App
