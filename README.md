# Disboard Server Search Backend

The python script found in `/scraper/scrape.py` is adapted from: https://github.com/DiscordFederation/DisboardScraper

## Usage 

We need to first set up the backend, the demo client, and the python script.


### Load the python script dependencies in the `scraper` directory:

`cd scraper`

Run a virtual shell:

`pipenv shell`

Install dependencies: 

`pipenv install` 

You might need to manually install `cloudscraper`:

`pipenv install cloudscaper`


### Set up the `express.js` server:

`cd server`

Install dependencies:

`npm install`

Run the server:

`npm start` 


### Front End Interaction (or you can use Postman/`curl`):

`cd client` 

`npm install` 

`npm start`



