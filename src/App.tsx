import { Button, Link, Typography } from "@mui/material"
import NovelIndex from "./interfaces/NovelIndex"
import { LocalStorageKeys } from "./interfaces/Preferences";
import rawNovels from "./assets/index.json"
import React from "react";
import NovelView from "./components/NovelView";
import NovelListView from "./components/NovelListView";

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

const search = (allNovels:NovelIndex[], text: string, limit: number=30): NovelIndex[] => {
    let res: NovelIndex[] = [];
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

const filterByAuthor = (allNovels: NovelIndex[], author: string): NovelIndex[] => {
    return allNovels.filter(novel => {
        return (novel.author === author);
    });
}

const getFromLocalStorage = (key:string, defaultValue:any):any => {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : defaultValue;
}

const App = () => {
    const [allNovels, setAllNovels] = React.useState<NovelIndex[]>([]);
    const [isListView, setIsListView] = React.useState<boolean>(true);
    const [novels, setNovels] = React.useState<NovelIndex[]>([]);
    const [currentNovel, setCurrentNovel] = React.useState<NovelIndex>(novels[0]);
    const [alreadyReadSet, setAlreadyReadSet] = React.useState<Set<string>>(new Set());
    const [readLaterSet, setReadLaterSet] = React.useState<Set<string>>(new Set());
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
        setAlreadyReadSet(newReadLaterSet);
        /**
         * ランダムに本をいくつか抽出
         */
        const newNovels = search(newAllNovels, "");
        setNovels(newNovels);
    }, []);
    const show = (novel: NovelIndex) => {
        handleFinishReading(novel.id);
        setIsListView(false);
        setCurrentNovel(novel);
    }
    const handleChange = (text: string) => {
        setNovels(search(allNovels, text));
    }
    const handleClickAuthor = (novel: NovelIndex) => {
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
    }
    const handleClickReadLater = (novel: NovelIndex) => {
        let newReadLaterSet = new Set<string>(Array.from(readLaterSet));
        newReadLaterSet.add(novel.id);
        setReadLaterSet(newReadLaterSet);
        localStorage.setItem(
            LocalStorageKeys.READ_LATER_LIST,
            JSON.stringify(Array.from(newReadLaterSet))
        );
    }
    const showReadLatorList = () => {
        const newNovels = allNovels.filter(novel => {
            return (readLaterSet.has(novel.id));
        });
        setNovels(newNovels);
    } 
    if (isListView) {
        return (
            <React.Fragment>
                <Button onClick={e => showReadLatorList()}>後で読む一覧</Button>
                <NovelListView
                    novels={novels} 
                    alreadyReadSet={alreadyReadSet}
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
                <Link
                    component="button"
                    variant="body2"
                    onClick={e => handleClickToList()}>
                    <Typography>一覧</Typography>
                </Link>
                <NovelView 
                    id={currentNovel.id}
                    author={currentNovel.author}
                    title={currentNovel.title}
                />
                <Link
                    component="button"
                    variant="body2"
                    onClick={e => handleClickToList()}>
                    <Typography>一覧</Typography>
                </Link>
            </React.Fragment>
        );
    }
}

export default App
