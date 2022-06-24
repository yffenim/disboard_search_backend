import React, {useState} from 'react'
// import { useHistory } from 'react-router-dom';

// https://www.emgoto.com/react-search-bar/

export const SearchBar = ({ searchQuery, setSearchQuery }) => { 
  // const [searchInput, setSearchInput] = useState(""); 
  // const history = useHistory();
  const url = 'http://localhost:3333/add';

  const handleSubmit = (e) => {
    console.log("clicked!");
    e.preventDefault();
    
    fetch(url,{
      method: 'POST',
      body: JSON.stringify({
        tag1: "hello",
        tag2: "world"
      }),
      headers: {"Content-Type": "application/json"}
    })
    .then(function(response){
      return response.json()
    })
    .then(function(body){
      console.log(body);
    });
  };

  return (
    <form
            action="/"
            method="get"
            autoComplete="off"
            onSubmit={handleSubmit}
        >
            <label htmlFor="header-search">
                <span className="visually-/posthidden">
                    Search Server Tags
                </span>
            </label>

            <input
                value={searchQuery}
                onInput={(e) => setSearchQuery(e.target.value)}
                type="text"
                id="header-search"
                placeholder="Search tags"
                name="s"
            />
            <button type="submit">Search</button>
        </form> 

  )
};
