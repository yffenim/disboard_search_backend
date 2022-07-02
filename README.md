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
|---scrape_all_servers.py // script to populate mongoDB
server
|---connect.js // connect to mongoDB
|---helpers.js // parsing, formatting, and other helpers
|---server.js // controller + routing 

```


# Usage

### Install dependencies and run server(s)

`cd scripts`

Run a virtual shell:

`pipenv shell`

Install dependencies with makefile:

`make`

In the event of an inexplicable python error with parsing, please ensure that you are running a virtual env and have all dependencies loaded.

Run the express server:

`cd ../server && npm start`

If needed, run the react client:

`cd ../client && npm start`

---

### Run scraper as standalone or debug


The script expects three args: `<tag>` `<pages>` `<destination>`

The **tag** is self-explanatory. 

The max amount of **pages** allowed by Discord is `50`.

The destination can be: `server` to return to the express server, `json` to print to terminal in a nice format, or `mongodb` to directly insert into the database.

For example:


```
python3 scrapy.py buffy 2 json

```

Also noteworthy is that if you try to run a scraper from AWS Lambda, your generated IP from AWS's known range will be blocked even. If you know of a workaround to this, please let me know [here](https://stackoverflow.com/questions/72722566/aws-lambda-python-webscraping-unable-to-bypass-cloudfare-anti-bots-from-aws).

---

### API Endpoints

`GET` to `http://localhost:3333/add` for an array of all tags.

`POST` to `http://localhost:3333/add` and in your body, pleae include up to 5 inclusion and exclusion tags:

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

1. Inner single quotes (apostrophes)  have been removed; you will instead see an empty space where there should be a single quote. For example, instead of the string `"Devil's Land"`, you will receive  `"Devil s Land"`. Parse accordingly.

2. `datetime` has been left as is. Import and parse accordingly.


# Report Bugs

Please let me know at: `sujetdev@sudomail.com`
