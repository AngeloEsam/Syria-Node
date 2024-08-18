const sheetModel = require("../models/sheetModel");
const excelToJson = require("convert-excel-to-json");
const fs = require("fs-extra");
const path=require('path');



const insertSheet = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file found" });
    } else {
      var filePath='upload/'+req.file.filename;
      
    
      const excelData = excelToJson({
        sourceFile: filePath,
        header: {
          rows: 1,
        },
        columnToKey: {
          "A": "name",
          "B": "nickname",
          "C": "fatherName",
          "D": "motherName",
          "E": "year",
          "F": "place",
          "G": "governorate",
          "H": "city",
          "I": "elhy",
          "J": "grom",
          "K": "notes",
          "L": "responsibleAuthority",
          "M": "extraInfo",
        },
      });
      let arrayToInsert = [];

      for (var i = 0; i < excelData.data.length; i++) {
        var singleRow = {
            name: excelData.data[i]["name"],
            nickname:excelData.data[i]["nickname"],
            fatherName: excelData.data[i]["fatherName"],
            motherName: excelData.data[i]["motherName"],
            year: excelData.data[i]["year"],
            place:excelData.data[i]["place"],
            governorate:excelData.data[i]["governorate"],
            city:excelData.data[i]["city"],
            elhy: excelData.data[i]["elhy"],
            grom: excelData.data[i]["grom"],
            notes:excelData.data[i]["notes"],
            responsibleAuthority: excelData.data[i]["responsibleAuthority"],
            extraInfo: excelData.data[i]["extraInfo"],
           
        };
        arrayToInsert.push(singleRow);
      }
      const data = await sheetModel.insertMany(arrayToInsert);
   
      await fs.unlink(filePath);
      res.status(201).json({ message: "success", data });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Sorry, something went wrong...");
  }
};


const getSheet = async (req, res) => {
  const data = await sheetModel.find({});
  res.status(200).json({ message: "sucess", data: data });
};


const addRow = async (req, res) => {
  try {  
      const {name,nickname,fatherName,motherName,year,place,governorate,city,grom,notes,responsibleAuthority,extraInfo} = req.body;
      const addNewRow = await sheetModel.create({name,nickname,fatherName,motherName,year,place,governorate,city,grom,notes,responsibleAuthority,extraInfo});
     console.log(addNewRow.data)
      res.status(200).json({ success: 'Row added successfully', data: addNewRow });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
}
const getSingleRow= async (req,res)=>{
  const {id} = req.params;
  const singleRow=await sheetModel.findById(id);
  res.json(singleRow);
}
const  deleteRow =async (req,res)=>{
  const { id } = req.params;
  const  deletedRows=await sheetModel.findByIdAndDelete(id)
  if(!deletedRows){
    return res.status(404).json('The row with the given ID was not found.')
  }else{
    res.json({message:'Deleted Successful'})
  }
}

const searchByName=async (req, res) => {
  try {
    
    const {name,nickname,fatherName}= req.query;
    const rows = await sheetModel.find({   
        name: name ,
        nickname:nickname,
        fatherName:fatherName
    });
    
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
module.exports = {
 insertSheet,
  getSheet,
  addRow,
  getSingleRow,
  deleteRow,
  searchByName
};
