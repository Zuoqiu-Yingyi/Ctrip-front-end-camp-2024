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
import {
    //
    countQuery,
    listQuery,
    pagingQuery,
    searchQuery,
    deleteMutation,
} from "./../../controllers/publish";

export const publishRouter = router({
    /**
     * 查询已发布的数量
     */
    count: countQuery,

    /**
     * 查询发布列表
     */
    list: listQuery,

    /**
     * 分页查询发布列表
     */
    paging: pagingQuery,

    /**
     * 搜索发布内容
     */
    search: searchQuery,

    /**
     * 删除发布内容
     */
    delete: deleteMutation,
});
export type TPublishRouter = typeof publishRouter;
export default publishRouter;
