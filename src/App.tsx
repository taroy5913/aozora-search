import { Box, Button, Grid, Link, Paper, Typography } from "@mui/material"
import Novel from "./interfaces/Novel"
import novelMetaList from "./assets/index.json"
import React from "react";
import TextField from "@mui/material/TextField";
import NovelView from "./components/NovelView";
import SpeedReadView from "./components/SpeedReadView";
import { LocalStorageKeys } from "./interfaces/Preferences";

const allNovels: Novel[] = (novelMetaList as any[]).map(novel => {
    return {
        id: novel.id,
        card_id: novel.card_id,
        author: novel.author || "",
        translator: novel.translator || "",
        title: novel.title || "",
        text: novel.text || "",
        info: "",
        after_text: "",
    }
});

const search = (text: string, limit: number=30): Novel[] => {
    let res: Novel[] = [];
    if (text.length === 0) {
        // TODO: show popular novels
        for (let i = 0; i < limit; ++i) {
            res.push(allNovels[Math.floor(Math.random() * allNovels.length)]);
        }
        return res;
    }
    console.log("search", text);
    return allNovels.filter(novel => {
        if (novel.title.includes(text)) {
            return true;
        }
        if (novel.author.includes(text)) {
            return true;
        }
        return false;
    }).slice(0, limit);
}

const filterByAuthor = (author: string): Novel[] => {
    return allNovels.filter(novel => {
        return (novel.author === author);
    });
}

const App = () => {
    const [isListView, setIsListView] = React.useState<boolean>(true);
    const [isSpeedReading, setIsSpeedReading] = React.useState<boolean>(true);
    const [query, setQuery] = React.useState<string>("");
    const [novels, setNovels] = React.useState<Novel[]>([]);
    const [currentNovel, setCurrentNovel] = React.useState<Novel>(novels[0]);
    const [alreadyReadSet, setAlreadyReadSet] = React.useState<Set<string>>(new Set());
    React.useEffect(() => {
        setNovels(search(""));
        // 既読リスト取得
        const newAlreadyReadList = JSON.parse(
            localStorage.getItem(LocalStorageKeys.ALREADY_READ_LIST) || "[]"
        );
        const newAlreadyReadSet = new Set<string>(newAlreadyReadList);
        console.log("既読リスト", newAlreadyReadSet);
        setAlreadyReadSet(newAlreadyReadSet);
    }, []);
    const show = (novel: Novel) => {
        setIsListView(false);
        setCurrentNovel(novel);
    }
    const handleChange = (text: string) => {
        setQuery(text);
        setNovels(search(text));
    }
    const handleClickAuthor = (author: string) => {
        setQuery(author);
        setNovels(filterByAuthor(author));
    }
    const handleFinishReading = (id: string) => {
        alreadyReadSet.add(id);
        console.log(alreadyReadSet);
        localStorage.setItem(
            LocalStorageKeys.ALREADY_READ_LIST,
            JSON.stringify(Array.from(alreadyReadSet))
        );
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
                        <Paper key={"novel-"+novel.id} variant="outlined" sx={{ my: {xs: 3, md: 6}, p: {xs: 1, md: 1}}}>
                            <Grid container>
                                <Grid item xs={6}>
                                    <Link onClick={e => show(novel)}>
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
                                            onClick={e => handleClickAuthor(novel.author)}
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
                                        alreadyReadSet.has(novel.id) 
                                        ? <Button variant="outlined" size="small">既読</Button>
                                        : ""
                                    }
                                </Grid>
                            </Grid>
                        </Paper>
                    );
                })}
            </React.Fragment>
        );
    } else {
        if (isSpeedReading) {
            return (
                <React.Fragment>
                    <Link
                        component="button"
                        variant="body2"
                        onClick={e => setIsListView(true)}
                    >
                        <Typography>一覧</Typography>
                    </Link>
                    <SpeedReadView
                        id={currentNovel.id}
                        author={currentNovel.author}
                        title={currentNovel.title}
                        alreadyRead={currentNovel.id in alreadyReadSet}
                        done={() => handleFinishReading(currentNovel.id)}
                    />
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
                    <NovelView 
                        id={currentNovel.id}
                        author={currentNovel.author}
                        title={currentNovel.title}
                    />
                </React.Fragment>
            ); 
        }
    }
}

export default App
