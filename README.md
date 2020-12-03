Fantasy Football Scraper -- [footballscraper.appspot.com](https://footballscraper.appspot.com)
========================

##### fantasy football live draft helper app written in angularJS
<ul>
<li>Easily find top players to add to your fantasy team! Top 200 players are displayed; with sorting and filtering available on it. 
</li><li> Player positions are color-coded for easily glancing and finding a desired player.
</li><li> Sort by team, position, rank, bye week, etc. Then add a player to up to 12 teams.
</li><li> Setting for 8,10,12 team leagues, and 15,16,17,18 players.
</li><li> Much easier than manually crossing off players with pen & paper during a live draft!
</li><li> Source player rank data from fantasypros.com along with other sources!
</li></ul>

### Build Instructions

deploy with: `gcloud app deploy .`

serve it locally for debugging with: `dev_appserver.py .`

website's served at: `localhost:8080`

the settings web admin console is at: `localhost:8000`

###### Other references:

For google app engine, followed directions from here: https://medium.com/@lucas.abgodoy/building-a-rest-api-on-google-app-engine-based-on-web-scraping-d1ebef594d52

and here: https://stackoverflow.com/questions/14638262/python-2-7-how-to-use-beautifulsoup-in-google-app-engine
