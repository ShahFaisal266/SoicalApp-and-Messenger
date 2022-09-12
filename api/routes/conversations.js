const router = require("express").Router();
const Conversation = require("../models/Conversation");
//New Conv
router.post("/",async (req,res)=>{
    const newConversation= new Conversation({
        members:[req.body.senderId,req.body.receiverId], 
    });
    try{
        const savedConservation = await newConversation.save();
        res.status(200).json(savedConservation);
    }catch(err)
    {res.status(500).json(err);

    }
});

//Get Conv

router.get("/:userId",async (req,res)=>{
    try{
        const conservation = await  Conversation.find({
            members: { $in: [req.params.userId] },
        });
    res.status(200).json(conservation);
    
}
    catch(err)
    {
        res.status(500).json(err);
    }
});

//get conv include  two users
router.get("/find/:firstUserId/:secondUserId",async (req,res)=>{
    try{
        const conversation = await Conversation.findOne({
            members:{ $all: [req.params.firstUserId,req.params.secondUserId]},

        });
        res.status(200).json(conversation);
    }
    catch(err)
    {
        res.status(500).json(err);     
    }
});

module.exports = router;