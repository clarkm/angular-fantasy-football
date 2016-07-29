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


app.controller('appController', ['myService', '$scope','$http',

    function (myService, $scope, $http){
        var vm = this;


        vm.selectedTeam = null;
        vm.players = [];

        myService.players().then(function(data){
            vm.players = data;
        });
        console.log('players:' + vm.players);

        //console.log(vm.players);

        vm.addItem = function(item){
            vm.players.push(item);
            vm.newItem = null;
        };

            /* make a function so when a row is clicked, index2 becomes that row's 'absolute'/original index.
            then the addItem function will add it correctly to the right team. */


            vm.index2 = 0;


        vm.teams = [];
        vm.addTeam = function (teamString) {
            console.log('selected team: ' + vm.selectedTeam);
            vm.teams.push({
              selected: false,
              name: teamString,
              players: []
            });
            vm.selectedTeam = vm.teams[vm.index2];
        };

        vm.updateSelectedTeam = function (team){

            if (vm.selectedTeam === vm.index2){
                vm.index2 += 1;
                console.log(team);
                return;
            }

            vm.selectedTeam = team;
            vm.selectedTeam.selected = !vm.selectedTeam.selected;

            vm.index2 += 1;
            if (vm.index2 % vm.teams.length === 0) {
              vm.index2 = 0;
            }

        };


        vm.trash = [];

        vm.addPlayer = function(index, item){
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

            if (vm.index2 === 0) {
              console('never hits this');
              vm.teams[0].addClass('selected');
            }

            // onclick, vm.index = index2.index
            vm.teams[vm.index2].players.push(item);
            vm.index2 = vm.index2 + 1;
            vm.selectedTeam = vm.teams[vm.index2];

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
