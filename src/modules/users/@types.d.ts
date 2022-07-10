import { ObjectId } from "mongoose";

namespace UsersModule {
  interface BaseUser {
    username: string;
    password: string;
  }

  export interface UserModel extends BaseUser {
    _id: ObjectId;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface CreateUserDTO extends BaseUser {}

  export interface UserDTO extends UserModel {}

  export interface AuthUser extends BaseUser {}
}

namespace UserActions {
  type CreateUser = (
    user: UsersModule.CreateUserDTO
  ) => Promise<UsersModule.UserDTO>;
}
