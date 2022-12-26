import { Box, Button, Grid, Link, Paper, TextField, Typography } from "@mui/material";
import React from "react";
import NovelIndex from "../interfaces/NovelIndex";
import StarIcon from '@mui/icons-material/Star';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';

interface Props {
    novels: NovelIndex[];
    alreadyReadSet: Set<string>;
    readLaterSet: Set<string>;
    onTextChange: (text:string) => void;
    onTitleClick: (novel: NovelIndex) => void;
    onAuthorClick: (novel: NovelIndex) => void;
    onClickReadLater: (novel: NovelIndex) => void;
}
const NovelListView = (props: Props) => {
    const handleClickTitle = (novel: NovelIndex) => {
        props.onTitleClick(novel);
    }
    const handleClickAuthor = (novel: NovelIndex) => {
        window.scroll(0, 0);
        props.onAuthorClick(novel);
    }
    const handleClickReadLater = (novel: NovelIndex) => {
        props.onClickReadLater(novel);
    }
    return (
        <React.Fragment>
            {props.novels.map((novel: NovelIndex) => {
                return (
                    <Paper key={"novel-"+novel.id} variant="outlined" sx={{ my: {xs: 3, md: 6}, p: {xs: 1, md: 1}}}>
                        <Grid container>
                            <Grid item xs={6}>
                                <Button variant="text" onClick={e => handleClickTitle(novel)}>
                                    <Typography
                                        variant="subtitle1"
                                        color="primary">
                                        {novel.title}
                                    </Typography>
                                </Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Box display="flex" justifyContent="flex-end">
                                    <Button
                                        variant="text"
                                        size="small"
                                        color="success"
                                        onClick={e => handleClickAuthor(novel)}>
                                        <Typography
                                            variant="subtitle2"
                                            align="right">
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
                        </Grid>
                        <Grid container>
                            <Grid item xs={2}>
                                {
                                    props.alreadyReadSet.has(novel.id)
                                        ? <Typography variant="caption">既読</Typography>
                                        : null
                                }
                            </Grid>
                            <Grid item xs={6}></Grid>
                            <Grid item xs={4}>
                                <Box display="flex" justifyContent="flex-end">
                                    <Button
                                        variant="text"
                                        size="small"
                                        startIcon={
                                            props.readLaterSet.has(novel.id)
                                                ? <StarIcon />
                                                : <StarBorderOutlinedIcon />
                                        }
                                        onClick={e => handleClickReadLater(novel)}>
                                        後で読む
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                );
            })}
        </React.Fragment>
    );
}
export default NovelListView;