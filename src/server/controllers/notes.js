/**
 * * notes Controllers 
 */


 //Dependencies
 const Notes = require("../models/Notes");
 const validator = require("../models/Notes/validator")

 //container of the module
 const lib = {};

 lib.create = (req,res) => {
     const details = req.body
     const valid = validator(details);
     console.log("valid",valid)
     if(valid.error) return res.status(400).send({ error : "Missing required fields"})
     Notes.create(details).then( notes => {
         return res.status(200).send(notes)
     })
     .catch( error => {
         console.log("error",error)
         return sendStatus(500)
     })
 }

 //Retreving a specific note
lib.getNotes = async (req,res) => {
    //Required data
    let {id} = req.params;
    id = typeof id == 'string' && id.trim().length > 0 ? id.trim() : false;

    if( !id) return	res.status(400).json({error:'Missing Required fields'})

    let notes = await Notes.findById(id).catch( ()=> console.log('failed to get Notes') );

    if(!notes) return res.sendStatus(404);
    res.status(200).send(notes);
     

};


//Retreving a specific user
lib.getAll = async (req,res) => {
    //Required data
    let notes = await Notes.find({}).catch( ()=> console.log('failed to get notes') );
    if(!notes) return res.sendStatus(404);
    
    res.status(200).send(notes);

};

//Updating  Notes
lib.updateNotes = async (req,res) => {
    const details = req.body
    const { id } = req.params
    if(!id) return res.status(400).send({error : 'Missing required fields'})
    const valid = validator(details);
     if(valid.error) return res.status(400).send({ error : "Invalid data format"})
    //save the new user date
    let notes = await Notes.findByIdAndUpdate(id,details,{new:true});
    if(!notes) return res.sendStatus(404);
    return res.status(200).send(notes);
        

};

//Delete a Notes
lib.deleteNotes = async (req,res,next) => {
    //Required data
    let {id} = req.params;
    id = typeof id == 'string' && id.trim().length > 0 ? id.trim() : false;
    if(id){
        let notes = await Notes.findByIdAndRemove(id).catch( () => console.log("failed to get Notes"));
        if(!notes) return res.sendStatus(404);
        
        res.status(200).send(notes)
    }else{
     return	res.status(400).json({error:'Missing Required fields'})
    }
};






 //Exportations of tge module
 module.exports = lib