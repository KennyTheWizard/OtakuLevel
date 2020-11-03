import { useEffect, useState } from "react";
import { GetList } from "../Service/RatingService";
import AnimeList from "./AnimeList";

function MyList() {

    const [list, setList] = useState([]);
    useEffect(() => {
        setList(GetList());
    }, []);

    return (
        <AnimeList list={list.map(val => ({id: val}))} />
    )
};

export default MyList;