import './App.css';
import { SearchBar } from './SearchBar';
import { useState } from 'react';
import DynamicMsg from './DynamicMsg';


////////////// EXPERIMENTAL THINGS ////////////
  const servers = [
    { id: '1', name: 'buffy', tag1: "buffy", tag2: "angel" },
    { id: '2', name: 'faith', tag1: "buffy", tag2: "slayer" },
    { id: '3', name: 'hellmouth', tag1: "buffy", tag2: "hellmouth" },
    { id: '4', name: 'slayers', tag1: "buffy", tag2: "slayers" },
    { id: '5', name: 'scoobies', tag1: "buffy", tag2: "whedonverse" },
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

/////////////// THE APP ///////////////

const App = () => {
    const { search } = window.location;
    const query = new URLSearchParams(search).get('s');
    const [tag1, setTag1] = useState(query || '');
    const [tag2, setTag2] = useState(query || '');
    const [tag3, setTag3] = useState(query || '');
    const [tag4, setTag4] = useState(query || '');
    const [tag5, setTag5] = useState(query || '');
    const filteredServers = filterServers(servers, tag1);
    const [visible, setVisible] = useState(false)
    const handleToggle = () => { setVisible(!visible)};

    return (
        <div className="App" style={{margin: "25px"}}>
            <button onClick={()=>{handleToggle()}}>
                toggle dynamic msg
            </button>
            <SearchBar
                tag1={tag1} setTag1={setTag1}
                tag2={tag2} setTag2={setTag2}
                tag3={tag3} setTag3={setTag3}
                tag4={tag4} setTag4={setTag4}
                tag5={tag5} setTag5={setTag5}
            />
            {visible &&
                <DynamicMsg
                    message={`${filteredServers.length} servers`}
                />
            }
            {visible &&
                <ul style={{color:"#d4d4d4"}}>
                    {filteredServers.map((server) => (
                        <li key={server.id}>{server.name}</li>
                    ))}
                </ul>
            }
        </div>
    );
};

export default App;
