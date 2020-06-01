export interface JwtToken {
    iat: number,
    exp: number,
    aud?: string,
    iss?: string,
    sub?: string
}