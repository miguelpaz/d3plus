//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// Get Key Types from Data
//-------------------------------------------------------------------
d3plus.data.keys = function(vars,type) {

  if (vars.dev.value) d3plus.console.time("key analysis")

  vars[type].keys = {}

  function get_keys(arr,add) {
    if (arr instanceof Array) {
      arr.forEach(function(d){
        get_keys(d)
      })
    }
    else if (typeof arr == "object") {
      for (var d in arr) {
        if (typeof arr[d] == "object") {
          get_keys(arr[d])
        }
        else if (!(d in vars[type].keys) && arr[d]) {
          vars[type].keys[d] = typeof arr[d]
        }
      }
      if (add) {
        arr.d3plus = {}
      }
    }
  }

  if (typeof vars[type].value == "object") {
    for (a in vars[type].value) {
      get_keys(vars[type].value[a],type == "data")
    }
  }
  else {
    get_keys(vars[type].value,type == "data")
  }

  if (vars.dev.value) d3plus.console.timeEnd("key analysis")

}
