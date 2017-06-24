class Config {}



Config.regex = {
    email: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
    textOnly: /[^a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ\s]/g
};

Config.colors = {
    lightText: '#CED3D9',
    main: '#3D68EB',
    darkMain: '#3457C3',
    error: '#EF9C7A',
    inactive: '#828486',
    mainText: '#FFF',
    elementBackground: '#FFF',
    alternateColor: '#08C2A5',
    veryLight: '#E1E4E8',
    contrastColor: '#32394A',
    contrastColorDark: '#2E3543'
};

Config.network = {
    server: 'http://143.167.71.24:3001/',
    wsServer: 'ws://143.167.71.24:9998/task'
};

const lang = {
                en: {   //Login Page
                        email: 'Email',
                        email_ph: 'Enter your email',
                        password: 'Password',
                        password_ph: 'Enter your password',
                        login: 'Log in',
                        forgot: 'Forgot password',
                        signup: 'Sign up',
                        invalidEmail: 'Invalid email address',
                        loginFailed: 'Login failed. ',
                        //Register Page
                        names: 'Name(s)',
                        firstLastName: 'Last name',    
                        secondLastName: 'Second last name',
                        dateOfBirth: 'Date of birth',
                        phone: 'Phone',
                        ext: 'Extension',
                        mobile: 'Mobile',
                        //Profile
                        contactInfo: 'Contact Information',
                        //PageTitles
                        accountSettings: 'Account Settings',
                        feed: 'Feed',
                        profileImage: 'Profile Image',
                        register: 'Register',
                        logout: 'Logout',
                        tasks: 'Tasks',
                        //Task Card
                        addTeam: '[Team]',
                        addProject: '[Project]',
                        newTask: 'New task',
                        comment: 'Comment',
                        days: {
                                0: 'Sunday',
                                1: 'Monday',
                                2: 'Tuesday',
                                3: 'Wednesday',
                                4: 'Thursday',
                                5: 'Friday',
                                6: 'Saturday'                            
                        },
                        month: {
                                0: 'Jan',
                                1: 'Feb',
                                2: 'Mar',
                                3: 'Apr',
                                4: 'May',
                                5: 'Jun',
                                6: 'Jul',
                                7: 'Aug',
                                8: 'Sep',
                                9: 'Oct',
                                10: 'Nov',
                                11: 'Dec'                            
                        }
                },
                es: {   //Login page
                        email: 'Email',
                        email_ph: 'Ingrese su email',
                        password: 'Contraseña',
                        password_ph: 'Ingrese su contraseña',
                        login: 'Entrar',
                        forgot: 'Olvidé mi contraseña',
                        signup: 'Crear cuenta',
                        invalidEmail: 'El email es inválido',
                        loginFailed: 'Error de inicio de sesión.',
                        //Register PAge
                        names: 'Nombre(s)',
                        firstLastName: 'Apellido Paterno',      
                        secondLastName: 'Apellido Materno',
                        dateOfBirth: 'Fecha de nacimiento',
                        phone: 'Telefono',
                        ext: 'Extensión',
                        mobile: 'Celular',
                        //Profile
                        contactInfo: 'Información de Contacto',                        
                        //PageTitles
                        accountSettings: 'Configuración de la cuenta',
                        feed: 'Actualizaciones',
                        profileImage: 'Imagen de Perfil',
                        register: 'Registrarse',
                        logout: 'Salir',
                        tasks: 'Tareas',
                        //Task Card
                        addTeam: '[Equipo]',
                        addProject: '[Proyecto]',
                        newTask: 'Nueva Tarea',
                        comment: 'Comentar',
                        days: {
                                0: 'Domingo',
                                1: 'Lunes',
                                2: 'Martes',
                                3: 'Miércoles',
                                4: 'Jueves',
                                5: 'Viernes',
                                6: 'Sábado'                            
                        },
                        month: {
                                0: 'Ene',
                                1: 'Feb',
                                2: 'Mar',
                                3: 'Abr',
                                4: 'May',
                                5: 'Jun',
                                6: 'Jul',
                                7: 'Aug',
                                8: 'Sep',
                                9: 'Oct',
                                10: 'Nov',
                                11: 'Dic'                            
                        }
                }

             };

Config.texts = lang.es;

export { Config };
