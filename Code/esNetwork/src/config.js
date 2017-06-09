export const regex = {
    email: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
    textOnly: /[^a-zA-Z0-9\s]/g
};

export const colors = {
    lightText: '#CED3D9',
    main: '#3D68EB',
    error: '#EF9C7A',
    inactive: '#828486',
    mainText: '#FFF'
};

export const network = {
    server: 'http://143.167.71.24:3001/'
};

const lang = {
                en: {
                        email: 'Email',
                        email_ph: 'Enter your email',
                        password: 'Password',
                        password_ph: 'Enter your password',
                        login: 'Log in',
                        forgot: 'Forgot password',
                        signup: 'Sign up',
                        name: 'Name',
                        lastName: 'Last name',
                        invalidEmail: 'Invalid email address'
                },
                es: {
                        email: 'Email',
                        email_ph: 'Ingrese su email',
                        password: 'Contraseña',
                        password_ph: 'Ingrese su contraseña',
                        login: 'Entrar',
                        forgot: 'Olvidé mi contraseña',
                        signup: 'Crear cuenta',
                        name: 'Nombre',
                        lastName: 'Apellido',
                        invalidEmail: 'El email es inválido'
                }

             };

export const texts = lang.es;
