import { useQuery, gql } from '@apollo/client';
import { CircularProgress, Card, CardContent, Divider, Grid, ListItem, makeStyles, Typography, Button } from '@material-ui/core';
import { ErrorIcon } from '@material-ui/icons/Error';
import { HasRating } from '../Service/RatingService';
import AnimeRating from './AnimeRating';
import React, { useState } from 'react';

const GET_ONE_ANIME = gql`
query($id: Int) {
    Media (id: $id) {
        id
        title {
            english
            romaji
        }
        startDate {
            day
            month
            year
        }
        endDate {
            day
            month
            year
        }
        episodes
        description(asHtml: true)
        genres
        meanScore
        characters {
            nodes {
                id
                name {
                    full
                }
            }
        }
        coverImage {
            large
            medium
        }
    }
}
`

const useStyles = makeStyles((theme) => ({
    fullWidth: {
        width: '100%'
    }
}));

const dateCheck = (date) => {
    if (date.day && date.month && date.year) {
        return `${date.month}/${date.day}/${date.year}`;
    } else if (date.year) {
        return `${date.year}`
    } else {
        return "No Date Set";
    }
};

function AnimeListItem({ id }) {
    const classes = useStyles();

    const hasRating = HasRating(id);
    const [showRating, setShowRating] = useState(false);

    const toggleShow = () => {
        setShowRating(!showRating);
    }
    const variables = { id };
    const { loading, error, data } = useQuery(GET_ONE_ANIME, { variables });
    if (loading) {
        return (
            <ListItem>
                <CircularProgress />
            </ListItem>
        );
    }

    if (error) {
        return (
            <ListItem>
                <ErrorIcon />
                <p>{error}</p>
            </ListItem>
        )
    }
    
    return (
        <React.Fragment>
            <ListItem>
                <Grid container spacing={6}>
                    <Grid item xs={2}>
                        <img className={classes.fullWidth} src={data.Media.coverImage.large ? data.Media.coverImage.large : data.Media.coverImage.medium} alt=""/>
                    </Grid>
                    <Grid item container xs={10}>
                        <Grid item container xs={12} spacing={3}>
                            <Grid item xs={8}>
                                <Typography>
                                    Title: {data.Media.title.english ? data.Media.title.english : data.Media.title.romaji}
                                </Typography>
                                <Typography>
                                    Characters: {data.Media.characters.nodes.length > 0 ? data.Media.characters.nodes.map(n => n.name.full).join(', ') : 'No Characters Listed'}
                                </Typography>
                                <Typography>
                                    Genres: {data.Media.genres.join(', ')}
                                </Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography>
                                    Start Date: {dateCheck(data.Media.startDate)}
                                </Typography>
                                <Typography>
                                    End Date: {dateCheck(data.Media.endDate)}
                                </Typography>
                                <Typography>
                                    Episodes: { data.Media.episodes ? data.Media.episodes : 'No Episodes Listed'}
                                </Typography>
                                <Typography>
                                    Average Score: {data.Media.meanScore ? data.Media.meanScore : 'No Score'}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography>
                                Description:
                            </Typography>
                            <Card variant="outlined">
                                <CardContent>
                                    {
                                        data.Media.description ?
                                        <Typography dangerouslySetInnerHTML={{__html: data.Media.description}} />
                                        :
                                        <Typography>No Description</Typography>
                                    }
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Button color={hasRating ? "secondary" : "primary"} onClick={toggleShow}>
                            { hasRating ? "Show my Rating" : "Add Rating"}
                        </Button>
                    </Grid>
                    {
                        showRating &&
                        <AnimeRating id={id} />
                    }
                </Grid>
            </ListItem>
            <Divider />
        </React.Fragment>
    )
}

export default AnimeListItem;