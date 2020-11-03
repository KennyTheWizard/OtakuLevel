import { Button, Grid, makeStyles, TextField } from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import { useEffect, useState } from "react";
import { GetRating, RemoveRating, SetRating } from "../Service/RatingService";


const useStyles = makeStyles((theme) => ({
    margin: {
      margin: theme.spacing(1),
    },
}));

function AnimeRating({ id }) {
    const [rating, setCurrRating] = useState(0);
    const [review, setReview] = useState("");
    const classes = useStyles();
    useEffect(() => {
        const myReview = GetRating(id);
        if (myReview) {
            setCurrRating(myReview.rating);
            setReview(myReview.review);
        }
    }, [id]);

    const saveRating = () => {
        const myReview = {
            rating,
            review,
        };
        SetRating(id, myReview);
        alert("Rating Saved");
    }

    const clearRating = () => {
        RemoveRating(id);
        setCurrRating(0);
        setReview("");
        alert("Rating Deleted");
    }

    return (
        <Grid container item xs={12} spacing={3}>
            <Grid item xs={6} sm={2}>
                <Rating
                    name="simple-controlled"
                    value={rating}
                    onChange={(e, nv) => setCurrRating(nv)}
                />
            </Grid>
            <Grid item xs={6} sm={10}>
                <TextField
                    multiline
                    fullWidth
                    variant="outlined"
                    name="Review"
                    type="textarea"
                    rows={3}
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    label="Review"
                />
            </Grid>
            <Grid item xs={12}>
                <Button className={classes.margin} color="primary" variant="contained" onClick={saveRating}>Save Rating</Button>
                <Button className={classes.margin} color="secondary" variant="contained" onClick={clearRating}>Delete Rating</Button>
            </Grid>
        </Grid>
    );
}

export default AnimeRating;