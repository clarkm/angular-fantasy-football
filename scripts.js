var app = angular.module("app", ['ngMaterial', 'ngMessages']);
app.factory('myService', function($http) {
  var myService = {
    players: function() {
      // $http returns a promise, which has a then function, which also returns a promise
      var promise = $http.get('output.json').then(function (response) {
        // The then function here is an opportunity to modify the response
        // The return value gets picked up by the then in the controller.
        return response.data;
      });
      // Return the promise to the controller
      return promise;
    }
  };
  return myService;
});


app.controller('appController', ['myService','$scope','$http','$filter','$mdToast',

    function (myService, $scope, $http, $filter, $mdToast){
        var vm = this;

        vm.sortType = 'name';
        vm.sortReverse = false;
        vm.searchTerm = '';
        vm.addActive = false;
        vm.disableTeamCreator = false;

        vm.selectedTeam = null;
        vm.players = [];

        myService.players().then(function(data){
            vm.players = data;
        });


        vm.addItem = function(item){
            vm.players.push(item);
            vm.newItem = null;
        };


            vm.index2 = 0;

        vm.teams = [];
        vm.addTeam = function (teamString) {
          if (vm.teams.length >= 12) {
            vm.disableTeamCreator = true;
            //maybe display a md-toast popup here alerting that the teams are full
          }
          if (!vm.disableTeamCreator) {
              vm.addActive = true;
              console.log('addActive ' + vm.addActive);
              console.log('selected team: ' + vm.selectedTeam);
              vm.teams.push({
                selected: false,
                name: teamString,
                players: []
              });
              vm.selectedTeam = vm.teams[vm.index2];
            } else {
              vm.showSimpleToast("You've reach the maximum number of teams - 12");
            }
        };

        vm.updateSelectedTeam = function (team){
            vm.index2 = vm.teams.indexOf(team) ;
            if (vm.selectedTeam === vm.index2){

                return;
            }

            vm.selectedTeam = team;
            vm.selectedTeam.selected = !vm.selectedTeam.selected;


            if (vm.index2 % vm.teams.length === 0) {
              vm.index2 = 0;
            }

        };


            //toast alert messages:
            var last = {
              bottom: false,
              top: true,
              left: false,
              right: true
            };

            vm.toastPosition = angular.extend({},last);
            vm.getToastPosition = function() {
              sanitizePosition();

              return Object.keys(vm.toastPosition)
                .filter(function(pos) { return vm.toastPosition[pos]; })
                .join(' ');
            };
            function sanitizePosition() {
              var current = vm.toastPosition;

              if ( current.bottom && last.top ) current.top = false;
              if ( current.top && last.bottom ) current.bottom = false;
              if ( current.right && last.left ) current.left = false;
              if ( current.left && last.right ) current.right = false;

              last = angular.extend({},current);
            }

            vm.showSimpleToast = function(alertMessage) {
              var pinTo = vm.getToastPosition();

              $mdToast.show(
                $mdToast.simple()
                  .textContent(alertMessage)
                  .position(pinTo )
                  .hideDelay(3000)
              );
            };

        vm.addPlayer = function(index, item){
          if (vm.addActive) {
              var index = vm.players.indexOf(item);
              vm.players.splice(index, 1);
              if (vm.selectedTeam !== null){

                  // checks to see if it's the last team.....
                  if (vm.index2 > vm.teams.length - 1) {
                      console.log('going back to 0');
                      vm.selectedTeam = vm.teams[vm.index2];
                  }

                  vm.selectedTeam.players.push(item);
                  vm.index2 += 1;
                  if (vm.index2 % vm.teams.length === 0) {
                    vm.index2 = 0;
                  }
                  vm.selectedTeam = vm.teams[vm.index2];
                  return;
              }

            vm.teams[vm.index2].players.push(item);
            vm.index2 = vm.index2 + 1;
            vm.selectedTeam = vm.teams[vm.index2];
          }
          else {
            // show error in md toast!
            vm.showSimpleToast('Please create a team first!');
          }
        };


        vm.removePlayer = function(item, team, index){
          // removes player from team:
            team.players.splice(index, 1);
          // adds player to top of master players list:
            vm.players.unshift(item);

        };

    }

]);

app.filter('searchFor', function(){

  return function(arr, searchString){
      if(!searchString){
          return arr;
      }
      var result = [];
      searchString = searchString.toLowerCase();
      angular.forEach(arr, function(item){
          if(
              angular.isDefined(item.name) &&
              item.name.toLowerCase().indexOf(searchString) !== -1
          ){
              result.push(item);
          }
      });
      return result;
  };

});
