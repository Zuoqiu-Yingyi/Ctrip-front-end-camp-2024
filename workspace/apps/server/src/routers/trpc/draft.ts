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
    createMutation,
    updateMutation,
    deleteMutation,
} from "./../../controllers/draft";

export const draftRouter = router({
    /**
     * 查询草稿数量
     */
    count: countQuery,

    /**
     * 查询草稿列表
     */
    list: listQuery,

    /**
     * 分页查询草稿
     */
    paging: pagingQuery,

    /**
     * 创建草稿
     */
    create: createMutation,

    /**
     * 更新草稿
     */
    update: updateMutation,

    /**
     * 删除草稿
     */
    delete: deleteMutation,
});
export type TDraftRouter = typeof draftRouter;
export default draftRouter;
