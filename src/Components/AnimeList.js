import { List } from "@material-ui/core";
import AnimeListItem from './AnimeListItem';

function AnimeList({ list }) {
    return (
        <List>
            {
                list?.map(val => <AnimeListItem key={val.id} id={val.id} />)
            }
        </List>
    )
}

export default AnimeList;