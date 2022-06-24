import React, {useState} from 'react'

export const SearchBar = ({ 
  tag1, setTag1,
  tag2, setTag2, 
  tag3, setTag3, 
  tag4, setTag4, 
  tag5, setTag5 
}) => { 

  const [exclude1, setExclude1] = useState("");
  const [exclude2, setExclude2] = useState("");
  const [exclude3, setExclude3] = useState("");
  const [exclude4, setExclude4] = useState("");
  const [exclude5, setExclude5] = useState("");
  const inclusionPlaceholder = "inclusion tag";
  const exclusionPlaceholder = "exclusion tag";
  const url = 'http://localhost:3333/add';
  const inputStyle = {margin: "10px", width: "100px"};

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
    });
  };

  return (
    <form
      action="/"
      method="get"
      autoComplete="off"
      onSubmit={handleSubmit}
    >
      <div>
        <h2>Find Servers By Inclusion or Exclusion Tag</h2>
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

  )
};


// style={{
//             margin: "-90px auto 30px",
//             width: "100px",
//             borderRadius: "50%",
//             objectFit: "cover",
//             marginBottom: "0"
//           }}
