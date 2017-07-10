###Generate a Private Key and a CSR

Use this method if you want to use HTTPS (HTTP over TLS) to secure your Apache HTTP or Nginx web server, and you want to use a Certificate Authority (CA) to issue the SSL certificate. The CSR that is generated can be sent to a CA to request the issuance of a CA-signed SSL certificate. If your CA supports SHA-2, add the -sha256 option to sign the CSR with SHA-2.

This command creates a 2048-bit private key (domain.key) and a CSR (domain.csr) from scratch:

    openssl req \
       -newkey rsa:2048 -nodes -keyout domain.key \
       -out domain.csr


###Generate a Self-Signed Certificate

Use this method if you want to use HTTPS (HTTP over TLS) to secure your Apache HTTP or Nginx web server, and you do not require that your certificate is signed by a CA.

This command creates a 2048-bit private key (domain.key) and a self-signed certificate (domain.crt) from scratch:

    openssl req \
           -key domain.key \
           -new \
           -x509 -days 365 -out domain.crt
