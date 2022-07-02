import React, {useState} from 'react'
export const SearchBar = ({ 
  tag1, setTag1,
  tag2, setTag2, 
  tag3, setTag3, 
  tag4, setTag4, 
  tag5, setTag5 
}) => { 
  const [servers, setServers] = useState([]);
  const [headers, setHeaders] = useState(false);
  const [exclude1, setExclude1] = useState("");
  const [exclude2, setExclude2] = useState("");
  const [exclude3, setExclude3] = useState("");
  const [exclude4, setExclude4] = useState("");
  const [exclude5, setExclude5] = useState("");
  const inclusionPlaceholder = "inclusion tag";
  const exclusionPlaceholder = "exclusion tag";
  const url = 'http://localhost:3333/search';
  const inputStyle = {margin: "10px", width: "100px", marginBottom: "30px"};
  const listStyle = {color: "#8b5cf6"};
  const listFirstLine = {fontWeight: "bold", textDecorationLine: 'underline'};


  // get the desired servers
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(url,{
      method: 'POST',
      body: JSON.stringify({
        tag1: tag1,
        tag2: tag2,
        tag3: tag3,
        tag4: tag4,
        tag5: tag5,
        exclude1: exclude1,
        exclude2: exclude2,
        exclude3: exclude3,
        exclude4: exclude4,
        exclude5: exclude5,
      }),
      headers: {"Content-Type": "application/json"}
    })
    .then(function(response){
      return response.json()
    })
    .then(function(body){
      console.log(body);
      // console.log(typeof body);
      setServers(body);
    });
  };

  
  return (
    <div>
    <form
      action="/"
      method="get"
      autoComplete="off"
      onSubmit={handleSubmit}
    >
      <div>
        <h2>Find Servers By Inclusion And/Or Exclusion Tag</h2>
        <p style={{fontStyle: "italic", color: "#d4d4d4"}}>
          (You can select up to 5)
        </p>
      </div>
    
      {/* inclusion tags */}
      <br/>
      <input
        style={inputStyle}
        value={tag1}
        onInput={(e) => setTag1(e.target.value)}
        type="text" 
        placeholder={inclusionPlaceholder}
        name="s"
     />      

      <input
        style={inputStyle}
        value={tag2}
        onInput={(e) => setTag2(e.target.value)}
        type="text" 
        placeholder={inclusionPlaceholder}
        name="s"
     />
      <input
        style={inputStyle}
        value={tag3}
        onInput={(e) => setTag3(e.target.value)}
        type="text" 
        placeholder={inclusionPlaceholder}
        name="s"
     />      

      <input
        style={inputStyle}
        value={tag4}
        onInput={(e) => setTag4(e.target.value)}
        type="text" 
        placeholder={inclusionPlaceholder}
        name="s"
     />
      <input
        style={inputStyle}
        value={tag4}
        onInput={(e) => setTag4(e.target.value)}
        type="text" 
        placeholder={inclusionPlaceholder}
        name="s"
     />
      <hr />
      {/* exclusion tags */}
      <br/>      
      <input
        style={inputStyle}
        onInput={(e) => setExclude1(e.target.value)}
        type="text"
        placeholder={exclusionPlaceholder}
      />

      <input
        style={inputStyle}
        onInput={(e) => setExclude2(e.target.value)}
        type="text"
        placeholder={exclusionPlaceholder}
      />

      <input
        style={inputStyle}
        onInput={(e) => setExclude3(e.target.value)}
        type="text"
        placeholder={exclusionPlaceholder}
      />

      <input
        style={inputStyle}
        onInput={(e) => setExclude4(e.target.value)}
        type="text"
        placeholder={exclusionPlaceholder}
      />

      <input
        style={inputStyle}
        onInput={(e) => setExclude5(e.target.value)}
        type="text"
        placeholder={exclusionPlaceholder}
      />

      <br/>
      <button type="submit" style={{marginTop: "25px"}}>
        Search
      </button>
    </form> 
    <div>
      <h3 style={{marginTop: "40px"}}>Servers Found:</h3>
        {servers.map((server, index) => {
          return (
            <ul key={index} style={{listStyleType:'none'}}>
              <li><span style={listFirstLine}>Search Tag: <span style={listStyle}>{server["Search Tag"]}</span></span></li>
              <li>Server Name: <span style={listStyle}>{server["Server Name"]}</span></li>
              <li>Members Online: <span style={listStyle}>{server["Members Online"]}</span></li>
              <li>Creation Date: <span style={listStyle}>{server["Creation Date"]}</span></li>
              <li>Invite Link: <span style={listStyle}>{server["Invite Link"]}</span></li>
              <li>Tag 1: <span style={listStyle}>{server["Tag 1"]}</span></li>
              <li>Tag 2: <span style={listStyle}>{server["Tag 2"]}</span></li>
              <li>Tag 3: <span style={listStyle}>{server["Tag 3"]}</span></li>
              <li>Tag 4: <span style={listStyle}>{server["Tag 4"]}</span></li>
              <li>Tag 5: <span style={listStyle}>{server["Tag 5"]}</span></li>
            </ul>
          );
        })}
      <br/>
      <br/>
      <br/>
        {/* {servers} */} 
    </div>
    </div>

  )
};




// style={{
//             margin: "-90px auto 30px",
//             width: "100px",
//             borderRadius: "50%",
//             objectFit: "cover",
//             marginBottom: "0"
//           }}
//
//
// <div key={index}>
//               <p>Search Tag: {server["Search Tag"]}</p>
//               <p>Server Name: {server["Server Name"]}</p>
//               <p>Members Online: {server["Members Online"]}</p>
//               <p>Creation Date: {server["Creation Date"]}</p>
//               <p>Invite Link: {server["Invite Link"]}</p>
//               <p>Tag 1: {server["Tag 1"]}</p>
//               <p>Tag 2: {server["Tag 2"]}</p>
//               <p>Tag 3: {server["Tag 3"]}</p>
//               <p>Tag 4: {server["Tag 4"]}</p>
//               <p>Tag 5: {server["Tag 5"]}</p>
//             </div>

