/**
 * Copyright (C) 2024 Zuoqiu Yingyi
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { router } from ".";
import { signupMutation } from "./../../controllers/signup";
import { loginMutation } from "./../../controllers/login";
import { logoutMutation } from "./../../controllers/logout";
import {
    //
    infoQuery,
    updateInfoMutation,
    changePasswordMutation,
    closeMutation,
} from "./../../controllers/account";

export const accountRouter = router({
    /**
     * 注册账户
     */
    signup: signupMutation,
    /**
     * 登录账户
     */
    login: loginMutation,
    /**
     * 注销账户
     */
    logout: logoutMutation,
    /**
     * 查询账户信息
     */
    info: infoQuery,
    /**
     * 更改账户信息
     */
    update_info: updateInfoMutation,
    /**
     * 更改密码
     */
    change_password: changePasswordMutation,
    /**
     * 关闭账户
     */
    close: closeMutation,
});
export type TAccountRouter = typeof accountRouter;
export default accountRouter;
