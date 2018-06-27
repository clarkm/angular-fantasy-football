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

        soup = BeautifulSoup(urlopen("http://fftoolbox.scoutfantasysports.com/football/rankings/?pos=top"))

        playerList = []

        table = soup.find_all('tbody')[0]

        for tag in table.find_all('tr'):
            player = {}
            data = tag.find_all('td')
            # team = tag.find_all('small')

            if data[0]:
                player['rank'] = data[0].text if len(data) > 1 else None
            if len(data) > 1:
                player['name'] = data[1].find_all('a')[0].text if len(data[1].find_all('a')) > 0 else None
            if len(data) > 2:
                player['pos'] = data[2].text
            if len(data) > 3:
                player['team'] = data[3].find('div').attrs['title'] if len(data[3].find_all('div')) > 0 else None
            if len(data) > 4:
                player['bye'] = data[4].text



            playerList.append(player)

        jsonStr = json.dumps(playerList)
        # print jsonStr

        self.response.out.write(jsonStr)

application = webapp2.WSGIApplication([
    ('/fftoolbox-output', MainPage)], debug=True)

