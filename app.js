// jshint esversion:6
// ! Importing  modules
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
console.log(process.env.API_KEY)
import { Configuration, OpenAIApi } from "openai";
import express from "express";
import bodyParser from "body-parser";
import cors from 'cors';
const app=express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(cors());
const configuration = new Configuration({
    apiKey: process.env.API_KEY,
});
const openai = new OpenAIApi(configuration);
var data1;
var info;
app.get("/",function(req,res){
    res.sendFile(__dirname+"/index.html");
});
app.post("/saved_message",function(req,res){
            console.log(req.body);
            res.send({success:true});
})
app.get("http://localhost:3002/",function(req,res){
    
});
app.post("/",function(req,res){
    console.log("No");
    res.redirect("http://localhost:3002/");
});
app.post("/receivemsg",async function(req,res){
    const prompt=req.body.inputChat;
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content:"give counter for: "+prompt+" in short"}],
    }); 
    res.send({"response":completion.data.choices[0].message});

});
app.post("/read",async function(req,res){
    data1=req.body.inputText;
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content:"Explain in details about: "+data1+" under 200 words"}],
    }); 
    data1=data1[0].toUpperCase()+data1.slice(1);
    info=completion.data.choices[0].message.content;
    res.redirect("/read");
    console.log("YES");

});
app.get("/read",async function(req,res){
    res.render("read",{materialTitle:data1,readMaterial:info});
});
app.listen(3000,function(){
    console.log("Server started on port 3000");
});

