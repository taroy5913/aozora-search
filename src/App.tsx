import { Link, Typography } from "@mui/material"
import Novel from "./interfaces/Novel"
import rawNovels from "./assets/index.json"
import React from "react";
import NovelView from "./components/NovelView";
import SpeedReadView from "./components/SpeedReadView";
import { LocalStorageKeys } from "./interfaces/Preferences";
import NovelListView from "./components/NovelListView";

const allNovels: Novel[] = (rawNovels as any[]).map(novel => {
    return {
        id: novel.id,
        author: novel.author || "",
        translator: novel.translator || "",
        title: novel.title || "",
        text: novel.text || "",
        alreadyRead: false,
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
        setNovels(search(text));
    }
    const handleClickAuthor = (novel: Novel) => {
        setNovels(filterByAuthor(novel.author));
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
        return <NovelListView
            novels={novels} 
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
                    onClick={e => setIsListView(true)}
                >
                    <Typography>一覧</Typography>
                </Link>
                {
                    isSpeedReading
                        ? (<SpeedReadView
                            id={currentNovel.id}
                            author={currentNovel.author}
                            title={currentNovel.title}
                            alreadyRead={currentNovel.id in alreadyReadSet}
                            done={() => handleFinishReading(currentNovel.id)}
                        />)
                        : (<NovelView 
                            id={currentNovel.id}
                            author={currentNovel.author}
                            title={currentNovel.title}
                        />)
                }
            </React.Fragment>
        );
    }
}

export default App
