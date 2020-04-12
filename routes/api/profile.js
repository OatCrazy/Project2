const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

const auth = require('../../middleware/Auth')
const Profile = require("../../models/Place");



router.get('/myprofile' ,auth,async (req,response,next) =>{
    const user =req.user
    try {

        const trasaction = await Profile.find( {_uid: user._id} )
        response.status(200).json(trasaction)
    } catch (error) {
        response.status(500).json({error: error.message})
    }
    
    
})


router.post('/myprofile',auth, async (req,res) =>{
    const user = req.user
    const t    = new Profile(req.body)
    t._uid = user._id

    try {
        await t.save()
        res.status(200).json(t)
    } catch (error) {
        res.status(500).json({error:'Post Error '+ error.message})
    }



})
router.put('/myprofile/:id', auth ,async(req,response)=>{
    const user = req.user
    const update_t ={
        name: req.body.name,
        amount: Number(req.body.amount),
        update: new Date()
    }
t._uid = user._id
    try {
        const t = await Profile.findByIdAndUpdate(req.params.id, update_t,{new: true})
        if(!t){
        response.status(404).json({error : 'update::Not found'})
    }else {
        response.status(200).json(t)
    }
    } catch (error) {
        response.status(500).json({error:'Update::' + error.message})
    }
})

router.delete('/myprofile/:id',auth,async (req,response)=>{
    const user = req.user
t._uid = user._id
try {
    const t = await Profile.findById(req.params.id)
    response.status(200).json({error:'Delete::Suuscss'})
} catch (error) {
    response.status(404).json({error:'404'})
}

    

})

router.get('/myprofile/:id',auth, async(req,response,next) =>{
const user = req.user
t._uid = user._id
    try {
        const t = await Profile.findById(req.params.id)
        console.log(req.params.id)
        
        if (!t){
            response.status(404).json({error:'not found'})
        }
        response.status(200).json(t)
        
    } catch (error) {
        response.status(404).json({error:"get..."})
    }



})

module.exports = router;