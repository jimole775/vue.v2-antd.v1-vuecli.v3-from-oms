const mock = [
  {
    "key": "dadw",
    "title": "dddddddd",
    "layout": {
      "span": 6,
      "label": 6,
      "wrapper": 16
    },
    "component": "function (a, b) { return a }",
    "props": {
      "len": 22
    }
  }
]
let string = JSON.stringify(mock, null, 2)
string = string.replace(/  "(.*?)": /g, '  $1: ')
string = string.replace(/: "(.*?)"(,?)\n/g, ': \'$1\'$2\n')
string = string.replace(/: '(function)/g, ': $1')
string = string.replace(/}'(,?)/g, '}$1')
console.log(string)
