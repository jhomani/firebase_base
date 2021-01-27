# backendws19 - Worldstats 19
Backend del sistema Worldstats. NodeJS + Express

Url Heroku Backend:  https://ws19.herokuapp.com/
Rutas del Backend
* Login: METHOD POST  https://ws19.herokuapp.com/loginUser
  - POST { email: string, password: string }
  - REQUEST { code: 200 }
  - REQUEST ERROR => { code: 404 }
* Registro: METHOD POST  https://ws19.herokuapp.com/registerUser   
  - POST { firtname: string, lastname: string, email: string, password: string } 
  - REQUEST { code: 200 }
  - REQUEST ERROR => { code: 404 }
* Modificar Usuario: METHOD PUT  https://ws19.herokuapp.com/updateUser
  - POST { id: number, firtname: string, lastname: string, email: string, password: string } 
  - REQUEST SUCCESS => { code: 200 }
  - REQUEST ERROR => { code: 404 }

NOTA: No requiere de *Bcrypt* ni *JWT*
