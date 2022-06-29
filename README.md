# Disboard Server Search Backend

This is the backend API for a Discord Server Search App with improved functiionality such as searching by multiple tags and by exlusion tags.

The python script found in `/scripts/scrape.py` is adapted from: https://github.com/DiscordFederation/DisboardScraper


# Repo Tree

### Files of interest can be found here:

```lang-js
client 
|---public 
|---src // minimalist react client for demo of backend purposes only
scripts
|---scrape.py // scraper called in node.js
|---populateDb.py // script to populate mongoDB
server
|---connect.js // connect to mongoDB
|---helpers.js // parsing, formatting, and other helpers
|---server.js // controller + routing 

```


# Usage

### Load the python script dependencies in the `scripts` directory:

`cd scraper`

Run a virtual shell:

`pipenv shell`

Install dependencies: 

`pipenv install` 

You might need to manually install `cloudscraper`:

`pipenv install cloudscraper`

**Note that you may need to manually install all the dependecies**

In the event of an inexplicable error with parsing, please ensure that you are running a virtual env and have all dependencies loaded.

---

### Run scraper as standalone or debug


The script expects three args: `<tag>` `<pages>` `<destination>`

The **tag** is self-explanatory. 

The max amount of **pages** allowed by Discord is `50`.

The destination can be: `server` to return to the express server, `json` to print to terminal in a nice format, or `mongodb` to directly insert into the database.


```
python3 scrapy.py buffy 2 json

```

Also noteworthy is that if you try to run a scraper from AWS Lambda, your generated IP from AWS's known range will be blocked even. If you know of a workaround to this, please let me know [here](https://stackoverflow.com/questions/72722566/aws-lambda-python-webscraping-unable-to-bypass-cloudfare-anti-bots-from-aws).

---

### Run the Server

Navigate to `scripts/` directory and ensure that the scraper file's dependencies are installed. If they are, run the virutal env with `pipenv shell`. 

Navigate to `server/` and install dependencies:

`npm install`

Run the server:

`npm start` or `npm start --reset-cache`

If you have an inexplicable python syntax error when accessing the server, please ensure you have followed the steps here.

---

### Run the demo client 

`cd ../client`

`npm install`

`npm start` or `npm start --reset-cache`

--- 

### API Endpoints 

POST to `http://localhost:3333/add` and in your body, pleae include up to 5 inclusion and exclusion tags:

```lang-js
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
```

In the response, you will receive an array of `JSON`:

```lang-js
[
  {
    'Search Tag': 'buffy',
    'Server Name': 'Buffyverse',
    'Members Online': '208',
    'Creation Date': 'datetime.datetime(2019, 4, 18, 7, 33, 50, 504000',
    'Invite Link': 'https://disboard.org/server/568338386272780314',
    'Tag 1': 'angel',
    'Tag 2': 'buffy-the-vampire-slayer',
    'Tag 3': 'buffy',
    'Tag 4': 'btvs',
    'Tag 5': 'buffyverse'
  },
  {
    'Search Tag': 'buffy',
    'Server Name': 'Slayerverse',
    'Members Online': '82',
    'Creation Date': 'datetime.datetime(2022, 1, 16, 3, 1, 6, 13000',
    'Invite Link': 'https://disboard.org/server/932107165685137468',
    'Tag 1': 'supernatural',
    'Tag 2': 'angel',
    'Tag 3': 'buffy-the-vampire-slayer',
    'Tag 4': 'buffy',
    'Tag 5': 'buffyverse'
  }
]
```

# Dev Notes

1. Inner single quotes (apostrophes)  have been removed; you will instead see an empty space where there should be a single quote. 

For example, instead of the string `"Devil's Land"`, you will receive  `"Devil s Land"`. Parse accordingly.

2. `datetime` has been left as is. Import and parse accordingly.


# Report Bugs

Please let me know at: `sujetdev@sudomail.com`
