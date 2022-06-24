import './App.css';
import { SearchBar } from './SearchBar';
import { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Announcer from './announcer';


// TODO: get servers from api after 4 letters are typed
  const servers = [
    { id: '1', name: 'buffy', tag1: "buffy", tag2: "angel" },
    { id: '2', name: 'hellmouth', tag1: "buffy", tag2: "hellmouth" },
    { id: '3', name: 'slayers', tag1: "buffy", tag2: "slayers" },
    { id: '4', name: 'scoobies', tag1: "buffy", tag2: "whedonverse" },
  ];

    const filterServers = (servers, query) => {
        if (!query) {
            return servers;
        }
        return servers.filter((server) => {
            const serverName = server.name.toLowerCase();
            return serverName.includes(query);
        });
    };


const App = () => {
    const { search } = window.location;
    const query = new URLSearchParams(search).get('s');
    const [searchQuery, setSearchQuery] = useState(query || '');
    const filteredServers = filterServers(servers, searchQuery);
    // const url = 'http://localhost:3333/hello';

    // testing GET
    // fetch(url,{
    //     method: 'GET',
    //     headers: {"Content-Type": "application/json"}
    // })
    // .then(function(response){
    //   return response.json()
    // })
    // .then(function(body){
    //   console.log(body);
    // });

    return (
        <Router>
            <div className="App">
                <Announcer
                    message={`${filteredServers.length} servers`}
                />
                <SearchBar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                />
                <ul>
                    {filteredServers.map((server) => (
                        <li key={server.id}>{server.name}</li>
                    ))}
                </ul>
            </div>
        </Router>
    );
};

export default App;
