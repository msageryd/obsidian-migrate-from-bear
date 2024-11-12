# Authentication in PlanTrail - Cognito, Auth0, Okta, Supertokens

#plantrail/security

[🛑 You don't need passport.js - Guide to node.js authentication ✌️](https://softwareontheroad.com/nodejs-jwt-authentication-oauth/)

[Top Auth0 alternatives: Auth0 vs Okta vs Cognito vs SuperTokens 2022](https://supertokens.com/blog/auth0-alternatives-auth0-vs-okta-vs-cognito-vs-supertokens)



## Argon 2
Apparently Argon2 is the "new black" when it comes to password hashing. We should probably switch, but:
- [ ] Argon2 is not natively supported in nodejs.crypto
- [ ] Will not get supported before Argon2 is in OpenSSL
- [ ] OpenSSL 3 might get Argon2 support

[Support for Argon2 KDF · Issue #4091 · openssl/openssl · GitHub](https://github.com/openssl/openssl/issues/4091)
[KDF: Introduce Argon2i, Argon2d, Argon2id by ckalina · Pull Request #12256 · openssl/openssl · GitHub](https://github.com/openssl/openssl/pull/12256)


Argon2 is available via the NPM package `argon2`
- [ ] Do we want to use a 3:rd party lib for this?
- [ ] Part of argon2 is written i C, hence we need a binary build for Node. I.e. potential for more dependency trouble moving forward.

[How to hash, salt, and verify passwords in NodeJS, Python, Golang, and Java | Codementor](https://www.codementor.io/@supertokens/how-to-hash-salt-and-verify-passwords-in-nodejs-python-golang-and-java-1sqko521bp)
