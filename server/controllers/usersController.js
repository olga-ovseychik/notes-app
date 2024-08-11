import { User } from "../models/userModel.js";
import { Note } from "../models/noteModel.js";

export const registerNewUser = async (req, res) => {
    const { firstName, lastName, email, password, roles } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(409).send({message: "User already exists"});
    }
    
    try {
        const user = new User({ 
            firstName,
            lastName,
            email,
            password,
            roles
         });
         
         await user.save();

         if (user) {
            res.status(201).send({ message: `User ${firstName} ${lastName} has been created` });
         } else {
            res.status(400).send({ message: 'Invalid user data received' });
         }
    } catch (error) {
        res.status(500).send(error);
    }
}

export const getUser = async (req, res) => {
    const { id } = req.params;

    const user = await User.findById(id);

    if (user) {
        res.status(200).send(user);
    } else {
        res.status(404).send({ message: 'User not found'});
    }
}

export const updateUserProfile = async (req, res) => {
    const { id, firstName, lastName, email, password, roles } = req.body;
    
    const user = await User.findById(id).exec();
  
    if (user) {
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.email = email || user.email;
      
      if (password) {
        user.password = password;
      }

      if (roles) {
        user.roles = roles;
      }
  
      const updatedUser = await user.save();
  
      res.send({ message: `User ${updatedUser.firstName} ${updatedUser.lastName} has been updated` });
    } else {
      res.status(400).send({ message: 'User not found' });
    }
  };


export const deleteUser = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).send({ message: 'User ID Required' })
    }

    const user = await User.findById(id).exec();

    if (!user) {
        return res.status(400).send({ message: 'User not found' })
    }

    const relatedNotes = await Note.deleteMany({user: id});
    const deletedUser = await user.deleteOne();

    res.status(200).send({ message: `User has been deleted` });
}