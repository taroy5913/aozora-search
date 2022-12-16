import { Grid, Link, ListItemText, Paper, Typography } from "@mui/material"
import Novel from "./interfaces/Novel"
import rawNovels from "./assets/sample_novels.json"
import React from "react";
import TextField from "@mui/material/TextField";
const allNovels = rawNovels as Novel[];

const search = (text: string, limit: number=30): Novel[] => {
    if (text.length === 0) {
        // TODO: show popular novels
        return allNovels.slice(0, limit);
    }
    const keywords = text.replace("　", " ").split(" ");
    return allNovels.filter(novel => {
        for (let keyword of keywords) {
            if (novel.title.includes(text)) {
                return true;
            }
            if (novel.author.includes(text)) {
                return true;
            }
        }
        return false;
    }).slice(0, limit);
}

const App = () => {
    const [isListView, setIsListView] = React.useState<boolean>(true);
    const [query, setQuery] = React.useState<string>("");
    const [novels, setNovels] = React.useState<Novel[]>(search(query));
    const [currentNovel, setCurrentNovel] = React.useState<Novel>(novels[0]);
    const show = (novel: Novel) => {
        setIsListView(false);
        setCurrentNovel(novel);
    }
    const handleChange = (text: string) => {
        setQuery(text);
        setNovels(search(text));
    }
    if (isListView) {
        return (
            <React.Fragment>
                <TextField
                    placeholder="検索"
                    value={query}
                    onChange={e => handleChange(e.target.value)}
                />
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
                                        {novel.text.substring(0, 100) + "..."}
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
