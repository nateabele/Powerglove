var S = {}, data = [], commands = [];
angular.extend(S, R);

Array.prototype.last = function() {
  return this[this.length - 1];
};

angular.module("powerglove", ["ui.router"]).
config(function() {
}).
run(function() {
  var i = 65;
  while (i <= 90) data.push(String.fromCharCode(i++));  	
}).
controller("DataController", function($scope) {
  angular.extend($scope, {
    data:       data,
    commands:   commands,
    newCommand: "",
    results:    [data],
    log:        console.log.bind(console),
    selected:   -1,

    addCommand: function(cmd) {
      var $map = null, result, list = $scope.results.last();

      with (R) result = eval(cmd)(list);

      if (cmd.match(/^filter\(/)) {
        var i = 0;
        with (R) $map = eval(cmd.replace(/^filter\(/, "map("))(list);

        result.$map = $map.map(function(val, i) {
          return !val ? false : (list.$map ? list.$map[i] : i);
        }).filter(function(val) {
          return val !== false;
        });
      }

      if (!result.$map && list.$map) {
        result.$map = list.$map;
      }

      $scope.commands.push(cmd);
      $scope.results.push(result);

      if (cmd === $scope.newCommand) {
        $scope.newCommand = "";
      }
    },

    select: function($index) {
      $scope.selected = ($scope.selected === $index) ? -1 : $index;
    },

    isActive: function(i, j) {
      var list = $scope.results[i];
      return list.$map ? list.$map[j] === $scope.selected : j === $scope.selected;
    },

    display: function(i, j) {
      var list = $scope.results[i];
      return /*list.$map ? (list.$map[j] ? list[j] : "") :*/ list[j];
    },

    displayCmd: function(cmd) {
    }
  });

  // $scope.addCommand("map(toLower)");
  // $scope.addCommand("map(nthCharCode(0))");
  // $scope.addCommand("filter(either(lt(__, 100), gt(__, 110)))");
  // $scope.addCommand("map(add(5))");
  // $scope.addCommand("map(String.fromCharCode)");
  // $scope.addCommand("filter(complement(eq('t')))");
  // $scope.addCommand("map(concat(__, '!'))");
  // $scope.addCommand("map(toUpper)");
});
