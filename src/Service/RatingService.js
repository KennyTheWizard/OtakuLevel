export const HasRating = (animeId) => {
    return localStorage.getItem(`Anime-${animeId}`) !== null;
}

export const GetRating = (animeId) => {
    return JSON.parse(localStorage.getItem(`Anime-${animeId}`));
}

export const SetRating = (animeId, rating) => {
    localStorage.setItem(`Anime-${animeId}`, JSON.stringify(rating));
    const list = localStorage.getItem('Anime-List');
    if (list) {
        const listArr = JSON.parse(list);
        if (!listArr.find(a => a === animeId)) {
            listArr.push(animeId);
        }
        localStorage.setItem('Anime-List', JSON.stringify(listArr));
    } else {
        localStorage.setItem('Anime-List', JSON.stringify([animeId]));
    }
}

export const RemoveRating = (animeId) => {
    localStorage.removeItem(`Anime-${animeId}`);
    const list = localStorage.getItem('Anime-List');
    if (list) {
        const listArr = JSON.parse(list);
        const index = listArr.findIndex(a => a === animeId);
        if (index >= 0) {
            listArr.splice(index, 1);
        }
        localStorage.setItem('Anime-List', JSON.stringify(listArr));
    }
}

export const GetList = () => {
    const list = localStorage.getItem('Anime-List');
    if (list) {
        return JSON.parse(list);
    }
    else {
        return [];
    }
}