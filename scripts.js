window.onbeforeunload = function() {
  return "This will clear everything. Are you sure?";
};

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

app.directive('inputClear',

  function () {
    return {
        restrict: 'A',
        compile: function (element, attrs) {
            var color = attrs.inputClear;
            var style = color ? "color:" + color + ";" : "";
            var action = attrs.ngModel + " = ''";
            element.after(
                '<md-button class="animate-show md-icon-button md-accent"' +
                'ng-show="' + attrs.ngModel + '" ng-click="' + action + '"' +
                'style="position: absolute; top: 0px; right: -6px; /*margin: 13px 0px;*/">' +
                '<div style="' + style + '">x</div>' +
                '</md-button>');
        }
    };
  }

);

app.directive('inputClearNoMaterial',

  function () {
    return {
        restrict: 'A',
        compile: function (element, attrs) {
            var color = attrs.inputClearNoMaterial;
            var style = color ? "color:" + color + ";" : "";
            var action = attrs.ngModel + " = ''";
            element.after(
                '<span class="animate-show"' +
                'ng-show="' + attrs.ngModel + '" ng-click="' + action + '"' +
                'style="position: absolute; margin: 3px -20px; cursor: pointer;">' +
                '<div style="' + style + '">x</div>' +
                '</span>');
        }
    };
  }

);


app.controller('appController', ['myService','$scope','$http','$filter','$mdToast','$mdDialog','$mdMedia',

    function (myService, $scope, $http, $filter, $mdToast, $mdDialog, $mdMedia){
        var vm = this;

        vm.searchTerm = '';
        vm.addActive = false;
        vm.disableTeamCreator = false;
        vm.teamSelectNumber = 12;

        vm.selectedTeam = null;
        vm.players = [];
        vm.maxPlayersPerTeam = 16;

        myService.players().then(function(data){
            vm.players = data;
        });
        vm.sortType = 'rank*1';
        vm.value = '';

        vm.index2 = 0;
        vm.moveInReverse = false;

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
        };

        vm.removeTeam = function (team) {
          var areYouSure = confirm("Are you sure you want to delete this team?");
          if (areYouSure === true) {

            for (i=0;i<= team.players.length;i++) {
              vm.players.unshift(team.players[i]);
            }

            team.players = [];
            var index = vm.teams.indexOf(team);
            vm.teams.splice(index, 1);
          }

        };

        vm.resetEverything = function () {
            var areYouSure = confirm("Are you sure you want to delete EVERYTHING?");
            if (areYouSure === true) {
              var areYouReallySure = confirm('Are you really sure - everything will be GONE?');
              if (areYouReallySure === true) {
                for (var i = 0; i < vm.teams.length; i++) {
                  for (var j = 0; j < vm.teams[i].players.length; j++) {
                    vm.players.unshift(vm.teams[i].players[j]);
                  }
                }
                  vm.teams = [];
                  vm.addActive = true;vm.disableTeamCreator = false;
                }
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
            if (vm.selectedTeam.players.length < vm.maxPlayersPerTeam) {
                var index = vm.players.indexOf(item);
                vm.players.splice(index, 1);

                    vm.selectedTeam.players.push(item);

                    if (vm.moveInReverse === false) {
                      vm.index2 += 1;
                        if (vm.index2 % vm.teams.length === 0) {
                          vm.index2 -= 1;
                          vm.moveInReverse = true;
                        }

                      vm.selectedTeam = vm.teams[vm.index2];
                      return;
                    } else if (vm.moveInReverse === true) {
                      vm.index2 -= 1;
                        if ((vm.index2 % vm.teams.length +1) === 0) {
                          vm.index2 = 0;
                          vm.moveInReverse = false;
                        }
                      vm.selectedTeam = vm.teams[vm.index2];
                      return;
                    }


              vm.teams[vm.index2].players.push(item);
              vm.index2 += 1;
              vm.selectedTeam = vm.teams[vm.index2];
            }
            else {
              vm.showSimpleToast("You can't hold any more players!");
            }
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

        vm.countPos = function (obj,searchTerm) {
          count = 0;
          for (i=0; i<obj.length; i++) {
              if (obj[i].pos.includes(searchTerm) ) {
                count += 1;
              }
          }
          return count;
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
