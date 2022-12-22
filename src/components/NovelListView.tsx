import { Box, Button, Grid, Link, Paper, TextField, Typography } from "@mui/material";
import React from "react";
import Novel from "../interfaces/Novel";

interface Props {
    novels: Novel[];
    onTextChange: (text:string) => void;
    onTitleClick: (novel: Novel) => void;
    onAuthorClick: (novel: Novel) => void;
}
const NovelListView = (props: Props) => {
    const [query, setQuery] = React.useState<string>("");
    const handleTextChange = (text: string) => {
        setQuery(text);
        props.onTextChange(text);
    }
    const handleClickTitle = (novel: Novel) => {
        props.onTitleClick(novel);
    }
    const handleClickAuthor = (novel: Novel) => {
        setQuery(novel.author);
        props.onAuthorClick(novel);
    }
    return (
        <React.Fragment>
            <TextField
                placeholder="検索"
                value={query}
                onChange={e => handleTextChange(e.target.value)}
            />
            {props.novels.map((novel: Novel) => {
                return (
                    <Paper key={"novel-"+novel.id} variant="outlined" sx={{ my: {xs: 3, md: 6}, p: {xs: 1, md: 1}}}>
                        <Grid container>
                            <Grid item xs={6}>
                                <Link onClick={e => handleClickTitle(novel)}>
                                    <Typography
                                        variant="subtitle1"
                                        color="primary"
                                    >
                                        {novel.title}
                                    </Typography>
                                </Link>
                            </Grid>
                            <Grid item xs={6}>
                                <Box display="flex" justifyContent="flex-end">
                                    <Button
                                        variant="text"
                                        size="small"
                                        onClick={e => handleClickAuthor(novel)}
                                    >
                                        <Typography
                                            variant="subtitle1"
                                            align="right"
                                        >
                                            {novel.author}
                                        </Typography>
                                    </Button>
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="caption">
                                    {novel.text + "..."}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                {
                                    novel.alreadyRead 
                                    ? <Button variant="outlined" size="small">既読</Button>
                                    : null
                                }
                            </Grid>
                        </Grid>
                    </Paper>
                );
            })}
        </React.Fragment>
    );
}
export default NovelListView;