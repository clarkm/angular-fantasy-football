#!/usr/bin/python
import sys
sys.path.insert(0, 'libs')
from bs4 import BeautifulSoup
from urllib2 import urlopen
import re
import json
import webapp2

class MainPage(webapp2.RequestHandler):
    def get(self):
        self.response.headers['Content-Type'] = "application/json"

        soup = BeautifulSoup(urlopen("http://www.espn.com/fantasy/football/story/_/page/18RanksPreseason200PPR/2018-fantasy-football-ppr-rankings-top-200"))
        
        playerList = []
        
        tbody = soup.find_all('tbody')[1]

        for tag in tbody.find_all('tr'):
            player = {}
            data = tag.find_all('td')

            if data[0]:
                player['rank'] = data[0].text.split(' ')[0]

            if data[0]:
                player['name'] = data[0].find_all('a')[0].text if len(data[0].find_all('a')) > 0 else None

            if data[1]:
                player['pos'] = data[1].text

            if data[2]:
                player['team'] = data[2].text

            playerList.append(player)

        jsonStr = json.dumps(playerList)

        self.response.out.write(jsonStr)

application = webapp2.WSGIApplication([
    ('/espn-output', MainPage)], debug=True)