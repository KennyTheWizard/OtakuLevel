import { gql, useQuery, useReactiveVar } from '@apollo/client';
import { Button, Grid } from '@material-ui/core';
import { useEffect, useState } from 'react';
import AnimeList from './AnimeList';
import { searchVar } from './ReactiveVars/SearchVar';

export const GET_ANIME = gql`
query ($id: Int, $page: Int, $perPage: Int, $search: String) {
    Page (page: $page, perPage: $perPage) {
        pageInfo {
            total
            currentPage
            lastPage
            hasNextPage
            perPage
        }
        media (id: $id, search: $search, isAdult: false) {
            id
            title {
            english
            }
        }
    }
}
`;

function SearchList() {

    const searchItem = useReactiveVar(searchVar);
    const [variables, setVariables] = useState({
        page: 1,
        perPage: 10,
    });

    useEffect(() => {
        setVariables({page: 1, perPage: 10});
    }, [searchItem]);

    const { loading, error, data, fetchMore } = useQuery(GET_ANIME, {
        variables: {
            search: searchItem ? searchItem : undefined,
            ...variables,
        }
    });


    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;
    
    const loadMore = () => {
        console.log("Next Set");
        variables.page++;
        fetchMore(
            { 
                variables: {
                    search: searchItem ? searchItem : undefined,
                    ...variables,
                } 
            },
            
        );
        setVariables(variables);
    }

    return (
        <Grid item container>
            <Grid item xs={12}>
                <AnimeList list={data?.Page?.media} />
            </Grid>
            <Grid item xs={12}>
                <Button onClick={loadMore}>Load More</Button>
            </Grid>
        </Grid>            
    );
};

export default SearchList;