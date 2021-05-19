import jwt from 'jsonwebtoken'
import config from "../config";

import User from '../models/User';
import Role from '../models/Role'
export const verifyToken = async (req, res, next)=>{

   try {
    const token = req.headers["x-access-token"];

    if(!token) return res.status(403).json({message: "Token Invalido"});

  const decoded = jwt.verify(token, config.SECRET);

  req.userId = decoded.id;

  const user =  await User.findById(req.userId,{password: 0 });

  if(!user) return res.status(404).json({message:'Usuario no existe'});
  

    next();
   } catch (error) {
       return res.status(401).json({message: 'No Autorizado'})
   }
};

export const isOperator = async (req, res, next)=>{
const user = await User.findById(req.userId)
const roles = await Role.find({_id: {$in: user.roles}})

for (let i = 0; i< roles.length; i++){
  if(roles[i].name === "operator"){
    next()
    return;
  }
  
}
return res.status (403).json({message: "Requiere el rol de Operador"})

next();
}

export const isAdmin = async (req, res, next)=>{
  const user = await User.findById(req.userId)
  const roles = await Role.find({_id: {$in: user.roles}})
  
  for (let i = 0; i< roles.length; i++){
    if(roles[i].name === "admin"){
      next()
      return;
    }
    
  }
  return res.status (403).json({message: "Requiere el rol de Administrador"});
  
  next();
}