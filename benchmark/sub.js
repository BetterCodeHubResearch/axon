

var ss = require('..')
  , sock = ss.socket('sub');

sock.connect(3000);

var n = 0;
var ops = 200;
var t = start = process.hrtime();
var results = [];

console.log();

sock.on('message', function(msg){
  if (n++ % ops == 0) {
    t = process.hrtime(t);
    var ms = t[1] / 1000 / 1000;
    var persec = (ops * (1000 / ms) | 0);
    results.push(persec);
    process.stdout.write('\r  [' + persec + ' ops/s] [' + n + ']');
    t = process.hrtime();
  }
});

function sum(arr) {
  return arr.reduce(function(sum, n){
    return sum + n;
  });
}

function mean(arr) {
  return sum(arr) / arr.length | 0;
}

function median(arr) {
  arr = arr.sort();
  return arr[arr.length / 2 | 0];
}

process.on('SIGINT', function(){
  t = process.hrtime(start);
  console.log('\n');
  console.log('     mean: %d ops/s', mean(results));
  console.log('   median: %d ops/s', median(results));
  console.log('    total: %d ops in %d.%ds', n, t[0], t[1] / 1000 / 1000 | 0);
  console.log();
  process.exit();
});