const express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;

var { Question } = require('../models/questions');

var levelEnum = {
    1:"easy",
    2:"moderate",
    3:"difficult",
  };
  var validUrl=["easy","moderate","difficult"];

//localhost:3000/questions -GET
router.get('/:difficulty', (req, res) => {
    console.log(req.param);
   
        Question.find((err, docs) => {
            if (!err && validUrl.includes(req.params.difficulty)) { 
                if (docs.length>0)
                res.send(docs); 
                else
                res.send("No quesions to display");
            }
            else { 
                res.status(404).send(`404- Error in url /${req.params.difficulty}`);
            }
        }).byDifficulty(req.params.difficulty);

});

//get all questions
router.get('/',(req,res) => {
    console.log("in get base url questions/");
    Question.find((err, docs) => {
        if(!err){
            res.status(200).send(docs);
    }
        else
        {
         res.status(400).send('something went wrong in get method. 400 Bad request');
         console.log(err);
        }
    });
});

//get by id: /find added to avoid conflict with get with /:difficulty. 
router.get('/find/:id',(req,res) => {
    console.log("in get base url questions/");
    Question.findById(req.params.id,(err, docs) => {
        if(!err){
            res.status(200).send(docs);
    }
        else
        {
        if (!validUrl.includes(req.params.id))
        {
         res.status(400).send('400 Bad request- Incorrect search parameter/_Id');
         console.log(err);
        }
        }
    });
});


//POST
router.post('/add', (req, res) => {
    //res.send('/add/'+req.params.difficulty);
    //TODO- replace hardcoded value with angular's json (validated)
    var que=new Question({
        Qn: req.body.Qn,
        QnId: req.body.QnId,
        level: req.body.level,
        //Category: req.body.Category,
        difficulty: levelEnum[req.body.level],
        //QuestonBank: req.body.QuestonBank,
        Options: req.body.Options,
        Answer: req.body.Answer
      });

  //if req.body.level==1, save to specific collection can be done
  //if we are to separate the collections later
      que.save((err, doc) => {
        if (!err) { 
            res.status(201).send(doc);
            console.log("POST successful"+doc);
         }
        else { console.log('Error in Add Question:' +err); }
    });
}); 

// findOneAndDelete or findOneAndRemove

//PUT
router.put('/:id', (req, res) => {
  
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

        var que={
            Qn: req.body.Qn,
            QnId: req.body.QnId,
            level: req.body.level,
            //Category: req.body.Category,
            difficulty: levelEnum[req.body.level],
            //QuestonBank: req.body.QuestonBank,
            Options: req.body.Options,
            Answer: req.body.Answer};
    Question.findByIdAndUpdate(req.params.id, { $set: que }, { new: true }, (err, doc) => {
        if (!err) { res.status(200).send(doc); }
        else { console.log('Error in Question Update :' + err); }
    });
});

//DELETE
router.delete('/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    Question.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error deleting question:' + JSON.stringify(err)); }
    });
});




module.exports = router;