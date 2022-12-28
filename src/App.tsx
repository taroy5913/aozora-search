import { Box, Button, Grid, Link, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material"
import NovelIndex from "./interfaces/NovelIndex"
import { LocalStorageKeys } from "./interfaces/Preferences";
import rawNovels from "./assets/index.json"
import React from "react";
import NovelView from "./components/NovelView";
import NovelListView from "./components/NovelListView";

/**
 * JSONファイルで保存している青空文庫の索引をパース
 * @returns 
 */
const prepare = (): NovelIndex[] => {
    return (rawNovels as {
        id: string;
        author: string;
        title: string;
        text: string;
    }[]).map(novel => {
        return {
            id: novel.id,
            author: novel.author || "",
            translator: "",
            title: novel.title || "",
            text: (novel.text || "").trim()
        }
    });
}

const search = (
    allNovels:NovelIndex[],
    readLaterSet: Set<string>,
    text: string,
    useMyLibrary: boolean,
    limit: number=30
): NovelIndex[] => {
    let res: NovelIndex[] = [];
    console.log("search", text);
    let targets = allNovels;
    if (useMyLibrary) {
        targets = targets.filter(t => readLaterSet.has(t.id));
    } else if (text.length === 0) {
        // TODO: show popular novels
        for (let i = 0; i < limit; ++i) {
            res.push(allNovels[Math.floor(Math.random() * allNovels.length)]);
        }
        return res;
    }
    return targets.filter(novel => {
        if (novel.title.includes(text)) {
            return true;
        }
        if (novel.author.includes(text)) {
            return true;
        }
        return false;
    }).slice(0, limit);
}

const filterByAuthor = (allNovels: NovelIndex[], author: string): NovelIndex[] => {
    return allNovels.filter(novel => {
        return (novel.author === author);
    });
}

const getFromLocalStorage = (key:string, defaultValue:any):any => {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : defaultValue;
}

interface History {
    novelId: string;
    title: string;
    author: string;
    createdAt: string; // YYYY/MM/DD HH:MM:SS
}

const App = () => {
    const [query, setQuery] = React.useState<string>("");
    const [allNovels, setAllNovels] = React.useState<NovelIndex[]>([]);
    const [isListView, setIsListView] = React.useState<boolean>(true);
    const [novels, setNovels] = React.useState<NovelIndex[]>([]);
    const [currentNovel, setCurrentNovel] = React.useState<NovelIndex>(novels[0]);
    const [alreadyReadSet, setAlreadyReadSet] = React.useState<Set<string>>(new Set());
    const [readLaterSet, setReadLaterSet] = React.useState<Set<string>>(new Set());
    const [useMyLibrary, setUseMyLibrary] = React.useState<boolean>(false);
    const [useHistory, setUseHistory] = React.useState<boolean>(false);
    const [historyList, setHistoryList] = React.useState<History[]>([]);
    React.useEffect(() => {
        /**
         * 青空文庫の全インデックスを取得
         */
        let newAllNovels = prepare();
        setAllNovels(newAllNovels);
        /**
         * 既読リスト取得
         */
        const newAlreadyReadSet = new Set<string>(
            getFromLocalStorage(LocalStorageKeys.ALREADY_READ_LIST, [])
        );
        console.log("既読リスト", newAlreadyReadSet);
        setAlreadyReadSet(newAlreadyReadSet);
        /**
         * 後で読むリスト取得
         */
        const newReadLaterSet = new Set<string>(
            getFromLocalStorage(LocalStorageKeys.READ_LATER_LIST, [])
        );
        setReadLaterSet(newReadLaterSet);
        /**
         * ランダムに本をいくつか抽出
         */
        const newNovels = search(newAllNovels, readLaterSet, "", useMyLibrary);
        setNovels(newNovels);
        /**
         * 履歴の取得
         */
        const newHistoryList = getFromLocalStorage(LocalStorageKeys.HISTORY_LIST, []);
        setHistoryList(newHistoryList);
    }, []);
    const show = (novel: NovelIndex) => {
        handleFinishReading(novel.id);
        setIsListView(false);
        setUseHistory(false);
        setCurrentNovel(novel);
        const newHistoryList = [{
            novelId: novel.id,
            author: novel.author,
            title: novel.title,
            createdAt: (new Date()).toLocaleString()
        }].concat(historyList).slice(0, 100);
        setHistoryList(newHistoryList);
        localStorage.setItem(
            LocalStorageKeys.HISTORY_LIST,
            JSON.stringify(newHistoryList)
        );
    }
    const handleChange = (text: string) => {
        setQuery(text);
        setNovels(search(allNovels, readLaterSet, text, useMyLibrary));
    }
    const handleClickAuthor = (novel: NovelIndex) => {
        setQuery(novel.author);
        setNovels(filterByAuthor(allNovels, novel.author));
    }
    const handleFinishReading = (id: string) => {
        let newAlreadyReadSet = new Set<string>(Array.from(alreadyReadSet));
        newAlreadyReadSet.add(id);
        setAlreadyReadSet(newAlreadyReadSet);
        localStorage.setItem(
            LocalStorageKeys.ALREADY_READ_LIST,
            JSON.stringify(Array.from(newAlreadyReadSet))
        );
    }
    const handleClickToList = () => {
        // 画面上部へ移動
        window.scroll(0, 0);
        // 一覧の表示
        setIsListView(true);
        setUseHistory(false);
    }
    /**
     * 後で読むを押したときの処理
     * 
     * リストにないなら追加、あるなら除外
     */
    const handleClickReadLater = (novel: NovelIndex) => {
        let newReadLaterSet = new Set<string>(Array.from(readLaterSet));
        if (newReadLaterSet.has(novel.id)) {
            newReadLaterSet.delete(novel.id);
        } else {
            newReadLaterSet.add(novel.id);
        }
        setReadLaterSet(newReadLaterSet);
        localStorage.setItem(
            LocalStorageKeys.READ_LATER_LIST,
            JSON.stringify(Array.from(newReadLaterSet))
        );
    }
    const showReadLatorList = () => {
        const newUseMyLibrary = !useMyLibrary;
        setUseMyLibrary(newUseMyLibrary);
        const newNovels = search(allNovels, readLaterSet, query, newUseMyLibrary);
        setNovels(newNovels);
    }
    if (useHistory) {
        return (
            <React.Fragment>
                <Button
                    color="primary"
                    variant="text"
                    onClick={e => handleClickToList()}>
                    <Typography>一覧</Typography>
                </Button>
                <TableContainer component={Paper}>
                    <Table size="small">
                        <TableBody>
                            {historyList.map((history, i) => {
                                return (
                                    <TableRow key={"history-" + i}>
                                        <TableCell><Typography variant="caption">{history.createdAt}</Typography></TableCell>
                                        <TableCell>
                                            <Button
                                                variant="text"
                                                onClick={e => show({
                                                    id: history.novelId,
                                                    author: history.author,
                                                    title: history.title,
                                                    text: "",
                                                    translator: "",
                                                })}
                                                >{history.title}</Button>
                                        </TableCell>
                                        <TableCell>{history.author}</TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Button
                    color="primary"
                    variant="text"
                    onClick={e => handleClickToList()}>
                    <Typography>一覧</Typography>
                </Button>
            </React.Fragment>
        );
    } else if (isListView) {
        return (
            <React.Fragment>
                <Grid container>
                    <Grid item xs={6}>
                        <TextField
                            placeholder="検索"
                            value={query}
                            onChange={e => handleChange(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <Button
                            onClick={e => setUseHistory(!useHistory)}
                        >
                            履歴
                        </Button>
                    </Grid>                    
                    <Grid item xs={3}>
                        <Box display="flex" justifyContent="flex-end">
                            <Button
                                variant={useMyLibrary ? "contained" : "outlined"}
                                onClick={e => showReadLatorList()}>
                                後で読む
                            </Button>
                        </Box>
                    </Grid>
                </Grid>

                <NovelListView
                    novels={novels} 
                    alreadyReadSet={alreadyReadSet}
                    readLaterSet={readLaterSet}
                    onAuthorClick={novel => handleClickAuthor(novel)}
                    onTextChange={text => handleChange(text)}
                    onTitleClick={novel => show(novel)}
                    onClickReadLater={novel => handleClickReadLater(novel)}
                />
            </React.Fragment>
        );
    } else {
        return (
            <React.Fragment>
                <Button
                    color="primary"
                    variant="text"
                    onClick={e => handleClickToList()}>
                    <Typography>一覧</Typography>
                </Button>
                <NovelView 
                    id={currentNovel.id}
                    author={currentNovel.author}
                    title={currentNovel.title}
                />
                <Button
                    color="primary"
                    variant="text"
                    onClick={e => handleClickToList()}>
                    <Typography>一覧</Typography>
                </Button>
            </React.Fragment>
        );
    }
}

export default App
