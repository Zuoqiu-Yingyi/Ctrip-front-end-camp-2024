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
     * TODO: 删除账户
     */
    // delete,
});
export type TAccountRouter = typeof accountRouter;
export default accountRouter;
