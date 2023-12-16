import { SetMetadata } from "@nestjs/common";
import { UserType } from "src/user/enum/user-type.enum";

//representam os tipos de usuários (roles) associados a uma determinada rota
export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserType[]) => SetMetadata(ROLES_KEY, roles)