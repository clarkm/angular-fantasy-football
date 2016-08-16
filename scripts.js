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


app.controller('appController', ['myService','$scope','$http','$filter','$mdToast','$mdDialog','$mdMedia',

    function (myService, $scope, $http, $filter, $mdToast, $mdDialog, $mdMedia){
        var vm = this;

        vm.searchTerm = '';
        vm.addActive = false;
        vm.disableTeamCreator = false;
        vm.teamSelectNumber = 12;

        vm.selectedTeam = null;
        vm.players = [];

        myService.players().then(function(data){
            vm.players = data;
        });

        vm.index2 = 0;

        vm.teams = [];
        vm.addTeam = function (teamString) {
          if (vm.teams.length >= vm.teamSelectNumber) {
            vm.disableTeamCreator = true;
          }
          if (!vm.disableTeamCreator) {
              vm.addActive = true;

              vm.teams.push({
                name: teamString,
                players: []
              });
              vm.selectedTeam = vm.teams[vm.index2];
              vm.teamString = '';
            } else {
              vm.showSimpleToast("You've reach the maximum number of teams: " + vm.teamSelectNumber);
            }
        };

        vm.updateSelectedTeam = function (team){
            vm.index2 = vm.teams.indexOf(team);

            vm.selectedTeam = team;

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

        vm.addPlayer = function(item){
          if (vm.addActive) {
              var index = vm.players.indexOf(item);
              vm.players.splice(index, 1);
              if (vm.selectedTeam !== null){

                  vm.selectedTeam.players.push(item);
                  vm.index2 += 1;
                  if (vm.index2 % vm.teams.length === 0) {
                    vm.index2 = 0;
                  }
                  vm.selectedTeam = vm.teams[vm.index2];
                  return;
              }

            vm.teams[vm.index2].players.push(item);
            vm.index2 += 1;
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

    vm.hideDialog = function() {
      $mdDialog.hide();
    };
    vm.showAdvanced = function(ev) {

        $mdDialog.show({
          // controller: appController,
          templateUrl: 'dialog1.tmpl.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          scope: $scope.$new(),
          clickOutsideToClose:true
        });

      };

    }

]);
