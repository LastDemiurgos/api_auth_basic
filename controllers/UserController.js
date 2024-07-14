import UserService from '../services/UserService.js';

// Endpoint para crear un usuario (existente)
const createUser = async (req, res) => {
    const response = await UserService.createUser(req);
    res.status(response.code).json(response.message);
};

// Endpoint para obtener un usuario por ID (existente)
const getUserById = async (req, res) => {
    const response = await UserService.getUserById(req.params.id);
    res.status(response.code).json(response.message);
};

// Endpoint para actualizar un usuario por ID (existente)
const updateUser = async (req, res) => {
    const response = await UserService.updateUser(req);
    res.status(response.code).json(response.message);
};

// Endpoint para eliminar un usuario por ID (existente)
const deleteUser = async (req, res) => {
    const response = await UserService.deleteUser(req.params.id);
    res.status(response.code).json(response.message);
};

// Nuevo endpoint para obtener todos los usuarios activos
const getAllUsers = async (req, res) => {
    const response = await UserService.getAllActiveUsers();
    res.status(response.code).json(response.message);
};

// Nuevo endpoint para buscar usuarios con filtros
const findUsers = async (req, res) => {
    const response = await UserService.findUsers(req.query);
    res.status(response.code).json(response.message);
};

// Nuevo endpoint para crear usuarios en bulk
const bulkCreate = async (req, res) => {
    const response = await UserService.bulkCreateUsers(req.body);
    res.status(response.code).json(response.message);
};

// Exportar las funciones para que puedan ser usadas en las rutas
export default {
    createUser,
    getUserById,
    updateUser,
    deleteUser,
    getAllUsers,
    findUsers,
    bulkCreate
};
