import { Link, ListItemText, Typography } from "@mui/material";
import React from "react";

interface Props {
    id: string;
    author: string;
    title: string;
}
const NovelView = (props: Props) => {
    const [text, setText] = React.useState<string>("");
    React.useEffect(() => {
        const url = "https://raw.githubusercontent.com/taroy5913/abd/master/f/" + props.id;
        fetch(url)
            .then(response => response.text())
            .then(data => setText(data));
    }, []);
    return (
        <React.Fragment>
            <ListItemText
                primary={props.title}
                secondary={props.author}
            />
            {text.split("\n").map(
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
export default NovelView;