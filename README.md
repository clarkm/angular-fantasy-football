angular-fantasy-football
========================

fantasy football app with angularjs

bug: the 1st team won't outline red when it's active -- the html seems to be broken
bug: the 'selected' varible never changes from 'false'
bug: after a team is selected, it adds a player to it, then adds a player to that same team again

to do:
[X] move player dictionary controller into new script<br />
[ ] make the players without the ‘active' class be listed in a separate list<br />
[X] fix the delete function on the team list so it doesn't delete all the teams<br />
[ ] make a boolean active checkbox instead of having to type, ‘active’ - and just fix this filter altogether<br />
[ ] get your data from the fantasy football cheat sheet rankings and reformat it -- use the http request like the angular app uses<br />
[ ] make a feature to add a specific player to a team<br />




make it so there is an active team
when a user click's draft, the player will go to the active team's roster
