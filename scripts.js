var app = angular.module("app", []);
app.factory('myService', function($http) {
  var myService = {
    players: function() {
      // $http returns a promise, which has a then function, which also returns a promise
      var promise = $http.get('master-list.json').then(function (response) {
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

//clark
app.controller('appController2', ['myService', '$scope','$http',

    function (myService, $scope, $http){
        var vm = this;

        vm.selectedTeam = null;
        vm.players = [];

        myService.players().then(function(d){
            vm.players = d;
        });
        console.log(vm.players);

        //console.log(vm.players);

        vm.addItem = function(item){
            vm.players.push(item);
            vm.newItem = null;
        };

            /* make a function so when a row is clicked, index2 becomes that row's 'absolute'/original index.
            then the addItem function will add it correctly to the right team. */

        vm.teams = [];
        vm.addTeam = function (teamString) {
            console.log('selected team: ' + vm.selectedTeam);
            vm.teams.push({
            selected: false,
            name: teamString,
            players: []
            });
        };

        vm.updateSelectedTeam = function (team){
            if (vm.selectedTeam === team){
                //vm.selectedTeam.selected = !vm.selectedTeam.selected;
                vm.selectedTeam.selected = True;
                return;
            }
            // if (vm.selectedTeam !== null){
            //     vm.selectedTeam.selected = !vm.selectedTeam.selected;
            // }
            vm.selectedTeam = team;
            vm.selectedTeam.selected = !vm.selectedTeam.selected;

        };


        vm.trash = [];

        index2 = 0;

        vm.addPlayer = function(index, item){
            vm.players.splice(index, 1);
            console.log('index2: ' + index2);

            if (vm.selectedTeam !== null){
                vm.selectedTeam.players.push(item);
                index2 = index2 + 1;
                vm.selectedTeam = vm.teams[index2];
                return;
            }

            if (index2 > vm.teams.length - 1) {
                index2 = 0;
                vm.selectedTeam = vm.teams[0];
            }

            // onclick, vm.index = index2.index
            vm.teams[index2].players.push(item);
            index2 = index2 + 1;
            vm.selectedTeam = vm.teams[index2];

        };

        vm.removePlayer = function(item, team, index){
            // coming through in the wrong format or something....
            console.log('clark');
            vm.players.unshift(item);
            console.log(index);
            team.players.splice(index, 1);
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
            if(item.name.toLowerCase().indexOf(searchString) !== -1){
                result.push(item);
            }
        });

        return result;
    };

});
