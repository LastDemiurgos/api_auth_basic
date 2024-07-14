import db from '../dist/db/models/index.js';
import bcrypt from 'bcrypt';

// Función para crear un usuario lo deje asi para visual mia todo junto . . . 
const createUser = async (req) => {
    const { name, email, password, password_second, cellphone } = req.body;
    if (password !== password_second) {
        return { code: 400, message: 'Passwords do not match' };
    }
    const user = await db.User.findOne({ where: { email: email } });
    if (user) {
        return { code: 400, message: 'User already exists' };
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.User.create({
        name,
        email,
        password: encryptedPassword,
        cellphone,
        status: true
    });
    return { code: 200, message: 'User created successfully with ID: ' + newUser.id };
};

// Función para obtener un usuario por ID
const getUserById = async (id) => {
    const user = await db.User.findOne({ where: { id: id, status: true } });
    return { code: 200, message: user };
}

// Función para actualizar un usuario
const updateUser = async (req) => {
    const user = await db.User.findOne({ where: { id: req.params.id, status: true } });
    const payload = {};
    payload.name = req.body.name ?? user.name;
    payload.password = req.body.password ? await bcrypt.hash(req.body.password, 10) : user.password;
    payload.cellphone = req.body.cellphone ?? user.cellphone;
    await db.User.update(payload, { where: { id: req.params.id } });
    return { code: 200, message: 'User updated successfully' };
}

// Función para eliminar un usuario (cambio de estado)
const deleteUser = async (id) => {
    await db.User.update({ status: false }, { where: { id: id } });
    return { code: 200, message: 'User deleted successfully' };
}

// Función para obtener todos los usuarios activos
const getAllActiveUsers = async () => {
    const users = await db.User.findAll({ where: { status: true } });
    return { code: 200, message: users };
}

// Función para buscar usuarios con filtros
const findUsers = async (query) => {
    const { deleted, name, loginBefore, loginAfter } = query;
    let whereClause = {};
    // Filtrar por estado eliminado
    if (deleted !== undefined) {
        whereClause.status = deleted === 'true' ? false : true;
    }
        // Filtrar por nombre parcial o total
    if (name) {
        whereClause.name = { [db.Sequelize.Op.like]: `%${name}%` };
    }
        // Filtrar por fecha de último inicio de sesión antes de una fecha específica
    if (loginBefore) {
        whereClause.lastLogin = { [db.Sequelize.Op.lt]: new Date(loginBefore) };
    }
        // Filtrar por fecha de último inicio de sesión después de una fecha específica
    if (loginAfter) {
        if (!whereClause.lastLogin) whereClause.lastLogin = {};
        whereClause.lastLogin[db.Sequelize.Op.gt] = new Date(loginAfter);
    }
    // Buscar usuarios en la base de datos según los filtros aplicados
    const users = await db.User.findAll({ where: whereClause });
    return { code: 200, message: users };
}

// Función para crear usuarios en bulk
const bulkCreateUsers = async (users) => {
    let successCount = 0;
    let failCount = 0;

    for (const user of users) {
        try {
            const newUser = {
                ...user,
                password: await bcrypt.hash(user.password, 10),
                status: true,
                lastLogin: new Date()
            };
            await db.User.create(newUser);
            successCount++;
        } catch (error) {
            failCount++;
        }
    }

    return { code: 200, message: { successCount, failCount } };
}

export default {
    createUser,
    getUserById,
    updateUser,
    deleteUser,
    getAllActiveUsers,
    findUsers,  //funcion añadida
    bulkCreateUsers //funcion añadida
}
