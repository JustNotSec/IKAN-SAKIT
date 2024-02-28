const fs = require("fs");
const https = require("https");

// Daftar URL yang akan diambil datanya
const urlList = [
    "https://api.proxyscrape.com/v2/?request=getproxies&protocol=http&timeout=10000&country=all&ssl=all&anonymity=anonymous",
    "https://raw.githubusercontent.com/clarketm/proxy-list/master/proxy-list-raw.txt",
    "https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/http.txt",
    "https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/http.txt",
    "https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/http.txt",
    "https://raw.githubusercontent.com/hookzof/socks5_list/master/proxy.txt"];

// Menghapus file lama (jika ada)
if (fs.existsSync("proxy.txt")) {
    fs.unlinkSync("proxy.txt");
}

// Array untuk menyimpan proxy yang telah ditemukan
let foundProxies = [];

async function fetchProxies(url) {
    return new Promise((resolve, reject) => {
        https.get(url, { timeout: 3000 }, (res) => {
            let data = "";
            res.on("data", (chunk) => {
                data += chunk;
            });
            res.on("end", () => {
                // Filterisasi baris yang hanya mengandung format "ip:port"
                const proxies = data.match(/\d+\.\d+\.\d+\.\d+:\d+/g);
                if (proxies) {
                    for (let i = 0; i < proxies.length; i++) {
                        // Cek apakah proxy sudah ada dalam array found_proxies
                        if (foundProxies.includes(proxies[i])) {
                            continue;
                        }

                        // Tambahkan proxy ke dalam array found_proxies dan file proxy.txt
                        foundProxies.push(proxies[i]);
                        fs.appendFileSync("proxy.txt", proxies[i] + "\n");

                        // Keluar dari loop jika jumlah proxy sudah mencapai 7000
                
                    }
                }
                resolve();
            });
            res.on("error", (error) => {
                console.log(`Failed to fetch proxies from ${url}: ${error.message}`);
                reject(error);
            });
        });
    });
}

async function main() {
    try {
        // Acak urutan urlList
        const shuffledUrls = urlList.sort(() => 0.5 - Math.random());

        // Looping untuk mengambil data dari masing-masing URL dan menyimpan ke dalam file
        for (let i = 0; i < shuffledUrls.length; i++) {
            await fetchProxies(shuffledUrls[i]);
        }

        console.log(`Successfully scanned ${foundProxies.length} proxies`);
    } catch (error) {
        console.log(`An error occurred: ${error.message}`);
    }
}

main();
