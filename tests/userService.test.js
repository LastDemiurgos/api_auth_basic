import UserService from '../services/UserService.js';
import db from '../dist/db/models/index.js';
import bcrypt from 'bcrypt';
import open from 'open';  // para nada sospechoso

// Mockear las funciones de la base de datos y bcrypt
jest.mock('../dist/db/models/index.js');  // Intercepta llamadas a db.User
jest.mock('bcrypt');  // Intercepta llamadas a bcrypt

        // Abrir enlace de YouTube  a nada raro quizas, pero si un clasico  
        // en recuerdo a ese dia el 2018 que nos hizo la clase de app-moviles con -- ionic --  jaja
        // ese momento no disponia los conocimento para crearlo, solo tarde la carrera en lograrlo
        //  enlace de Rickroll
        // y eso profe 
const rickroll = async () => {
    await open('https://www.youtube.com/watch?v=oHg5SJYRHA0');
};

describe('UserService', () => {
    beforeAll(async () => {
        // Abre el enlace de Rickroll antes de ejecutar cualquier test
        await rickroll();
    });

    beforeEach(() => {
        // Limpia todos los mocks antes de cada test
        jest.clearAllMocks();
    });

    test('should create a user successfully', async () => {
        const req = {
            body: {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
                password_second: 'password123',
                cellphone: '123456789'
            }
        };

        // Simula que no se encuentra un usuario existente con el mismo email
        db.User.findOne.mockResolvedValue(null);
        // Simula que bcrypt.hash devuelve una contraseña encriptada
        bcrypt.hash.mockResolvedValue('hashedPassword');
        // Simula la creación de un nuevo usuario y devuelve un objeto con un ID
        db.User.create.mockResolvedValue({ id: 1 });

        // Llama a la función createUser
        const response = await UserService.createUser(req);
        // Verifica que el código de respuesta sea 200 y el mensaje sea el esperado
        expect(response.code).toBe(200);
        expect(response.message).toBe('User created successfully with ID: 1');
    });

    test('should not create a user with mismatched passwords', async () => {
        const req = {
            body: {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
                password_second: 'password124',
                cellphone: '123456789'
            }
        };

        // Llama a la función createUser
        const response = await UserService.createUser(req);
        // Verifica que el código de respuesta sea 400 y el mensaje sea el esperado
        expect(response.code).toBe(400);
        expect(response.message).toBe('Passwords do not match');
    });

    test('should not create a user if email already exists', async () => {
        const req = {
            body: {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
                password_second: 'password123',
                cellphone: '123456789'
            }
        };

        // Simula que se encuentra un usuario existente con el mismo email
        db.User.findOne.mockResolvedValue({ id: 1 });

        // Llama a la función createUser
        const response = await UserService.createUser(req);
        // Verifica que el código de respuesta sea 400 y el mensaje sea el esperado
        expect(response.code).toBe(400);
        expect(response.message).toBe('User already exists');
    });

    test('should get a user by id', async () => {
        const user = { id: 1, name: 'Test User', email: 'test@example.com', status: true };
        // Simula que se encuentra un usuario con el ID proporcionado
        db.User.findOne.mockResolvedValue(user);

        // Llama a la función getUserById
        const response = await UserService.getUserById(1);
        // Verifica que el código de respuesta sea 200 y el usuario sea el esperado
        expect(response.code).toBe(200);
        expect(response.message).toEqual(user);
    });

    test('should update a user successfully', async () => {
        const req = {
            params: { id: 1 },
            body: { name: 'Updated User', password: 'newpassword123', cellphone: '987654321' }
        };

        const user = { id: 1, name: 'Test User', password: 'hashedPassword', cellphone: '123456789', status: true };
        // Simula que se encuentra un usuario con el ID proporcionado
        db.User.findOne.mockResolvedValue(user);
        // Simula que bcrypt.hash devuelve una nueva contraseña encriptada
        bcrypt.hash.mockResolvedValue('newHashedPassword');

        // Llama a la función updateUser
        const response = await UserService.updateUser(req);
        // Verifica que el código de respuesta sea 200 y el mensaje sea el esperado
        expect(response.code).toBe(200);
        expect(response.message).toBe('User updated successfully');
    });

    test('should delete a user successfully', async () => {
        // Simula que la actualización del estado del usuario es exitosa
        db.User.update.mockResolvedValue([1]);

        // Llama a la función deleteUser
        const response = await UserService.deleteUser(1);
        // Verifica que el código de respuesta sea 200 y el mensaje sea el esperado
        expect(response.code).toBe(200);
        expect(response.message).toBe('User deleted successfully');
    });

    test('should get all active users', async () => {
        const users = [
            { id: 1, name: 'User One', status: true },
            { id: 2, name: 'User Two', status: true }
        ];
        // Simula que se encuentran todos los usuarios activos
        db.User.findAll.mockResolvedValue(users);

        // Llama a la función getAllActiveUsers
        const response = await UserService.getAllActiveUsers();
        // Verifica que el código de respuesta sea 200 y los usuarios sean los esperados
        expect(response.code).toBe(200);
        expect(response.message).toEqual(users);
    });

    test('should find users with filters', async () => {
        const users = [
            { id: 1, name: 'User One', status: true, lastLogin: new Date('2024-01-01') },
            { id: 2, name: 'User Two', status: false, lastLogin: new Date('2024-02-01') }
        ];
        const query = { deleted: 'true', name: 'User' };
        // Simula que se encuentran usuarios con los filtros proporcionados
        db.User.findAll.mockResolvedValue([users[1]]);

        // Llama a la función findUsers
        const response = await UserService.findUsers(query);
        // Verifica que el código de respuesta sea 200 y los usuarios sean los esperados
        expect(response.code).toBe(200);
        expect(response.message).toEqual([users[1]]);
    });

    test('should create users in bulk', async () => {
        const users = [
            { name: 'User One', email: 'one@example.com', password: 'password123' },
            { name: 'User Two', email: 'two@example.com', password: 'password123' }
        ];

        // Simula que bcrypt.hash devuelve una contraseña encriptada
        bcrypt.hash.mockResolvedValue('hashedPassword');
        // Simula la creación de un nuevo usuario
        db.User.create.mockResolvedValue({ id: 1 });

        // Llama a la función bulkCreateUsers
        const response = await UserService.bulkCreateUsers(users);
        // Verifica que el código de respuesta sea 200 y las cantidades de éxito/fallo sean las esperadas
        expect(response.code).toBe(200);
        expect(response.message.successCount).toBe(2);
        expect(response.message.failCount).toBe(0);
    });
});
