import { LoginPayload } from '../auth/dtos/loginPayload.dto';
// Função que converte um token JWT do cabeçalho de autorização para um objeto LoginPayload
export const authorizationToLoginPayload = (
  authorization: string,
): LoginPayload | undefined => {
  // Divide o token JWT em partes usando o ponto como delimitador
  const authorizationSplited = authorization.split('.');
// Verifica se o token tem pelo menos 3 partes e se a segunda parte (dados) está presente
  if (authorizationSplited.length < 3 || !authorizationSplited[1]) {
    return undefined
  }
// Decodifica a segunda parte do token (dados) que está em base64 e converte para string
  return JSON.parse(Buffer.from(authorizationSplited[1], 'base64').toString('ascii'))
};
