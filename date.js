
module.exports.getDate=function(){
const currentDate= new Date()
options={
  weekday:"long",
  month:"long",
  day:"numeric",

}
return currentDate.toLocaleDateString("en-US",options)
}
module.exports.getDay=function() {
  const currentDate=new Date()
  options={
    day:"numeric"
  }
  return currentDate.toLocaleDateString("en-Us",options)
}

//exports is javascript object
//module is a free variable that is a reference to the object to the module
