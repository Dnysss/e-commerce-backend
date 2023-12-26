import { compare, hash } from "bcrypt";

// Função para criar um hash de senha usando bcrypt
export const createPasswordHashed = async (password: string): Promise<string> => {
    // Nível de criptografia, quanto maior, mais seguro (cost factor)
    const crypt = 10;
    // Gera o hash da senha usando bcrypt
    return hash(password, crypt)
}
// Função para validar uma senha em relação ao hash usando bcrypt
export const vaildatePassword = async (password: string, passwordHashed:string): Promise<boolean> => {
    // Compara a senha fornecida com o hash usando bcrypt e retorna true se for uma correspondência
    return compare(password, passwordHashed)
}
