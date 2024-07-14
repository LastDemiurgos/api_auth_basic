import express from 'express';
import userController from '../controllers/UserController.js';

const router = express.Router();

// Definir las rutas
router.get('/getAllUsers', userController.getAllUsers);
router.get('/findUsers', userController.findUsers);
router.post('/bulkCreate', userController.bulkCreate);
router.post('/create', userController.createUser);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;
