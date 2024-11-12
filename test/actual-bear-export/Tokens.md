# Tokens
#plantrail/tokens


# Token System Overview

Our system employs three types of tokens: JWT (JSON Web Tokens), QR-tokens, and Short-tokens. Each serves a specific purpose and has unique characteristics tailored to its use case.

## JWT (JSON Web Tokens)

- **Use Case**: Used exclusively as bearer tokens in Authorization headers via OAuth2.
- **Advantages**: Standardized, widely supported, and self-contained.
- **Limitations**: 
  - Bloated for use in URLs.
  - Sensitive to conversion to lowercase (e.g., in some email clients like Outlook).

## QR-tokens

- **Structure**: 8 characters from a 34-character URL-safe set.
- **Signature**:  Generated using HMAC-SHA256, then hex-encoded and truncated to 5 characters. Hex is url safe.
- **Generation**: Cryptographically secure randomization using PostgreSQL's `gen_random_bytes`.
- **Expiration**: Never expires.
- **Use Case**: Embedding in QR codes, prioritizing simplicity and brevity.
- **Security Model**:
  - Primary security through database registration.
  - Signature serves to minimize unnecessary database hits.
- **Unique Combinations**: 34^8 ≈ 1.79 * 10^12 (1.79 trillion)
- **Entropy**: Approximately 41 bits
- **Query param:** When used in urls as query parameter, the parameter name should be `qt`, example: `https://domain.com/endpoint?st=abcdefgj.8jh98`

## Short-tokens

- **Structure**: 10 characters from a 34-character URL-safe set.
- **Timestamp**: 7-digit epoch (15-minute resolution) appended with dot separation.
- **Signature**: HMAC-SHA256, Base64URL encoded, truncated to 10 characters.
- **Expiration**: Always has an expiration.
- **Use Case**: Email links (e.g., verification links).
- **Security Model**:
  - Database registration.
  - Expiration mechanism.
  - Nightly purge of expired tokens.
- **Unique Combinations**: 34^10 ≈ 2.08 * 10^15 (2.08 quadrillion)
- **Entropy**: Approximately 51 bits
- **Query param:** When used in urls as query parameter, the parameter name should be `st`, example: `https://domain.com/endpoint?st=abcdefghij.7654321.lkk098jh98`

## Security Considerations and Mitigations

1. **Rate Limiting**: Implemented to prevent brute-force attacks and abuse.
2. **Database Registration**: All tokens (except JWTs) are registered, providing an additional layer of validation.
3. **Expiration Mechanisms**: Short-tokens have built-in expiration, limiting the window of vulnerability.
4. **Signature Verification**: Reduces unnecessary database lookups for invalid tokens.
5. **Cryptographic Randomness**: Ensures unpredictability in token generation.
6. **HMAC-SHA256 for Signatures**: Both QR-tokens and Short-tokens use HMAC-SHA256 for generating signatures, providing a robust cryptographic foundation for token integrity.

## Signing keys
Keys for signing are stored safely at AWS. Generating new keys should be performed with cryptographically safe random generator such as OpenSLL.

For Short tokens and QR tokens a key length of 256 bits is sufficient. This is also true for JWT, but to mitigate “algorithm confusion attacks” a 512 bit key is recommended for JWT.
Generate 256 bit key (32 bytes): `openssl rand -hex 32`
Generate 512 bit key (64 bytes): `openssl rand -hex 64`
## Entropy and "Hackability"

Entropy, in simple terms, is a measure of randomness or unpredictability. Higher entropy means more possible combinations and greater security against guessing attacks.

- **QR-tokens**: With 41 bits of entropy, there are about 2 trillion possible combinations. While this is substantial, the never-expiring nature necessitates additional security measures like rate limiting and database validation.

- **Short-tokens**: At 51 bits of entropy, there are over 2 quadrillion possibilities. Combined with expiration and database validation, this provides robust security for its use case.

The "hackability" of signatures depends on their length, encoding, and the underlying cryptographic function:
* QR-token's 5-character hex signature (HMAC-SHA256): 16^5 = 1,048,576 possibilities. While relatively low, it's primarily for reducing database hits, not as the main security feature. The use of HMAC-SHA256 ensures the integrity of the token.
* Short-token's 10-character Base64URL signature (HMAC-SHA256): 64^10 ≈ 1.15 * 10^18 possibilities. This, combined with the token's entropy, expiration, and the strength of HMAC-SHA256, provides strong protection against forgery attempts.


## Conclusion

Our token system balances security, usability, and specific use-case requirements. The use of HMAC-SHA256 for signatures in both QR-tokens and Short-tokens provides a cryptographically strong foundation. While each token type has its strengths and potential vulnerabilities, the combination of robust cryptographic techniques, database validation, expiration mechanisms, and rate limiting creates a secure and efficient token ecosystem.