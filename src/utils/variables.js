//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// Finds a given variable by searching through the data and attrs
//------------------------------------------------------------------------------
d3plus.variable.value = function(vars,id,variable,id_var,agg) {

  if (!id_var) {
    if (variable && typeof variable == "object") {
      if (variable[vars.id.key]) {
        var id_var = vars.id.key
      }
      else {
        var id_var = Object.keys(variable)[0]
      }
      variable = variable[id_var]
    }
    else {
      var id_var = vars.id.key
    }
  }

  if (variable && typeof variable == "function") {
    return variable(id)
  }

  function filter_array(arr) {
    return arr.filter(function(d){
      return d[id_var] == id
    })[0]
  }

  var value_array = []
  function check_children(obj) {
    if (obj.children) {
      obj.children.forEach(function(c){
        check_children(c)
      })
    }
    else if (obj[variable]) {
      value_array.push(obj[variable])
    }
  }

  if (typeof id == "object" && typeof id[variable] != "undefined") {
    return id[variable]
  }
  else if (typeof id == "object" && id.children) {

    if (!agg) {
      var agg = "sum"
      if (typeof vars.aggs.value == "string") {
        agg = vars.aggs.value
      }
      else if (vars.aggs.value[variable]) {
        agg = vars.aggs.value[variable]
      }
    }
    check_children(id)
    if (value_array.length) {
      if (typeof agg == "string") {
        return d3[agg](value_array)
      }
      else if (typeof agg == "function") {
        return agg(value_array)
      }
    }

    var dat = id
    id = dat[id_var]

  }
  else {

    if (typeof id == "object") {
      var dat = id
      id = id[id_var]
    }

    if (vars.data.app instanceof Array) {
      var dat = filter_array(vars.data.app)
    }
    if (!dat) {
      var dat = filter_array(vars.data.value)
    }

    if (dat && typeof dat[variable] != "undefined") return dat[variable]
  }

  if (vars.attrs.value instanceof Array) {
    var attr = filter_array(vars.attrs.value)
  }
  else if (vars.attrs.value[id_var]) {
    if (vars.attrs.value[id_var] instanceof Array) {
      var attr = filter_array(vars.attrs.value[id_var])
    }
    else {
      var attr = vars.attrs.value[id_var][id]
    }
  }
  else {
    var attr = vars.attrs.value[id]
  }

  if (attr && typeof attr[variable] != "undefined") return attr[variable]

  return null

}

//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// Finds an object's color and returns random if it cannot be found
//------------------------------------------------------------------------------
d3plus.variable.color = function(vars,id,level) {

  function get_random(c) {
    if (typeof c == "object") {
      c = c[vars.id.key]
    }
    return d3plus.color.random(c)
  }

  function validate_color(c) {
    if (typeof c == "string" && c.indexOf("#") == 0 && [4,7].indexOf(c.length) >= 0) return true
    else return false
  }

  if (!vars.color.key) {
    return get_random(id);
  }
  else {

    var color = d3plus.variable.value(vars,id,vars.color.key,level)

    if (!color) {
      if (typeof vars.color.scale == "function") {
        return vars.style.color.missing
      }
      return get_random(id)
    }
    else if (!vars.color.scale) {
      var true_color = validate_color(color)
      return true_color ? color : get_random(color)
    }
    else {
      return vars.color.scale(color)
    }

  }
}

//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// Get array of available text values
//------------------------------------------------------------------------------
d3plus.variable.text = function(vars,obj,depth) {

  if (typeof depth != "number") var depth = vars.depth.value

  if (vars.text.array && typeof vars.text.array == "object") {
    if (vars.text.array[vars.id.nesting[depth]]) {
      var text_keys = vars.text.array[vars.id.nesting[depth]]
    }
    else {
      var text_keys = vars.text.array[Object.keys(vars.text.array)[0]]
    }
  }
  else {
    var text_keys = []
    if (vars.text.key) text_keys.push(vars.text.key)
    text_keys.push(vars.id.nesting[depth])
  }
  if (typeof text_keys == "string") {
    text_keys = [text_keys]
  }

  var names = []
  text_keys.forEach(function(t){
    var name = d3plus.variable.value(vars,obj,t,vars.id.nesting[depth])
    if (name) names.push(vars.format(name))
  })

  return names

}
