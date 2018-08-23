var myUtility = {};

myUtility.getParam = paramName => {
  var queryStrings = window.location.search.substring(1).split("&");
  var param;
  queryStrings.forEach(queryString => {
      var keyValue = queryString.split("=");
      if (keyValue[0] == paramName) {
        param = keyValue[1];
      }
  });
  return param;
};

export default myUtility;