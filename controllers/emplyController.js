const emply=require('../models/employeeModel')
const path = require("path");
const fs=require('fs')


const viewHome = async (req, res) => {
  res.render("main");

}

const profilepage= async(req,res) => {
  res.render("profilepage");
}


//getting all employee

const all_employees= async(req,res ) => {
try {
  const Employees= await emply.find();

  res.status(200).json(Employees)
  
} catch (error) {
  console.log(error)
  res.status(404).json("unable to get employee details")
  
}
 

}

//adding  employeee

const add_employee=async(req,res) =>{



  const{salutation,firstname,lastname,username,password,dob,gender,address,email,phone,qualifications,country,state,city,pincode}=req.body;

 

  if(!firstname|| !phone ||!email ||!salutation ||!lastname ||!username ||!password || !dob || !gender ||!address||!qualifications||!country||!state||!city||!pincode )
  {
   res.status(404).json("All fields are mandatory")
    return
  }

  try {
    
    const Create_employee= await emply.create({

      salutation,firstname,lastname,username,password,dob,gender,address,email,phone,qualifications,country,state,city,pincode
  
  
    })
    res.status(200).json({
  
      status: "success",
        Employe_id: Create_employee.id,
        message: "Employee creation successful",
    })
    console.log(`the requested bodyis :`, req.body)

  } catch (error) {

    console.log(error);
    res.status(400).json({
      status: "failed",
      message: "Employee creation failed",
    });
    
  }
 

}

// Getting an employee 
const get_employee= async (req,res) => {
  const employe= await emply.findById(req.params.id)
  if(!employe){

    res.status(404).json("employee not found")
    return
  }
  res.status(200).json(employe)
}

//editting an employee 

const update_employee=async (req,res) => {

  // console.log(req.body)
  const employe=await emply.findById(req.params.id)
  if(!employe){
    res.status(404).json("employee not found")
    return
  }
  const updated_employe= await emply.findByIdAndUpdate(
    req.params.id,
    req.body,
    {new: true}
  
  );
  res.status(200).json({
    status: "Success",
    message: "employee updated successfully",
    employees:updated_employe
  })
}

//deleting an employee 

const del_employee=async (req,res) => {
  const employ=await emply.findByIdAndDelete(req.params.id)

    if(!employ){

      res.status(404).json("employee not found")
      return
    }

  
    const imagepath=path.join(__dirname,"..","public","images",`${req.params.id}.png`)

  
   fs.unlinkSync(imagepath);


    res.status(200).json({
      status: "Success",
      message: "Employee deleted successfully",
    });

  }


  const postavatar= async (req, res) => {
    
    console.log("Received file:", req.file);
    console.log("Request params:", req.params);
    
    if (req.file) {
  
        const avatarPath = `/images/${req.file.filename}`;
        await emply.findByIdAndUpdate(req.params.id, { avatar : avatarPath});
  
        console.log('Image uploaded successfully...............');
        res.status(200).json({ message: 'Image uploaded successfully...............' });
    } else {
        console.log('No file uploaded');
        res.status(400).json({ message: 'Failed to upload image...............' });
    }
  }

  const logout=(req,res) => {

    res.clearCookie("token");
  req.session.message = {
    type: "success",
    info: "You are successfully loged out",
  };
  req.flash('message', req.session.message.info)
  return res.redirect("/user/login");

  }

module.exports={all_employees,add_employee,get_employee,update_employee,del_employee,viewHome,postavatar,profilepage,logout}