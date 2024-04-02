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
    submittedQuery,
    submitMutation,
    cancelMutation,
    approveMutation,
} from "./../../controllers/review";

export const reviewRouter = router({
    /**
     * 查询审批项数量 (员工)
     */
    count: countQuery,

    /**
     * 查询审批项列表 (员工)
     */
    list: listQuery,

    /**
     * 分页查询审批项 (员工)
     */
    paging: pagingQuery,

    /**
     * 查询已提交的审批项 (用户)
     */
    submitted: submittedQuery,

    /**
     * 提交审批项 (用户)
     */
    submit: submitMutation,

    /**
     * 取消审批项 (用户)
     */
    cancel: cancelMutation,

    /**
     * 批准审批项 (员工)
     */
    approve: approveMutation,
});
export type TPreviewRouter = typeof reviewRouter;
export default reviewRouter;
