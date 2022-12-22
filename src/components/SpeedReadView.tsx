import { Button, ListItemText, Typography } from "@mui/material";
import React from "react";

const split = (text: string, maxChars: number): string[] => {
    let res: string[] = [];
    text.trim().split("\n").map(t => {
        if (t.length === 0) {
            res.push("");
            return;
        }
        const n = t.length;
        for (let i = 0; i < n; i += maxChars) {
            res.push(t.slice(i, i+maxChars));
        }
    });
    return res;
}
interface Props {
    id: string;
    author: string;
    title: string;
    alreadyRead: boolean;
    done: () => void;
}
const SpeedReadView = (props: Props) => {
    const [index, setIndex] = React.useState<number>(0);
    const [lines, setLines] = React.useState<string[]>([""]);
    const [delay, setDelay] = React.useState<number>(120);
    const [reading, setReading] = React.useState<boolean>(false);
    const maxChars = 7;
    const cpm = (1000 / delay) * 60 * maxChars;
    React.useEffect(() => {
        // 本文の取得
        const url = "https://raw.githubusercontent.com/taroy5913/abd/master/f/" + props.id;
        fetch(url)
            .then(response => response.text())
            .then(data => {
                setLines(split(data, maxChars));
                setIndex(0);
            });
    }, []);
    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (reading) {
                if (index + 1 === lines.length) {
                    // 読了
                    setReading(false);
                    props.done();
                } else if (index + 1 < lines.length) {
                    setIndex(index + 1);
                }
            }
        }, delay);
        return () => {
            clearTimeout(timer);
        }
    }, [index, delay, reading]);
    return (
        <React.Fragment>
            <ListItemText
                primary={props.title}
                secondary={props.author}
            />
            <Typography variant="h2" color="gray">{lines[index-1]}　</Typography>
            <Typography variant="h2">{lines[index]}　</Typography>
            <Typography variant="h2" color="gray">{lines[index+1]}　</Typography>
            <Typography>{Math.floor((100 * (index+1) / lines.length))}%({index+1} / {lines.length})</Typography>
            <Button onClick={e => setDelay(1.1 * delay)}>ゆっくり</Button>
            <Button onClick={e => setDelay(0.9 * delay)}>はやく</Button>
            <Button onClick={e => setReading(!reading)}>{reading ? "ストップ" : "スタート"}</Button>
            <Typography>{Math.floor(cpm)}文字 / 分</Typography>
            <Button onClick={e => props.done()}>既読にする</Button>
        </React.Fragment>
    );
}
export default SpeedReadView;