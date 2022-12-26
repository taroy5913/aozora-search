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
    React.useEffect(() => {
        /**
         * 青空文庫の全インデックスを取得
         */
        let newAllNovels = prepare();
        setAllNovels(newAllNovels);
        /**
         * 既読リスト取得
         */
        const newAlreadyReadList = getFromLocalStorage(LocalStorageKeys.ALREADY_READ_LIST, []);
        const newAlreadyReadSet = new Set<string>(newAlreadyReadList);
        console.log("既読リスト", newAlreadyReadSet);
        setAlreadyReadSet(newAlreadyReadSet);
        
        const newNovels = search(newAllNovels, "");
        setNovels(newNovels);
    }, []);
    const show = (novel: NovelIndex) => {
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
        console.log(newAlreadyReadSet);
        localStorage.setItem(
            LocalStorageKeys.ALREADY_READ_LIST,
            JSON.stringify(Array.from(newAlreadyReadSet))
        );

    }
    if (isListView) {
        return <NovelListView
                novels={novels} 
                alreadyReadSet={alreadyReadSet}
                onAuthorClick={novel => handleClickAuthor(novel)}
                onTextChange={text => handleChange(text)}
                onTitleClick={novel => show(novel)}
            />
    } else {
        return (
            <React.Fragment>
                <Link
                    component="button"
                    variant="body2"
                    onClick={e => setIsListView(true)}>
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
                    onClick={e => setIsListView(true)}>
                    <Typography>一覧</Typography>
                </Link>
                <Button
                    onClick={e => handleFinishReading(currentNovel.id)}>
                    <Typography>既読にする</Typography>
                </Button>
            </React.Fragment>
        );
    }
}

export default App
