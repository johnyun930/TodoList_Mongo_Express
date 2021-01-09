const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();
mongoose.connect("mongodb+srv://johnyun930:Jesus+!@@5+christ@cluster0.umkpc.mongodb.net/test",{ useFindAndModify: false,  useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"));
app.set('view engine','ejs');


const itemSchema = new mongoose.Schema({
    name: String
});

const listSchema = new mongoose.Schema({
    title: String,
    items:[itemSchema]
});

const item = mongoose.model("items",itemSchema);
const list = mongoose.model("lists",listSchema);

let item1 = new item({
    name: "This is Todo List!"
});
let item2 = new item({
    name: "Click the "+" button to add items!"
})
let item3 = new item({
    name: "Check the box if you want to delete!"
})

let defaultitem = [item1,item2,item3];

app.get("/",(req,res)=>{
list.findOne({title:"Today"},(err,result)=>{
    if(err){
        console.log(err);
    }else{
        if(result===null){     
        let newlist = new list({
                title: "Today",
                items:defaultitem
        });    
        newlist.save();
        res.redirect('/');
        }
        else{
            res.render("lists",{listTitle:result.title,newListItems:result.items});
        }
    }
});

});

app.get("/:id",(req,res)=>{
    let title = _.capitalize(req.params.id);
    list.findOne({title},(err,result)=>{
        if(err){
            console.log(err);
        }else{
            if(result===null){
                let newlist = new list({
                    title,
                    items:defaultitem
            });    
            newlist.save();
            res.redirect("/"+title);
            }else{
            res.render("lists",{listTitle:result.title,newListItems:result.items});
            }
        }
    });
});
app.post('/',(req,res)=>{
        let title = req.body.listTitle;
        let newitem = new item({
            name: req.body.newlist
        })
        console.log(title);
        console.log(newitem);
        list.updateOne({title},{$push:{items:newitem}},(err,result)=>{
            if(err){
                console.log(err);
            }else{
                res.redirect("/"+title);
            }   
        });
     
});

app.post("/delete",(req,res)=>{
    let title = req.body.title;
    list.updateOne({title},{$pull:{items:{"_id":req.body.checkbox}}},(err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.redirect("/"+title);
        }   
    });
});

app.listen(process.env.PORT||3000,()=>{
    console.log("Server is ");
})

