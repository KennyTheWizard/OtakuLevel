import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { AppBar, Button, Container, InputBase, Toolbar } from '@material-ui/core';
import { Link as RouterLink, Route, useHistory } from 'react-router-dom';
import { withStyles, makeStyles, fade } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import { yellow } from '@material-ui/core/colors';
import './App.css';
import MyList from './Components/MyList';
import SearchList from './Components/SearchList';
import { searchVar } from './Components/ReactiveVars/SearchVar';
import { useState } from 'react';


const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        Page: {
          keyArgs: false,
          merge: (existing = {}, inc) => {
            console.log(existing, inc);
            for (const key in inc) {
              if (key.includes('media') && existing[key]) {
                inc[key] = [...existing[key], ...inc[key]]
              }
            }
            return inc;
          }
        },
        
      }
    },
  }
});

const client = new ApolloClient({
  uri: 'https://graphql.anilist.co',
  cache,
  connectToDevTools: true,
});

const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(yellow[500]),
    backgroundColor: yellow[500],
    '&:hover': {
      backgroundColor: yellow[700],
    },
  },
}))(Button);

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
  inputRoot: {
    color: 'inherit',
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

function App() {
  const classes = useStyles();
  const history = useHistory();
  const [search, setSearch] = useState("");
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  }

  const handleSearchEnter = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }
  const handleSearch = () => {
    console.log("Setting Search to " + search);
    if (history.location !== '/') {
      history.push('/');
    }
    if (searchVar()) {
      cache.evict({fieldName: 'Page'});
    }
    searchVar(search);
  }
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <AppBar position="sticky">
          <Toolbar>

            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                variant="outlined"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput
                }}
                inputProps={{ 'aria-label': 'search' }}
                value={search}
                onChange={handleSearchChange}
                onKeyPress={handleSearchEnter}
              />
            </div>
            <ColorButton className={classes.margin} variant="contained" color="secondary" onClick={handleSearch} >
                Search
            </ColorButton>
            <ColorButton className={classes.margin} variant="contained" color="secondary" component={RouterLink} to="/mylist">
                My List
            </ColorButton>
            
          </Toolbar>
        </AppBar>
        <Container>
          <Route exact path="/mylist" component={MyList} />
          <Route exact path="/" component={SearchList} />
        </Container>
      </div>
    </ApolloProvider>
  );
}

export default App;
