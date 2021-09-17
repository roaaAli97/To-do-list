const express=require("express")
const BodyParser=require("body-parser")
const mongoose=require("mongoose")
const app=express()
const _=require("lodash")

app.use(BodyParser.urlencoded({extened:true}))
app.set("view engine","ejs")
app.use(express.static("public"))
mongoose.connect("mongodb://localhost:27017/toDoListDB",{useNewUrlParser:true})

const itemSchema=new mongoose.Schema({
  name:String
})
const Item=mongoose.model('item',itemSchema)
const item1=new Item({
  name:"Welcome to our ToDoList"
})
const item2=new Item({
  name:"Hit + to add item"
})
const item3=new Item({
  name:"<--Hit this to delete an item"
})
const defaultItems=[item1,item2,item3]

const listSchema={
  name:String,
  items:[itemSchema]
}
const List=mongoose.model("list",listSchema)


app.get("/",function(req,res){
//const date=require(__dirname+"/date.js")
//const day=date.getDate()
Item.find(function(err,foundItems){
  if(foundItems.length===0){
    Item.insertMany(defaultItems,function(error){
      if(error){
        console.log(error)
      }
      else{
        console.log("Items are added succesfully")
      }
    })
    res.redirect("/")
   }

 else{
     res.render('ToDoList',{listTitle:"Today",newListItems:foundItems})

 }

})

})

app.get("/:customlistName",function(req,res){
  const customListName=_.capitalize(req.params.customlistName)

  List.findOne({name:customListName},function(err,foundList){
  if(!foundList){
    //create a new list
    const list=new List({
      name:customListName,
      items:defaultItems
    })
    list.save()
    res.redirect("/"+customListName)

  }
  else{
    //show an existing list

    res.render('ToDoList',{listTitle:customListName,newListItems:foundList.items})
  }
  })


})
app.post("/",function(req,res){
  console.log(req.body)
  //text of the textBox
  const newItem=req.body.newItem
  //name of the list
  const listName=req.body.list
  const item=new Item({
    name:newItem
  })
  //we check if we are at the root route
  if(listName==="Today"){
  item.save()
  res.redirect("/")
}

else{
  List.findOne({name:listName},function(err,foundList){
    foundList.items.push(item)
    foundList.save()
    res.redirect("/"+listName)
  })
}

})
app.post("/delete",function(req,res){
  //In this function we need to know if we are going to delete item from the main list or from the custom list
  //req.body.checkbox is the value of the check box
  const id=req.body.checkbox
  //getting the name of the list
  const listName=req.body.listName
  if(listName==="Today"){
  Item.deleteOne({_id:id},function(err){
    if(!err){
      console.log("Deleted successfully")
      res.redirect("/")
    }
  })
}
else{
  //$pull operator removes from an existing array all instances of value or values that match a specific condition
  List.findOneAndUpdate({name:listName},{$pull:{items:{_id:id}}},function(err,foundList){
    if(!err){
      res.redirect("/"+listName)
    }
  })
}
})
app.get("/work",function(req,res){
  res.render('ToDoList',{listTitle:"Work",newListItems:workItems})
})
app.get("/about",function(req,res){
  res.render("about")
})

app.listen('3000',function(){
  console.log("server is listening at port 3000")
})
