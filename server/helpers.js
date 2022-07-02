// format the results from inclusion tag search
function formatServers(servers_str) {
  // console.log(servers_str)

  const regex0 = /\"/;
  // console.log(regex0.test(servers_str)); // true

  // split string input into arr of strings
  const regex1 = /\]\,\ \[/;
  const servers_arr = servers_str.split(regex1);
  var servers_hashed = [];
  const keys_arr = ["Search Tag", "Server Name", "Members Online", "Creation Date", "Invite Link", "Tag 1", "Tag 2", "Tag 3", "Tag 4", "Tag 5"];

// loop through arr of strings
  for (var i=0, n=servers_arr.length; i < n; ++i) {
    // for each server string object, split again into arr
    const regex2 = /\'\,|\)\,/;
    var values_arr = servers_arr[i].split(regex2);
    
    // make each server object into a nice hash
    let server = arrToHsh(keys_arr, values_arr);   
    servers_hashed.push(server);
  };

  formatFirstAndLastObj(servers_hashed);
  removeQuotesAndSpaces(servers_hashed);
  return servers_hashed;
};


// filter out the servers w/ exclusion tags
function filterServers(servers_formatted, exclusion_tags,) {
  tag_keys = ['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4', 'Tag 5'];
  // const exclusion_tags = ['gruppe', 'vampire', 'hannibal', 'roleplay'];

  // check if any of the tags match w/ exclusion tags
  let newHash = servers_formatted.map(function(hash, index) {
    for (var k in hash) {
    // remove the objects with matching tags
      if ( tag_keys.includes(k) && exclusion_tags.includes(hash[k]) ) {
        servers_formatted.splice(index, 1)
      };
    };
    return hash;
  });
  //console.log("returned: ", servers_formatted)
  return servers_formatted
};


// PRIVATE METHODS
// TODO: NEEDS REFACTORING
// get rid of the [[ and ]] from first and last obj
function formatFirstAndLastObj(servers_hashed) {  
  let first = servers_hashed.shift();
  let f = first['Search Tag'].substring(3);
  first['Search Tag'] = f;
  servers_hashed.unshift(first);
  
  if ( servers_hashed.length > 1) {  
    let last = servers_hashed.pop();
    // console.log(last)
    let l = last['Tag 5'].slice(0, -3);
    last['Tag 5'] = l;
    servers_hashed.push(last);
  }; 

  if (servers_hashed.length === 1 ) {
    let last = servers_hashed.pop();
    let l = last['Tag 5'].slice(0, -3);
    last['Tag 5'] = l;
    servers_hashed.push(last);
  }
  return servers_hashed;
};


// get rid of unneeded quotes or spaces
function removeQuotesAndSpaces(servers_hashed) {
  
  // first val from each obj does not need to be formatted
  let first_v = servers_hashed[0]["Search Tag"];

  let newHash = servers_hashed.map(function(hash) {
      for (var k in hash) {
        // remove extra double qt and space from all values 
        // except for search tag and creation date
        if (k !== "Creation Date" && k !== "Search Tag") {
          hash[k] = hash[k].substring(2);
        }; 

        // remove extra double qt from the beginning of 
        // value from non-first "Search Tag"
        if (k === "Search Tag" && hash[k] !== first_v) {
          hash[k] = hash[k].substring(1);
        };
       
        // get rid of extra single quote 
        // from last value of Tag n where 1 < n < 4
        if (k === "Tag 5" ) {
          hash[k] = hash[k].replace(/'/g,"")
        };

        // remove the space before datetime 
        if (k === "Creation Date") {
          hash[k] = hash[k].substring(1);
        };

      };
    // console.log("post changes :", servers_hashed);
  return hash;
  });
};

// zip two arrs into hash
function arrToHsh(k, v) {
  var map = {};
  k.forEach(function (k, i) {
    map[k] = v[i];
  });
  return map;
};

// export the main function
module.exports.formatServers = formatServers;
module.exports.filterServers = filterServers;


